import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    rentalRequestId: z.string().min(1, "Rental request ID is required"),
    provider: z.enum(["STRIPE"], {
      message: "Provider must be STRIPE",
    }),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    paymentId: z.string().min(1, "Payment ID is required"),
    transactionId: z.string().min(1, "Transaction ID is required"),
  }),
});

export const paymentFiltersSchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z.string().default('createdAt').optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  }).default({}),
});