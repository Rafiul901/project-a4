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


router.post(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(createRentalSchema),
  RentalController.createRental
);


router.get(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(rentalFiltersSchema),
  RentalController.getTenantRentals
);


router.get(
  "/:id",
  auth,
  RentalController.getRentalById
);


router.patch(
  "/:id/cancel",
  auth,
  authorize("TENANT"),
  RentalController.cancelRentalRequest
);


router.get(
  "/landlord/requests",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(rentalFiltersSchema),
  RentalController.getLandlordRequests
);

router.patch(
  "/landlord/requests/:id",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(updateRentalStatusSchema),
  RentalController.updateRentalStatus
);

export default router;