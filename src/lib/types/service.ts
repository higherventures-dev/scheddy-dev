export interface Service {
  id: string;
  profile_id: string;
  category_id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  order_index?: number;
  // add any other fields from your `services` table
};