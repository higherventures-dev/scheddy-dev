'use server';

import { createClient } from '@/utils/supabase/client';
import { sendBookingConfirmationEmail } from '@/features/bookings/services/sendBookingConfirmationEmail';
import { sendBookingNotificationEmail } from '@/features/bookings/services/sendBookingNotificationEmail';

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
  studio_id: string;
  artist_id: string;
  client_id?: string;
  user_id?: string;
  selected_date?: string;
  selected_time?: string;
}) {
  
  const supabase = await createClient();

  // Step 1: Check if user exists
  const { data: existingUsers, error: userLookupError } = await supabase
    .from('users')
    .select('id')
    .eq('email', data.email_address)
    .limit(1);

  let client_id = data.client_id;
  let user_id = data.user_id;

  const DEFAULT_DURATION_MINUTES = 60; // or whatever you use

const dateString = "2025-08-16T07:00:00.000Z"; // your full date string
const timeString = "02:00 PM"; // your time string

// 1. Extract YYYY-MM-DD from date
const selectedDate = new Date(dateString).toISOString().split("T")[0]; // "2025-08-16"

// 2. Convert 12-hour time to 24-hour
function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
}

const selectedTime24 = convertTo24Hour(timeString); // "14:00:00"

// 3. Combine into valid ISO datetime
const combinedStart = new Date(`${selectedDate}T${selectedTime24}`);

if (isNaN(combinedStart)) {
  throw new Error("Invalid start time");
}

const start_time = combinedStart;
const end_time = new Date(start_time.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);

console.log({ start_time, end_time });
  
  // Uncomment this block if you want to send OTP if user doesn't exist
  // if (!existingUsers || existingUsers.length === 0 || userLookupError) {
  //   const { error: magicLinkError } = await supabase.auth.signInWithOtp({
  //     email: data.email_address,
  //   });

  //   if (magicLinkError) {
  //     console.error('Magic link sending error:', magicLinkError);
  //     throw magicLinkError;
  //   }
  // } else {
  //   user_id = existingUsers[0].id;
  // }

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
      status: data.status,
      studio_id: data.studio_id,
      artist_id: data.artist_id,
      client_id: client_id ?? null,
      user_id: user_id ?? null,
      start_time,
      end_time
    }])
    .select(); // ensure it returns inserted row(s)

  if (insertError) {
    console.error('Supabase Insert Error:', insertError.message, insertError.details);
    throw insertError;
  }

  const booking = inserted[0];

  // Step 4: Send confirmation email to client
  await sendBookingConfirmationEmail(data.email_address, data.title, booking);

  // // Step 5. Send confirmation email to artist
  // const { data: existingArtist, error } = await supabase
  // .from('users')
  // .select('email')
  // .eq('id', data.artist_id);
  //   const { data: existingUsers, error: userLookupError } = await supabase
  //   .from('users')
  //   .select('id')
  //   .eq('email', data.email_address)
  //   .limit(1);\
  // console.log("Artist", data.artist_id);
  // console.log("The Artist", existingArtist);

  // await sendBookingNotificationEmail(existingArtist.email, data.title, booking);
  return inserted;
}
