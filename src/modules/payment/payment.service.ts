import Stripe from "stripe";
import { IConfirmPayment, ICreatePayment, IPaymentFilters } from "./payment.interface";
import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any,
});

const paymentInclude = {
  rentalRequest: {
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};


const createPayment = async (payload: ICreatePayment, tenantId: string) => {
  const { rentalRequestId, provider } = payload;

  
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: {
      property: true,
      tenant: true,
    },
  });

  if (!rental) {
    throw new AppError(404, "not found");
  }


  if (rental.tenantId !== tenantId) {
    throw new AppError(403, "You are not authorized to pay for this rental");
  }

  
  if (rental.status !== "APPROVED") {
    throw new AppError(400, "Rental request must be approved before payment");
  }


  const existingPayment = await prisma.payment.findUnique({
    where: { rentalRequestId },
  });

  if (existingPayment) {
    throw new AppError(409, "Payment already exists for this rental");
  }


  const amount = rental.property.price;


  const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5000";

 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Rent Payment - ${rental.property.title}`,
            description: `Payment for ${rental.property.title} - ${rental.property.location}`,
          },
          unit_amount: Math.round(amount * 100), 
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${frontendBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendBaseUrl}/payment/cancel`,
    metadata: {
      rentalRequestId: rental.id,
      tenantId: rental.tenantId,
      propertyId: rental.propertyId,
    },
  });


  const payment = await prisma.payment.create({
    data: {
      rentalRequest: {
        connect: { id: rental.id },
      },
      amount: amount,
      provider: provider as any, 
      status: "PENDING",
    
      transactionId: (session.payment_intent as string) || session.id, 
    },
    include: paymentInclude,
  });

  return {
    payment,
    stripeSession: {
      id: session.id,
      url: session.url,
      paymentIntent: session.payment_intent,
    },
  };
};


const confirmPayment = async (payload: IConfirmPayment) => {
  const { paymentId, transactionId } = payload;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (payment.status === "COMPLETED") {
    throw new AppError(400, "Payment already completed");
  }


  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
    
    if (paymentIntent.status !== "succeeded") {
      throw new AppError(400, "Payment not completed in Stripe");
    }
  } catch (error: any) {
    throw new AppError(400, "Failed to verify payment: " + error.message);
  }


  const result = await prisma.$transaction(async (tx) => {

    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
        transactionId: transactionId,
      },
      include: paymentInclude,
    });

  
    await tx.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: { status: "ACTIVE" },
    });


    await tx.property.update({
      where: { id: payment.rentalRequest.propertyId },
      data: { available: false },
    });


    await tx.rentalRequest.updateMany({
      where: {
        propertyId: payment.rentalRequest.propertyId,
        status: "PENDING",
        NOT: {
          id: payment.rentalRequestId,
        },
      },
      data: {
        status: "REJECTED",
      },
    });

    return updatedPayment;
  });

  return result;
};

const getPaymentHistory = async (tenantId: string, filters: IPaymentFilters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {
    rentalRequest: {
      tenantId,
    },
  };

  if (status) {
    where.status = status;
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: paymentInclude,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const getPaymentById = async (id: string, userId: string, userRole: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: paymentInclude,
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }


  const isTenant = payment.rentalRequest.tenantId === userId;
  const isLandlord = payment.rentalRequest.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError(403, "You are not authorized to view this payment");
  }

  return payment;
};


const handleStripeWebhook = async (event: any) => {
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const rentalRequestId = paymentIntent.metadata?.rentalRequestId;

      if (!rentalRequestId) {
        console.log('No rentalRequestId found in metadata');
        break;
      }

     
      const payment = await prisma.payment.findFirst({
        where: {
          transactionId: paymentIntent.id,
          rentalRequestId: rentalRequestId,
        },
      });

      if (payment && payment.status !== "COMPLETED") {
  
        await confirmPayment({
          paymentId: payment.id,
          transactionId: paymentIntent.id,
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      

      await prisma.payment.updateMany({
        where: {
          transactionId: paymentIntent.id,
          status: "PENDING",
        },
        data: {
          status: "FAILED",
        },
      });
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export const PaymentService = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
  handleStripeWebhook,
};