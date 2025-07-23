// types/Profile.ts
export interface Profile {
  id: string;            // or number, depending on your DB schema
  slug: string;
  business_name: string;
  about: string;
  cancellation_policy: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  created_at?: string;
}