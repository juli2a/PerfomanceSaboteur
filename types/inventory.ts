// Shared data types for Inventory Control page

export type LogisticStatus = "In Stock" | "To Order" | "Ordered" | "In Transit" | "Out of Stock";

export interface BaseProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
  discountPercentage: number;
  rating: number;
  brand?: string;
}

export interface AmplifiedProduct extends BaseProduct {
  sku: string;
  logisticStatus: LogisticStatus;
}
