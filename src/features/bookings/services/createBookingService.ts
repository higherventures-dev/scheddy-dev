'use server';

import { createClient } from '@/utils/supabase/client';
import { sendBookingConfirmationEmail } from '@/features/bookings/services/sendBookingConfirmationEmail';
import { createClientService } from '@/features/clients/services/createClientService'; // make sure this name matches the actual export

export async function createBooking(data: {
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  notes: string;
  service_id: string;
  title: string;
  price: number;
  status: number;
  studio_id?: string;
  artist_id: string;
  client_id?: string;
  user_id?: string;
  selected_date?: string;
  selected_time?: string;
}) {
  const supabase = await createClient();

  // Step 1: Get or create client
  let client_id = data.client_id;

  if (!client_id || client_id.length === 0) {
    client_id = await createClientService({
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email_address: data.email_address,
      artist_id: data.artist_id,
      studio_id: data.studio_id,
    });
  }
 
  const user_id = data.user_id ?? null;

  // Step 2: Parse and combine date/time
  const DEFAULT_DURATION_MINUTES = 60;
  const dateString = data.selected_date ?? '2025-08-16T07:00:00.000Z';
  const timeString = data.selected_time ?? '02:00 PM';

  const selectedDate = new Date(dateString).toISOString().split('T')[0];

  function convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }

  const selectedTime24 = convertTo24Hour(timeString);
  const combinedStart = new Date(`${selectedDate}T${selectedTime24}`);

  if (isNaN(combinedStart.getTime())) {
    throw new Error('Invalid start time');
  }

  const start_time = combinedStart;
  const end_time = new Date(start_time.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);

  // Step 2: Fetch the artist's profile to check the booking confirmation setting
  const { data: automaticBookingConfirmations, error: profileError } = await supabase
    .from('profiles')
    .select('automatic_booking_confirmations')
    .eq('id', data.artist_id)
    .single();
  
  if (profileError) {
    console.error('Error fetching artist profile:', profileError.message);
    throw profileError;
  }
  const bookingStatus = 1;
  if (automaticBookingConfirmations)
  {
    let bookingStatus = 2;
  } 

  // Step 3: Insert booking
  const { data: inserted, error: insertError } = await supabase
    .from('bookings')
    .insert([{
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email_address: data.email_address,
      notes: data.notes,
      service_id: data.service_id,
      title: data.title,
      price: data.price,
      status: bookingStatus,
      studio_id: data.studio_id,
      artist_id: data.artist_id,
      client_id,
      user_id,
      start_time,
      end_time,
    }])
    .select();

  if (insertError) {
    console.error('Supabase Insert Error:', insertError.message, insertError.details);
    throw insertError;
  }

  const booking = inserted[0];

  // Step 4: Send confirmation email
  await sendBookingConfirmationEmail(data.email_address, data.title, booking);

  return inserted;
}
