import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { IPaymentFilters } from "./payment.interface";
import Stripe from "stripe";
import AppError from "../../utils/AppError";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any,
});


const createPayment = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user.id;
  const result = await PaymentService.createPayment(req.body, tenantId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.confirmPayment(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
});


const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user.id;
  const filters: IPaymentFilters = {
    status: req.query.status as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await PaymentService.getPaymentHistory(tenantId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment history retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getPaymentById = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id as string; 
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await PaymentService.getPaymentById(id, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});


const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  

  if (!sig || typeof sig !== 'string') {
    throw new AppError(400, "Missing or invalid Stripe signature header");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
 
    throw new AppError(400, `Webhook Error: ${err.message}`);
  }

  await PaymentService.handleStripeWebhook(event);
  

  res.status(200).json({ received: true });
});

export const PaymentController = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
  stripeWebhook,
};