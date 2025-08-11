'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { createBooking } from '@/features/bookings/services/createBookingService';
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
      status: 1,
      artist_id: profile.id,
      user_id: profile.id,
      selected_date: selectedDate!.toISOString(),
      selected_time: selectedTime,
      start_time: start_time,
      end_time: end_time
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

        {/* ... rest of your component stays the same ... */}

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Services</h2>
          <ul>
            {(services || []).map((service: any, index: number) => (
              <li key={index}>
                <div className="grid grid-cols-2 items-center gap-4 border-b py-4">
                  <div>
                    <div className="text-xs font-medium">{service.name}</div>
                    <div className="text-xs font-medium text-gray-400">{service.summary}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {service.price ? `$${service.price}` : '$125'} – {convertMinutesToHours(service.duration) || '45 min'}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsOpen(true);
                      }}
                      className="text-xs border border-gray-400 rounded-md px-3 py-1 hover:bg-gray-100"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {formErrors.selectedService && (
            <p className="text-red-600 text-xs mt-1">{formErrors.selectedService}</p>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold pb-2">About</h2>
          <p className="text-xs">{profile.about || 'Not available.'}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold pb-2">Cancellation Policy</h2>
          <p className="text-xs">
            {profile.cancellation_policy ||
              'Appointments canceled or rescheduled within 24 hours may incur a 50% charge.'}
          </p>
        </div>
      </div>

      {/* Booking Modal ... stays the same ... */}

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        {/* ... rest of dialog code ... */}
      </Dialog>
    </div>
  );
}
