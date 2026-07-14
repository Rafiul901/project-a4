import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
import { PaymentStatus, RentalStatus, Role, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../utils/AppError";



const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // Validate role query param
  let role: Role | undefined;
  if (req.query.role) {
    const roleValue = req.query.role as string;
    if (Object.values(Role).includes(roleValue as Role)) {
      role = roleValue as Role;
    }
  }

  
  let status: UserStatus | undefined;
  if (req.query.status) {
    const statusValue = req.query.status as string;
    if (Object.values(UserStatus).includes(statusValue as UserStatus)) {
      status = statusValue as UserStatus;
    }
  }

  const filters = {
    role,
    status,
    search: req.query.search as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string || 'createdAt',
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
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
  const id  = req.params.id as string;
  const result = await AdminService.getUserById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});


const updateUser = catchAsync(async (req: Request, res: Response) => {
  const  id  = req.params.id as string;

  const payload: any = {};
  
  if (req.body.name) payload.name = req.body.name;
  if (req.body.email) payload.email = req.body.email;
  if (req.body.phone) payload.phone = req.body.phone;
  
 
  if (req.body.role) {
    if (Object.values(Role).includes(req.body.role as Role)) {
      payload.role = req.body.role as Role;
    } else {
      throw new AppError(400, `Invalid role. Must be one of: ${Object.values(Role).join(', ')}`);
    }
  }
  

  if (req.body.status) {
    if (Object.values(UserStatus).includes(req.body.status as UserStatus)) {
      payload.status = req.body.status as UserStatus;
    } else {
      throw new AppError(400, `Invalid status. Must be one of: ${Object.values(UserStatus).join(', ')}`);
    }
  }

  const result = await AdminService.updateUser(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id  = req.params.id as string;
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
    sortBy: req.query.sortBy as string || 'createdAt',
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
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
  // Validate status query param
  let status: RentalStatus | undefined;
  if (req.query.status) {
    const statusValue = req.query.status as string;
    if (Object.values(RentalStatus).includes(statusValue as RentalStatus)) {
      status = statusValue as RentalStatus;
    }
  }

  const filters = {
    status,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string || 'createdAt',
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
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
  // Validate status query param
  let status: PaymentStatus | undefined;
  if (req.query.status) {
    const statusValue = req.query.status as string;
    if (Object.values(PaymentStatus).includes(statusValue as PaymentStatus)) {
      status = statusValue as PaymentStatus;
    }
  }

  const filters = {
    status,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string || 'createdAt',
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
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