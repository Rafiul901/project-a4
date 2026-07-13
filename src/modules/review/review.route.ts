import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import {
  createReviewSchema,
  reviewFiltersSchema,
} from "./review.validation";

const router = Router();

// ==================== TENANT ROUTES ====================

// Create review (Tenant only)
router.post(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(createReviewSchema),
  ReviewController.createReview
);

// Get tenant's reviews (Tenant only)
router.get(
  "/my-reviews",
  auth,
  authorize("TENANT"),
  validateRequest(reviewFiltersSchema),
  ReviewController.getTenantReviews
);

// ==================== PUBLIC ROUTES ====================

// Get reviews for a property (Public)
router.get(
  "/property/:propertyId",
  validateRequest(reviewFiltersSchema),
  ReviewController.getPropertyReviews
);

// ==================== AUTHENTICATED ROUTES ====================

// Get single review (Tenant, Landlord, or Admin)
router.get(
  "/:id",
  auth,
  ReviewController.getReviewById
);

// Update review (Tenant only)
router.patch(
  "/:id",
  auth,
  authorize("TENANT"),
  validateRequest(createReviewSchema),
  ReviewController.updateReview
);

// Delete review (Tenant or Admin)
router.delete(
  "/:id",
  auth,
  authorize("TENANT", "ADMIN"),
  ReviewController.deleteReview
);

export default router;