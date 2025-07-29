'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { getProfileBySlug } from '@/lib/actions/getProfileBySlug';

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
  if (!services || services.length === 0) {
    return <p className="text-xs text-gray-400">No services available.</p>;
  }

  return (
    <div className="text-xs space-y-4">
      <p className="text-gray-300">Select a tattoo service from the list below:</p>
      {services.map((service, index) => (
        <label
          key={index}
          className={`flex items-start border rounded-xl p-3 cursor-pointer transition-all duration-150 ${
            selectedService?.name === service.name
              ? 'border-white bg-black/10'
              : 'border-gray-700 hover:border-white/40'
          }`}
        >
          <input
            type="radio"
            name="service"
            checked={selectedService?.name === service.name}
            onChange={() => setSelectedService(service)}
            className="mt-1 mr-3 accent-white"
          />
          <div>
            <div className="font-semibold">{service.name || `Tattoo Service ${index + 1}`}</div>
            <div className="text-gray-400">
              {service.price ? `$${service.price}` : '$125'} – {service.duration || '45 min'}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}

function Step2() {
  return <div className="text-xs">Choose an artist</div>;
}
function Step3() {
  return <div className="text-xs">Available date and time...</div>;
}
function Step4() {
  return (
    <form className="space-y-4">
      First name
      <input type="text" placeholder="First name" className="w-full border p-2 rounded" />
      Last name
      <input type="text" placeholder="Last name" className="w-full border p-2 rounded" />
      Phone number
      <input type="text" placeholder="Phone number" className="w-full border p-2 rounded" />
      Email
      <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
      <span className="flex">Cancellation Policy</span>
      <span>For appointments canceled or rescheduled within 24 hours, we charge 50% of the service total.</span>
    </form>
  );
}
function Step5() {
  return <div className="text-xs">Review your choices and confirm your booking.</div>;
}

export default function BookPage({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfileBySlug(slug);
      setProfile(data);
    }
    fetchProfile();
  }, [slug]);

  const steps = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Artist' },
    { id: 3, title: 'Day & Time' },
    { id: 4, title: 'Your Info' },
    { id: 5, title: 'Confirm' },
  ];

  const formatAddress = (profile) => {
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
        {line2}
      </>
    );
  };

  if (!profile) {
    return <div className="text-center text-sm p-10">Loading profile...</div>;
  }

  return (
    <div>
      <div className="border-b border-[#313131] mt-2 text-center text-xs p-3">
        {profile.studio_name || profile.full_name || profile.display_name}
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="w-full">
          <h1 className="text-2xl font-bold py-1">{profile.full_name || profile.display_name}</h1>
          <div className="text-xs text-gray-500 max-w-full pb-3">
            {formatAddress(profile) || 'No address provided'}
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
            {(profile.services || [1, 2, 3]).map((service: any, index: number) => (
              <li key={index}>
                <div className="grid grid-cols-2 items-center gap-4 border-b py-4">
                  <div>
                    <div className="text-xs font-medium">{service.name || `Tattoo Service ${index + 1}`}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {service.price ? `$${service.price}` : '$125'} – {service.duration || '45 min'}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => {
                        setIsOpen(true);
                        setStep(1);
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
          <Dialog.Panel className="w-full max-w-lg bg-[#323232] shadow-lg">
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
              {step === 3 && <Step3 />}
              {step === 4 && <Step4 />}
              {step === 5 && <Step5 />}
            </div>

            <div className="flex justify-between mt-6 p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Cancel
              </button>

              {step < 5 ? (
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
                  onClick={() => {
                    setIsOpen(false);
                    setStep(1);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-xs"
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