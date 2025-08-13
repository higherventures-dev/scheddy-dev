import type { Profile } from './profile';
import type { Booking } from './booking';

export interface ClientProfileWithSummary {
  booking: Booking;
  profile: Profile;
  total_bookings: bigint;
  total_revenue: number;
  total_no_shows: number;
  total_canceled: number;
}