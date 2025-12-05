export interface Item {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  rarity?: string;
  description: string;
  properties?: string[];
  weight: number;
  imageUrl?: string;
}
