


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

// 1️⃣ Create Payment with Stripe
const createPayment = async (payload: ICreatePayment, tenantId: string) => {
  const { rentalRequestId, provider } = payload;

  // Check if rental request exists and is APPROVED
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: {
      property: true,
      tenant: true,
    },
  });

  if (!rental) {
    throw new AppError(404, "Rental request not found");
  }

  // Check authorization: Only the tenant who owns the rental can pay
  if (rental.tenantId !== tenantId) {
    throw new AppError(403, "You are not authorized to pay for this rental");
  }

  // Check if rental is approved
  if (rental.status !== "APPROVED") {
    throw new AppError(400, "Rental request must be approved before payment");
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { rentalRequestId },
  });

  if (existingPayment) {
    throw new AppError(409, "Payment already exists for this rental");
  }

  // Get property price
  const amount = rental.property.price;

  // Create Stripe Checkout Session
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
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    metadata: {
      rentalRequestId: rental.id,
      tenantId: rental.tenantId,
      propertyId: rental.propertyId,
    },
  });

  // Create payment record in database
  const payment = await prisma.payment.create({
    data: {
      rentalRequestId: rental.id,
      amount: amount,
      provider: provider,
      status: "PENDING",
      transactionId: session.payment_intent as string,
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

// 2️⃣ Confirm Payment
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

  // Verify payment with Stripe
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
    
    if (paymentIntent.status !== "succeeded") {
      throw new AppError(400, "Payment not completed in Stripe");
    }
  } catch (error: any) {
    throw new AppError(400, "Failed to verify payment: " + error.message);
  }

  // Use transaction to update all related records
  const result = await prisma.$transaction(async (tx) => {
    // Update payment
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
        transactionId: transactionId,
      },
      include: paymentInclude,
    });

    // Update rental request status to ACTIVE
    await tx.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: { status: "ACTIVE" },
    });

    // Update property availability
    await tx.property.update({
      where: { id: payment.rentalRequest.propertyId },
      data: { available: false },
    });

    // Reject all other pending requests for this property
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

// 3️⃣ Get Payment History (Tenant)
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

// 4️⃣ Get Single Payment
const getPaymentById = async (id: string, userId: string, userRole: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: paymentInclude,
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  // Authorization: Only tenant, landlord, or admin can view
  const isTenant = payment.rentalRequest.tenantId === userId;
  const isLandlord = payment.rentalRequest.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError(403, "You are not authorized to view this payment");
  }

  return payment;
};

// 5️⃣ Handle Stripe Webhook
const handleStripeWebhook = async (event: any) => {
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const rentalRequestId = paymentIntent.metadata?.rentalRequestId;

      if (!rentalRequestId) {
        console.log('No rentalRequestId found in metadata');
        break;
      }

      // Find the payment
      const payment = await prisma.payment.findFirst({
        where: {
          transactionId: paymentIntent.id,
          rentalRequestId: rentalRequestId,
        },
      });

      if (payment && payment.status !== "COMPLETED") {
        // Confirm the payment
        await confirmPayment({
          paymentId: payment.id,
          transactionId: paymentIntent.id,
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      
      // Update payment status to FAILED
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