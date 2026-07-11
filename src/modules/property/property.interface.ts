export interface IProperty {
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  available?: boolean;
  categoryId: string;
}

export type IUpdateProperty = Partial<IProperty>;

export interface IPropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  available?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}