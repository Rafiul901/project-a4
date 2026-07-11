import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import validateRequest from "../../middlewares/validateRequest";
import { RentalController } from "./rental.controller";
import {
  createRentalSchema,
  updateRentalStatusSchema,
  rentalFiltersSchema,
} from "./rental.validation";

const router = Router();

// ==================== TENANT ROUTES ====================

// Create rental request (Tenant only)
router.post(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(createRentalSchema),
  RentalController.createRental
);

// Get tenant's rental history (Tenant only)
router.get(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(rentalFiltersSchema),
  RentalController.getTenantRentals
);

// Get single rental request (Tenant or Landlord or Admin)
router.get(
  "/:id",
  auth,
  RentalController.getRentalById
);

// Cancel rental request (Tenant only)
router.patch(
  "/:id/cancel",
  auth,
  authorize("TENANT"),
  RentalController.cancelRentalRequest
);

// ==================== LANDLORD ROUTES ====================

// Get landlord's property requests (Landlord only)
router.get(
  "/landlord/requests",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(rentalFiltersSchema),
  RentalController.getLandlordRequests
);

// Approve/Reject rental request (Landlord only)
router.patch(
  "/landlord/requests/:id",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(updateRentalStatusSchema),
  RentalController.updateRentalStatus
);

export default router;