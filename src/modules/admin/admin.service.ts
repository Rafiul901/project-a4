
import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";


const getAllUsers = async (filters: {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const {
    role,
    status,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;


  const where: any = {};

  if (role) {
    where.role = role;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ============================================
// 2️⃣ GET SINGLE USER
// ============================================
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      // Include related data
      properties: {
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
          available: true,
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      rentalRequests: {
        select: {
          id: true,
          status: true,
          property: {
            select: {
              id: true,
              title: true,
            },
          },
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          property: {
            select: {
              id: true,
              title: true,
            },
          },
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};


const updateUser = async (
  id: string,
  payload: {
    name?: string;
    email?: string;
    phone?: string;
    role?: "TENANT" | "LANDLORD" | "ADMIN";
    status?: "ACTIVE" | "BANNED";
  }
) => {

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }


  if (payload.status === "BANNED" && user.role === "ADMIN") {
    throw new AppError(403, "Cannot ban an admin user");
  }


  if (payload.role && user.role === "ADMIN") {
    throw new AppError(403, "Cannot change admin role");
  }


  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};


const deleteUser = async (id: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "ADMIN") {
    throw new AppError(403, "Cannot delete an admin user");
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: "User deleted successfully" };
};


const getDashboardStats = async () => {
  const [
    totalUsers,
    totalProperties,
    totalRentals,
    totalPayments,
    totalReviews,
    recentProperties,
    recentRentals,
    revenueData,
  ] = await Promise.all([
 
    prisma.user.count(),
 
    prisma.property.count(),
    

    prisma.rentalRequest.count(),
    

    prisma.payment.count(),
    
   
    prisma.review.count(),

    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    }),
    
 
    prisma.rentalRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    }),
    
    
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
      _count: true,
    }),
  ]);

 
  const userDistribution = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true,
    },
  });

  
  const propertyDistribution = await prisma.property.groupBy({
    by: ["available"],
    _count: {
      available: true,
    },
  });

 
  const rentalDistribution = await prisma.rentalRequest.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  return {
    stats: {
      totalUsers,
      totalProperties,
      totalRentals,
      totalPayments,
      totalReviews,
      totalRevenue: revenueData._sum.amount || 0,
      completedPayments: revenueData._count,
    },
    distribution: {
      users: userDistribution,
      properties: propertyDistribution,
      rentals: rentalDistribution,
    },
    recent: {
      properties: recentProperties,
      rentals: recentRentals,
    },
  };
};


const getAllProperties = async (filters: {
  available?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const {
    available,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (available !== undefined) {
    where.available = available;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        _count: {
          select: {
            rentalRequests: true,
            reviews: true,
          },
        },
      },
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


const getAllRentals = async (filters: {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {};

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
      include: {
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
        payment: true,
      },
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


const getAllPayments = async (filters: {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        rentalRequest: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            property: {
              select: {
                id: true,
                title: true,
                price: true,
                location: true,
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const AdminService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllProperties,
  getAllRentals,
  getAllPayments,
};