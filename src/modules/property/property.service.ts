import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import { IProperty, IPropertyFilters, IUpdateProperty } from "./property.interface";


const propertyInclude = {
  landlord: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  category: true,
};

const createProperty = async (payload: IProperty, landlordId: string) => {
  const { categoryId, ...propertyData } = payload;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return await prisma.property.create({
    data: {
      ...propertyData,
      categoryId,
      landlordId,
    },
    include: propertyInclude,
  });
};

const getAllProperties = async (filters: IPropertyFilters) => {
  const {
    location,
    minPrice,
    maxPrice,
    category,
    available,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;
  const where: Prisma.PropertyWhereInput = {};

  if (location) {
    where.location = {
      mode: "insensitive",
      contains: location,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (category) {
    where.categoryId = category;
  }

  if (available !== undefined) {
    where.available = available;
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: propertyInclude,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleProperty = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: propertyInclude,
  });

  if (!property) {
    throw new AppError(404, "No Property found");
  }

  return property;
};

const updateProperty = async (
  id: string,
  payload: IUpdateProperty,
  userId: string,
  userRole: string
) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id },
    select: { landlordId: true },
  });

  if (!existingProperty) {
    throw new AppError(404, "No Property found");
  }

  if (userRole !== "ADMIN" && existingProperty.landlordId !== userId) {
    throw new AppError(403, "You can only update your own properties");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new AppError(404, "Category not found");
    }
  }

  return await prisma.property.update({
    where: { id },
    data: payload,
    include: propertyInclude,
  });
};

const deleteProperty = async (id: string, userId: string, userRole: string) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id },
    select: { landlordId: true },
  });

  if (!existingProperty) {
    throw new AppError(404, "No Property found");
  }

  if (userRole !== "ADMIN" && existingProperty.landlordId !== userId) {
    throw new AppError(403, "You can only delete your own properties");
  }

  await prisma.property.delete({
    where: { id },
  });

  return { message: "Property deleted!!" };
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};