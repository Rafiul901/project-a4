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
      role: true,
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
          role: true,
        },
      },
    },
  },
};

const createRental = async (payload: IRental, tenantId: string) => {
  const { propertyId, moveInDate } = payload;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      id: true,
      available: true,
      landlordId: true,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  if (!property.available) {
    throw new AppError(400, "Property is not available for rent");
  }

  if (property.landlordId === tenantId) {
    throw new AppError(400, "You cannot request to rent your own property");
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    throw new AppError(409, "You already have a pending request for this property");
  }

  const createData: any = {
    tenantId,
    propertyId,
    status: "PENDING",
    moveInDate: moveInDate ? new Date(moveInDate) : new Date(), 
  };

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

  if (rental.property.landlordId !== landlordId) {
    throw new AppError(403, "You are not authorized to manage this rental request");
  }

  if (rental.status !== "PENDING") {
    throw new AppError(400, `This request has already been ${rental.status.toLowerCase()}`);
  }

  if (status === "APPROVED" && !rental.property.available) {
    throw new AppError(400, "Property is no longer available");
  }

  const updatedRental = await prisma.$transaction(async (tx) => {
    const updated = await tx.rentalRequest.update({
      where: { id },
      data: { status },
      include: rentalInclude,
    });

    if (status === "APPROVED") {
      await tx.property.update({
        where: { id: rental.propertyId },
        data: { available: false },
      });

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