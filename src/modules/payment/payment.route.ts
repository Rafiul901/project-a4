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


router.post(
  "/create",
  auth,
  authorize("TENANT"),
  validateRequest(createPaymentSchema),
  PaymentController.createPayment
);


router.post(
  "/confirm",
  auth,
  authorize("TENANT"),
  validateRequest(confirmPaymentSchema),
  PaymentController.confirmPayment
);


router.get(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(paymentFiltersSchema),
  PaymentController.getPaymentHistory
);


router.get(
  "/:id",
  auth,
  PaymentController.getPaymentById
);


router.post(
  "/webhook",
  express.raw({ type: 'application/json' }),
  PaymentController.stripeWebhook
);

export default router;