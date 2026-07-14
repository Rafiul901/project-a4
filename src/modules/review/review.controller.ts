import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import { IReviewFilters } from "./review.interface";

// 1️⃣ Create Review (Tenant only)
const createReview = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user.id;
  const result = await ReviewService.createReview(req.body, tenantId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

// 2️⃣ Get Reviews for a Property (Public)
const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  // 🌟 FIXED: Changed from destructuring to explicit string type-casting
  const propertyId = req.params.propertyId as string;
  
  const filters: IReviewFilters = {
    rating: req.query.rating ? Number(req.query.rating) : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await ReviewService.getPropertyReviews(propertyId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// 3️⃣ Get Tenant's Reviews
const getTenantReviews = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user.id;
  const filters: IReviewFilters = {
    rating: req.query.rating ? Number(req.query.rating) : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await ReviewService.getTenantReviews(tenantId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// 4️⃣ Get Single Review
const getReviewById = catchAsync(async (req: Request, res: Response) => {
  // 🌟 FIXED: Changed from destructuring to explicit string type-casting
  const id = req.params.id as string;
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await ReviewService.getReviewById(id, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

// 5️⃣ Update Review (Tenant only)
const updateReview = catchAsync(async (req: Request, res: Response) => {
  // 🌟 FIXED: Changed from destructuring to explicit string type-casting
  const id = req.params.id as string;
  const tenantId = req.user.id;
  const result = await ReviewService.updateReview(id, req.body, tenantId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

// 6️⃣ Delete Review (Tenant or Admin)
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  // 🌟 FIXED: Changed from destructuring to explicit string type-casting
  const id = req.params.id as string;
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await ReviewService.deleteReview(id, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getPropertyReviews,
  getTenantReviews,
  getReviewById,
  updateReview,
  deleteReview,
};