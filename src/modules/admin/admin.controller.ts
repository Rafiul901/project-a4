import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    role: req.query.role as string,
    status: req.query.status as string,
    search: req.query.search as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await AdminService.getAllUsers(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getUserById = catchAsync(async (req: Request, res: Response) => {
const id = req.params.id as string;
  const result = await AdminService.getUserById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});


const updateUser = catchAsync(async (req: Request, res: Response) => {
 const id = req.params.id as string;
  const result = await AdminService.updateUser(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});


const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AdminService.deleteUser(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});


const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: result,
  });
});


const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    available: req.query.available === 'true' ? true : req.query.available === 'false' ? false : undefined,
    search: req.query.search as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await AdminService.getAllProperties(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    status: req.query.status as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await AdminService.getAllRentals(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rentals retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    status: req.query.status as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await AdminService.getAllPayments(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AdminController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllProperties,
  getAllRentals,
  getAllPayments,
};