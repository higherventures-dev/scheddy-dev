import { createClient } from '@/utils/supabase/client';
// import { sendBookingConfirmationEmail } from '@/features/bookings/services/sendBookingConfirmationEmail';

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
  start_time?: string;
  end_time?: string;
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

  const DEFAULT_DURATION_MINUTES = 60;

// Initialize start_time and end_time
let start_time: Date | null = null;
let end_time: Date | null = null;

// Make sure selectedDate and selectedTime are provided
if (data.selected_date && data.selected_time) {
  // Combine into full ISO string and create Date object
  const combinedStart = new Date(`${data.selected_date}T${data.selected_time}`);

  start_time = combinedStart;

  // Add default duration to compute end_time
  end_time = new Date(combinedStart.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);
} else {
  throw new Error("Missing selectedDate or selectedTime");
}

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

  // // Step 2: Fetch artist profile to get email
  // const { data: artistData, error: artistError } = await supabase
  //   .from('users') // or 'artists' if separate
  //   .select('first_name, last_name, email')
  //   .eq('id', data.artist_id)
  //   .single();

  // if (artistError) {
  //   console.error('Error fetching artist info:', artistError);
  //   throw artistError;
  // }

  // const artistEmail = artistData?.email;
  // const artistName = `${artistData?.first_name} ${artistData?.last_name}`;

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
      start_time: start_time,
      end_time: end_time
    }]);

  if (insertError) {
    console.error('Supabase Insert Error:', insertError.message, insertError.details);
    throw insertError;
  }

  //const booking = inserted[0];

  // // Step 4: Send confirmation email to client
  // await sendBookingConfirmationEmail(data.email_address, {
  //   title: data.title,
  //   price: data.price,
  //   artistName: artistName,
  // });

  // // Optionally, also send to the artist
  // if (artistEmail) {
  //   await sendBookingConfirmationEmail(artistEmail, {
  //     title: data.title,
  //     price: data.price,
  //     artistName: `${data.first_name} ${data.last_name}`, // reversed for artist's view
  //   });
  // }

  return inserted;
}




// // src/services/createBookingService.ts
// import { createClient } from '@/utils/supabase/client'


// // Insert booking data into Supabase
// export async function createBooking(data: {
//   first_name: string;
//   last_name: string;
//   phone_number: string;
//   email_address: string;
//   notes: string;
//   service_id: string;
//   title: string;
//   price: number;
//   status: number;
//   studio_id: string;
//   artist_id: string;
//   client_id: string;
//   user_id: string;
// }) {
//   const supabase = await createClient(); // await here to get the client instance

  
//   const { data: inserted, error } = await supabase
//     .from('bookings')
//     .insert([
//       {
//         first_name: data.first_name,
//         last_name: data.last_name,
//         phone_number: data.phone_number,
//         email_address: data.email_address,
//         notes: data.notes,
//         service_id: data.service_id,
//         title: data.title,
//         price: data.price,
//         status: data.status,
//         studio_id: data.studio_id,
//         artist_id: data.artist_id,
//         client_id: data.client_id,
//         user_id: data.user_id,
//       },
//     ]);

//   if (error) {
//   console.error('Supabase Insert Error:', error.message, error.details);
//   throw error;
// }
//   return inserted;
// }
