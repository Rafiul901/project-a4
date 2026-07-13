export interface ICreatePayment {
  rentalRequestId: string;
  provider: "STRIPE";
}

export interface IConfirmPayment {
  paymentId: string;
  transactionId: string;
}

export interface IPaymentFilters {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IStripeSession {
  id: string;
  url: string;
  paymentIntent: string;
}