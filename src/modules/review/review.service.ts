
import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import { IReview, IReviewFilters } from "./review.interface";

const reviewInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  property: {
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};


const createReview = async (payload: IReview, tenantId: string) => {
  const { rating, comment, propertyId } = payload;

 
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

 
  const rental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: {
        in: ["ACTIVE", "APPROVED"],
      },
    },
  });

  if (!rental) {
    throw new AppError(
      403,
      "You can only review properties you have rented or are currently renting"
    );
  }


  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(409, "You have already reviewed this property");
  }

  
  return await prisma.review.create({
    data: {
      rating,
      comment,
      tenantId,
      propertyId,
    },
    include: reviewInclude,
  });
};


const getPropertyReviews = async (propertyId: string, filters: IReviewFilters) => {
  const {
    rating,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

 
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  const where: any = {
    propertyId,
  };

  if (rating) {
    where.rating = rating;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  
  const avgRating = await prisma.review.aggregate({
    where: { propertyId },
    _avg: {
      rating: true,
    },
  });

  return {
    data: reviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      averageRating: avgRating._avg.rating || 0,
      totalReviews: total,
    },
  };
};


const getTenantReviews = async (tenantId: string, filters: IReviewFilters) => {
  const {
    rating,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {
    tenantId,
  };

  if (rating) {
    where.rating = rating;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        property: {
          include: {
            category: true,
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const getReviewById = async (id: string, userId: string, userRole: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: reviewInclude,
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  
  const isTenant = review.tenantId === userId;
  const isLandlord = review.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError(403, "You are not authorized to view this review");
  }

  return review;
};


const updateReview = async (id: string, payload: Partial<IReview>, tenantId: string) => {
  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
    },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }


  if (review.tenantId !== tenantId) {
    throw new AppError(403, "You can only update your own reviews");
  }

  
  return await prisma.review.update({
    where: { id },
    data: payload,
    include: reviewInclude,
  });
};


const deleteReview = async (id: string, userId: string, userRole: string) => {
 
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
    },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  if (userRole !== "ADMIN" && review.tenantId !== userId) {
    throw new AppError(403, "You can only delete your own reviews");
  }

  await prisma.review.delete({
    where: { id },
  });

  return { message: "Review deleted successfully" };
};

export const ReviewService = {
  createReview,
  getPropertyReviews,
  getTenantReviews,
  getReviewById,
  updateReview,
  deleteReview,
};