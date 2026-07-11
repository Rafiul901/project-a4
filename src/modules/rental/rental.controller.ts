import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { IRentalFilters } from "./rental.interface";



const createRental = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user.id;
  const result = await RentalService.createRental(req.body, tenantId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rental request created successfully",
    data: result,
  });
});


const getTenantRentals = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user.id;
  
  const queryStatus = req.query.status as string;
  const targetStatus = queryStatus === "CANCELLED" ? "REJECTED" : queryStatus;

  const filters: IRentalFilters = {
    status: targetStatus as any,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await RentalService.getTenantRentals(tenantId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental history retrieved successfully",
    meta: result.meta, 
    data: result.data,
  });
});


const getRentalById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string; 
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await RentalService.getRentalById(id, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental request retrieved successfully",
    data: result,
  });
});


const getLandlordRequests = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user.id;
  
  const queryStatus = req.query.status as string;
  const targetStatus = queryStatus === "CANCELLED" ? "REJECTED" : queryStatus;

  const filters: IRentalFilters = {
    status: targetStatus as any,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await RentalService.getLandlordRequests(landlordId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Landlord rental requests retrieved successfully",
    meta: result.meta, 
    data: result.data,
  });
});


const updateRentalStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string; 
  const landlordId = req.user.id;
  const result = await RentalService.updateRentalStatus(id, req.body, landlordId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Rental request ${req.body.status.toLowerCase()} successfully`,
    data: result,
  });
});


const cancelRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string; 
  const tenantId = req.user.id;
  const result = await RentalService.cancelRentalRequest(id, tenantId);

  const clientResponseData = {
    ...result,
    status: "CANCELLED",
  };

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental request cancelled successfully",
    data: clientResponseData,
  });
});

export const RentalController = {
  createRental,
  getTenantRentals,
  getRentalById,
  getLandlordRequests,
  updateRentalStatus,
  cancelRentalRequest,
};