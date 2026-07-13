import { Router } from "express";
import express from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentController } from "./payment.controller";
import {
  createPaymentSchema,
  confirmPaymentSchema,
  paymentFiltersSchema,
} from "./payment.validation";

const router = Router();

// Create payment (Tenant only)
router.post(
  "/create",
  auth,
  authorize("TENANT"),
  validateRequest(createPaymentSchema),
  PaymentController.createPayment
);

// Confirm payment (Tenant only)
router.post(
  "/confirm",
  auth,
  authorize("TENANT"),
  validateRequest(confirmPaymentSchema),
  PaymentController.confirmPayment
);

// Get payment history (Tenant only)
router.get(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(paymentFiltersSchema),
  PaymentController.getPaymentHistory
);

// Get single payment (Tenant or Landlord or Admin)
router.get(
  "/:id",
  auth,
  PaymentController.getPaymentById
);

// Stripe Webhook (Public - no auth)
router.post(
  "/webhook",
  express.raw({ type: 'application/json' }),
  PaymentController.stripeWebhook
);

export default router;