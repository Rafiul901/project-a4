import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";


import { IPropertyFilters } from "./property.interface";
import sendResponse from "../../utils/sendResponse";
import { PropertyService } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await PropertyService.createProperty(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Property created successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getAllProperties(req.query as unknown as IPropertyFilters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  } as any);
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await PropertyService.getSingleProperty(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const result = await PropertyService.updateProperty(id, req.body, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
 const id = String(req.params.id);
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const result = await PropertyService.deleteProperty(id, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property deleted successfully",
    data: result,
  });
});

export const PropertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};