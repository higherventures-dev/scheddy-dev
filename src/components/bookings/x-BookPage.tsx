'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { createBooking } from '@/features/bookings/services/createBookingService';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import ListTimePicker from '@/components/ui/ListTimePicker';
import DatePicker from '@/components/ui/DatePicker';


// Step Components
function Step1({
  services,
  selectedService,
  setSelectedService,
}: {
  services: any[];
  selectedService: any;
  setSelectedService: (service: any) => void;
}) {
  console.log('Selected Service', selectedService);

  useEffect(() => {}, [services, selectedService]);

  if (!selectedService || selectedService.length === 0) {
    return <p className="text-xs text-gray-400">No service selected.</p>;
  }

  return (
    <div>
      <p className="text-lg text-white text-bold pb-1">{selectedService.name}</p>
      <p className="text-xs text-gray-400 pb-2">{selectedService.description}</p>
      <p className="text-xs text-gray-400">
        {selectedService.price ? `$${selectedService.price}` : '$125'} –{' '}
        {convertMinutesToHours(selectedService.duration) || '45 min'}
      </p>
    </div>
  );
}

function convertMinutesToHours(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs && mins) return `${hrs} hours | ${mins} mins`;
  if (hrs) return `${hrs} hours`;
  return `${mins} mins`;
}

function Step2() {
  return (
    <div className="text-xs flex">
      <Image
        src={'/assets/images/anyone.png'}
        alt="Austin Clark"
        width="30"
        height="30"
        className="object-cover rounded-md"
      />
      <span className="pt-1 pl-3">Austin Clark</span>
    </div>
  );
}

function Step3({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}) {
  return (
    <div>
      <div className="mb-3">
        <DatePicker value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div>
        <ListTimePicker />
      </div>
    </div>
  );
}

function Step4({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  emailAddress,
  setEmailAddress,
  notes,
  setNotes,
}: {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  emailAddress: string;
  setEmailAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
}) {
  return (
    <div className="text-[70%]">
      <div className="pb-4 border-b-gray-700">
        <div>Tattoo Service 1</div>
        <div>with Austin Clark at 10:00 am</div>
        <div>July 30, 2025</div>
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-2 space-x-4 mb-4">
          <div>
            <div className="p-1">First name</div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <div className="p-1">Last name</div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <div>
          <div className="p-1">Phone number</div>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <div className="p-1">Email</div>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <div className="p-1">Notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </form>
    </div>
  );
}

export default function BookPage({ profile, services }: { profile: any; services: any[] }) {
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

  const steps = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Artist' },
    { id: 3, title: 'Day & Time' },
    { id: 4, title: 'Confirm' },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleConfirmBooking = async () => {
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
      studio_id: profile.id,
      artist_id: profile.id,
      client_id: profile.id,
      user_id: profile.id,
    };
    console.log('Booking Data:', bookingData);
    
    const insertedBooking = await createBooking(bookingData);

    alert('Booking saved successfully!');

    return;
  };

  return (
    <div>
      <div className="border-b border-[#313131] mt-2 text-center text-xs p-3">
        {profile.studio_name || profile.full_name || profile.display_name}
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="w-full">
          <h1 className="text-2xl font-bold py-1">{profile.full_name || profile.display_name}</h1>
          <div className="text-xs text-gray-500 max-w-full pb-3">
            {formatAddress(profile)}
          </div>
        </div>

        <div className="w-full h-[300px] bg-cover bg-center mb-4 rounded-md relative">
          <Image
            src={profile.header_image_url || '/assets/images/wayward-tattoo-header.png'}
            alt="Header"
            fill
            className="object-cover rounded-md"
          />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Services</h2>
          <ul>
            {(services || [1, 2, 3]).map((service: any, index: number) => (
              <li key={index}>
                <div className="grid grid-cols-2 items-center gap-4 border-b py-4">
                  <div>
                    <div className="text-xs font-medium">{service.name || `Tattoo Service ${index + 1}`}</div>
                    <div className="text-xs font-medium text-gray-400">{service.summary || `Tattoo Description ${index + 1}`}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {service.price ? `$${service.price}` : '$125'} – {convertMinutesToHours(service.duration) || '45 min'}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setStep(1);
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

      {/* Booking Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-[#323232] shadow-lg">
            <div className="flex justify-between mb-6 bg-[#292929] p-6">
              {steps.map((s) => (
                <button
                  key={s.id}
                  className={`flex-1 py-2 text-xs border-b-2 ${
                    s.id === step
                      ? 'bg-white text-black rounded-2xl font-semibold'
                      : 'border-transparent text-gray-400'
                  }`}
                  onClick={() => setStep(s.id)}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="min-h-[200px] px-6">
              {step === 1 && (
                <Step1
                  services={profile.services || []}
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                />
              )}
              {step === 2 && <Step2 />}
              {step === 3 && (
                <Step3
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              )}
              {step === 4 && (
                <Step4
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  emailAddress={emailAddress}
                  setEmailAddress={setEmailAddress}
                  notes={notes}
                  setNotes={setNotes}
                />
              )}
            </div>

            <div className="flex justify-between mt-6 p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Cancel
              </button>

              {step < 4 ? (
                <button
                  onClick={() => {
                    if (step === 1 && !selectedService) return;
                    setStep((prev) => prev + 1);
                  }}
                  disabled={step === 1 && !selectedService}
                  className={`px-4 py-2 rounded-md text-xs ${
                    step === 1 && !selectedService
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-black text-white'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await handleConfirmBooking();
                    setIsOpen(false);
                    setStep(1);
                  }}
                  className="bg-white text-black px-4 py-2 rounded-md text-xs"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}