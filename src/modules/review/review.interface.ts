export interface IReview {
  rating: number;
  comment: string;
  propertyId: string;
}

export interface IReviewFilters {
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}