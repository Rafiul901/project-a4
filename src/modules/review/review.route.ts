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


router.post(
  "/",
  auth,
  authorize("TENANT"),
  validateRequest(createReviewSchema),
  ReviewController.createReview
);


router.get(
  "/my-reviews",
  auth,
  authorize("TENANT"),
  validateRequest(reviewFiltersSchema),
  ReviewController.getTenantReviews
);


router.get(
  "/property/:propertyId",
  validateRequest(reviewFiltersSchema),
  ReviewController.getPropertyReviews
);


router.get(
  "/:id",
  auth,
  ReviewController.getReviewById
);

router.patch(
  "/:id",
  auth,
  authorize("TENANT"),
  validateRequest(createReviewSchema),
  ReviewController.updateReview
);


router.delete(
  "/:id",
  auth,
  authorize("TENANT", "ADMIN"),
  ReviewController.deleteReview
);

export default router;