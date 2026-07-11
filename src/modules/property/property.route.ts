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


router.post(
  "/",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(createPropertySchema),
  PropertyController.createProperty
);

router.get(
  "/",
  validateRequest(propertyFiltersSchema),
  PropertyController.getAllProperties
);


router.get("/:id", PropertyController.getSingleProperty);


router.patch(
  "/:id",
  auth,
  authorize("LANDLORD", "ADMIN"),
  validateRequest(updatePropertySchema),
  PropertyController.updateProperty
);


router.delete(
  "/:id",
  auth,
  authorize("LANDLORD", "ADMIN"),
  PropertyController.deleteProperty
);

export default router;