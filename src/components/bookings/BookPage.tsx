'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { createBooking } from '@/features/bookings/services/createBookingService';
import { formatServicePrice } from '@/lib/utils/formatServicePrice';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import ListTimePicker from '@/components/ui/ListTimePicker';
import DatePicker from '@/components/ui/DatePicker';
import ArtistGallery from "@/components/bookings/ArtistGallery";

function convertMinutesToHours(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs && mins) return `${hrs} hours | ${mins} mins`;
  if (hrs) return `${hrs} hours`;
  return `${mins} mins`;
}

export default function BookPage({ profile, services }: { profile: any; services: any[] }) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  if (!profile) {
    return <div className="text-center text-sm p-10">No profile found.</div>;
  }

  const formatAddress = (profile: any) => {
    const { address, address2, city, state, postal_code } = profile;

    if (!address) return 'No address provided';

    let line1 = address;
    if (address2) line1 += `, ${address2}`;

    let line2 = '';
    if (city) line2 += city;
    if (state) line2 += (line2 ? ', ' : '') + state;
    if (postal_code) line2 += (line2 ? ' ' : '') + postal_code;

    return (
      <>
        {line1}
        <br />
        {line2}
      </>
    );
  };

  // Modal and form states
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Validation errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!selectedService) {
      errors.selectedService = 'Please select a service.';
    }
    if (!selectedDate) {
      errors.selectedDate = 'Please select a date.';
    }
    if (!selectedTime || selectedTime.trim() === '') {
      errors.selectedTime = 'Please select a time.';
    }
    if (!firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Enter a valid phone number with 10-15 digits.';
    }
    if (!emailAddress.trim()) {
      errors.emailAddress = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailAddress.trim())
    ) {
      errors.emailAddress = 'Enter a valid email address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return;
    }

    const DEFAULT_DURATION_MINUTES = selectedService?.duration || 60;

    const combinedStart = new Date(
      `${selectedDate?.toISOString().split('T')[0]}T${selectedTime}`
    );

    const start_time = combinedStart;
    const end_time = new Date(combinedStart.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);

    const bookingData = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email_address: emailAddress,
      notes: notes,
      service_id: selectedService.id,
      title: selectedService.name,
      price: selectedService.price,
      price2: selectedService.price2,
      status: 1,
      artist_id: profile.id,
      user_id: profile.id,
      selected_date: selectedDate!.toISOString(),
      selected_time: selectedTime,
      start_time: start_time,
      end_time: end_time,
      allow_online_bookings: allow_online_bookings,
      hide_price_while_booking: selectedService.hide_price_while_booking,
      price_type: selectedService.price_type,
    };

    console.log('Booking Data:', bookingData);
    await createBooking(bookingData);

    setIsOpen(false);
    router.push(`/book/${slug}/thank-you`);

    // Reset form
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmailAddress('');
    setNotes('');
    setFormErrors({});
  };

  // Helper for input CSS class based on error presence
  const inputClass = (field: string) =>
    `w-full border rounded p-2 bg-[#292929] text-white ${
      formErrors[field] ? 'border-red-600' : 'border-gray-600'
    }`;

  // Determine logo url with fallback
  const logoSrc = profile.logo_url && profile.logo_url.trim() !== ''
    ? profile.logo_url
    : '/assets/images/business-avatar.png';

  // Determine display name fallback order
  const displayName = profile.business_name && profile.business_name.trim() !== ''
    ? profile.business_name
    : `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Profile';
  
  //set options
  const allow_online_bookings = profile.allow_online_bookings;
  const show_cancellation_policy = profile.show_cancellation_policy;

  return (
    <div>
      {/* Profile Header with logo and display name */}
      <div className="border-b border-[#313131] mt-2 text-center text-xs p-3 flex items-center justify-center gap-2">
        <Image
          src={logoSrc}
          alt={displayName}
          width={24}
          height={24}
          className="rounded-full object-cover"
          unoptimized={true} // Remove if your next.config.js allows remote domains
        />
        <span>{displayName}</span>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="w-full">
          <h1 className="text-2xl font-bold py-1">{profile.full_name || profile.display_name}</h1>
          <div className="text-xs text-gray-500 max-w-full pb-3">{formatAddress(profile)}</div>
        </div>

        <div className="w-full h-[200px] bg-cover bg-center mb-4 rounded-md relative">
          <ArtistGallery 
            bucketName="profile-headers" 
            userId={profile.id}
          />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Services</h2>
          <ul>
{(services || []).map((service: any, index: number) => {
  const formattedPrice = formatServicePrice(service);

  return (
    <li key={index}>
      <div className="grid grid-cols-2 items-center gap-4 border-b py-4">
        <div>
          <div className="text-xs font-medium">{service.name}</div>
          <div className="text-xs font-medium text-gray-400">{service.summary}</div>
          <div className="text-xs text-gray-500 mt-1">
            {/* Show price if not hidden and formattedPrice exists */}
            {formattedPrice && <span>{formattedPrice} – </span>}
            {convertMinutesToHours(service.duration) || '45 min'}
          </div>
        </div>
        <div className="text-right">
          {allow_online_bookings && (
            <button
              onClick={() => {
                setSelectedService(service);
                setIsOpen(true);
              }}
              className="text-xs border border-gray-400 rounded-md px-3 py-1 hover:bg-gray-100"
            >
              Book
            </button>
          )}
        </div>
      </div>
    </li>
  );
})}

          </ul>
          {formErrors.selectedService && (
            <p className="text-red-600 text-xs mt-1">{formErrors.selectedService}</p>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold pb-2">About</h2>
          <p className="text-xs">{profile.about || 'Not available.'}</p>
        </div>
        
           {show_cancellation_policy && (
        <div>
          <h2 className="text-2xl font-bold pb-2">Cancellation Policy</h2>
          <p className="text-xs">
            {profile.cancellation_policy ||
              'Appointments canceled or rescheduled within 24 hours may incur a 50% charge.'}
          </p>
        </div>
                 )}
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-[#323232] shadow-lg rounded-md p-6 text-white">
            {/* Service Info */}
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-1">{selectedService?.name}</h2>
              <p className="text-xs text-gray-300 mb-2">{selectedService?.summary}</p>
              <p className="text-xs text-gray-400">
                {selectedService?.price ? `$${selectedService.price}` : '$125'} –{' '}
                {convertMinutesToHours(selectedService?.duration) || '45 min'}
              </p>
            </div>

            <hr className="border-gray-600 my-4" />

            {/* Date Picker */}
            <div className="mb-2">
              <DatePicker value={selectedDate} onChange={setSelectedDate} />
              {formErrors.selectedDate && (
                <p className="text-red-600 text-xs mt-1">{formErrors.selectedDate}</p>
              )}
            </div>

            <hr className="border-gray-600 my-4" />

            {/* Time Picker */}
            <div className="mb-2">
              <ListTimePicker value={selectedTime} onChange={setSelectedTime} />
              {formErrors.selectedTime && (
                <p className="text-red-600 text-xs mt-1">{formErrors.selectedTime}</p>
              )}
            </div>

            <hr className="border-gray-600 my-4" />

            {/* Booking Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleConfirmBooking();
              }}
              className="space-y-4 text-[70%]"
              noValidate
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass('firstName')}
                    aria-invalid={!!formErrors.firstName}
                    aria-describedby="firstName-error"
                    required
                  />
                  {formErrors.firstName && (
                    <p id="firstName-error" className="text-red-600 text-xs mt-1">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass('lastName')}
                    aria-invalid={!!formErrors.lastName}
                    aria-describedby="lastName-error"
                    required
                  />
                  {formErrors.lastName && (
                    <p id="lastName-error" className="text-red-600 text-xs mt-1">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-1">Phone number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={inputClass('phoneNumber')}
                  aria-invalid={!!formErrors.phoneNumber}
                  aria-describedby="phoneNumber-error"
                  required
                />
                {formErrors.phoneNumber && (
                  <p id="phoneNumber-error" className="text-red-600 text-xs mt-1">
                    {formErrors.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className={inputClass('emailAddress')}
                  aria-invalid={!!formErrors.emailAddress}
                  aria-describedby="emailAddress-error"
                  required
                />
                {formErrors.emailAddress && (
                  <p id="emailAddress-error" className="text-red-600 text-xs mt-1">
                    {formErrors.emailAddress}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-600 rounded p-2 bg-[#292929] text-white"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-400 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-2 rounded text-xs font-semibold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
             </Dialog>
    </div>
  );
}
