import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import { IRental, IRentalFilters, IUpdateRentalStatus } from "./rental.interface";



const rentalInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
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
          phone: true,
        },
      },
    },
  },
};

const createRental = async (payload: IRental, tenantId: string) => {
  const { propertyId, moveInDate, message } = payload;


  const createData: any = {
    tenantId,
    propertyId,
    message: message || null,
    status: "PENDING",
  };

  if (moveInDate) {
    createData.moveInDate = new Date(moveInDate);
  }

  return await prisma.rentalRequest.create({
    data: createData,
    include: rentalInclude,
  });
};


const getTenantRentals = async (tenantId: string, filters: IRentalFilters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {
    tenantId,
  };

  if (status) {
    where.status = status;
  }

  const [rentals, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: rentalInclude,
    }),
    prisma.rentalRequest.count({ where }),
  ]);

  return {
    data: rentals,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const getRentalById = async (id: string, userId: string, userRole: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: rentalInclude,
  });

  if (!rental) {
    throw new AppError(404, "Rental request not found");
  }

  // Authorization: Only tenant, landlord of property, or ADMIN can view
  const isTenant = rental.tenantId === userId;
  const isLandlord = rental.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError(403, "You are not authorized to view this rental request");
  }

  return rental;
};


const getLandlordRequests = async (landlordId: string, filters: IRentalFilters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {
    property: {
      landlordId,
    },
  };

  if (status) {
    where.status = status;
  }

  const [rentals, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: rentalInclude,
    }),
    prisma.rentalRequest.count({ where }),
  ]);

  return {
    data: rentals,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const updateRentalStatus = async (
  id: string,
  payload: IUpdateRentalStatus,
  landlordId: string
) => {
  const { status } = payload;

  // Get rental request with property info
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: {
        select: {
          id: true,
          landlordId: true,
          available: true,
        },
      },
    },
  });

  if (!rental) {
    throw new AppError(404, "Rental request not found");
  }

  // Check authorization: Only the landlord of the property can approve/reject
  if (rental.property.landlordId !== landlordId) {
    throw new AppError(403, "You are not authorized to manage this rental request");
  }

  // Check if request is still pending
  if (rental.status !== "PENDING") {
    throw new AppError(400, `This request has already been ${rental.status.toLowerCase()}`);
  }

  // If approving, check if property is still available
  if (status === "APPROVED" && !rental.property.available) {
    throw new AppError(400, "Property is no longer available");
  }

  // Update rental status
  const updatedRental = await prisma.$transaction(async (tx) => {
    // Update the main rental request
    const updated = await tx.rentalRequest.update({
      where: { id },
      data: { status },
      include: rentalInclude,
    });

    // If APPROVED, update property availability and reject other pending requests
    if (status === "APPROVED") {
      // Update property to not available
      await tx.property.update({
        where: { id: rental.propertyId },
        data: { available: false },
      });

      // Reject all other pending requests for this property
      await tx.rentalRequest.updateMany({
        where: {
          propertyId: rental.propertyId,
          status: "PENDING",
          NOT: {
            id: id,
          },
        },
        data: {
          status: "REJECTED",
        },
      });
    }

    return updated;
  });

  return updatedRental;
};


const cancelRentalRequest = async (id: string, tenantId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
      status: true,
    },
  });

  if (!rental) {
    throw new AppError(404, "Rental request not found");
  }

  if (rental.tenantId !== tenantId) {
    throw new AppError(403, "You can only cancel your own rental requests");
  }

  if (rental.status !== "PENDING") {
    throw new AppError(400, `Cannot cancel a request that is ${rental.status.toLowerCase()}`);
  }

  return await prisma.rentalRequest.update({
    where: { id },

    data: { 
      status: "REJECTED" as RentalStatus
    },
    include: rentalInclude,
  });
};

export const RentalService = {
  createRental,
  getTenantRentals,
  getRentalById,
  getLandlordRequests,
  updateRentalStatus,
  cancelRentalRequest,
};