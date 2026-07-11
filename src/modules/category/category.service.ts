
import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import { ICategory } from "./category.interface";



const createCategory = async (payload: ICategory) => {
  const exists = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (exists) {
    throw new AppError(409, "Category already exists");
  }

  return await prisma.category.create({
    data: payload,
  });
};

const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const CategoryService = {
  createCategory,
  getCategories,
};