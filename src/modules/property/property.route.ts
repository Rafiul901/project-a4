import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import validateRequest from "../../middlewares/validateRequest";
import { PropertyController } from "./property.controller";
import {
  createPropertySchema,
  updatePropertySchema,
  propertyFiltersSchema,
} from "./property.validation";

const router = Router();

// Create Property (LANDLORD only)
router.post(
  "/",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(createPropertySchema), // ← Remove "body" argument
  PropertyController.createProperty
);

// Get All Properties (Public with filters)
router.get(
  "/",
  validateRequest(propertyFiltersSchema), // ← Remove "query" argument
  PropertyController.getAllProperties
);

// Get Single Property (Public)
router.get("/:id", PropertyController.getSingleProperty);

// Update Property (LANDLORD only - owner check in service)
router.patch(
  "/:id",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(updatePropertySchema), // ← Remove "body" argument
  PropertyController.updateProperty
);

// Delete Property (LANDLORD only - owner check in service)
router.delete(
  "/:id",
  auth,
  authorize("LANDLORD", "ADMIN"),
  PropertyController.deleteProperty
);

export default router;