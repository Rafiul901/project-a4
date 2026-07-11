export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface IRental {
  propertyId: string;
  moveInDate?: string; 
  message?: string;
  status?: RentalStatus;
}

export interface IUpdateRentalStatus {
  status: "APPROVED" | "REJECTED";
}

export interface IRentalFilters {
  status?: RentalStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}