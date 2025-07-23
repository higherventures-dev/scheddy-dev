'use client';

import { getProfileBySlug } from '@/lib/actions/getProfileBySlug';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getServices } from '@/lib/actions/getServices';
import { Dialog } from '@headlessui/react';

// Step Components
function Step1() {
  return <div className="text-xs">Select a tattoo service from the list...</div>;
}
function Step2() {
  return <div className="text-xs">Choose an artist</div>;
}
function Step3() {
   return (<div className="text-xs">
available date and time...</div>
  );
}
function Step4() {
    return (<form className="space-y-4">
      First name
      <input type="text" placeholder="First name" className="w-full border p-2 rounded" />
      Last name
      <input type="text" placeholder="Last name" className="w-full border p-2 rounded" />
      Phone number
      <input type="text" placeholder="Phone number" className="w-full border p-2 rounded" />
      Email
      <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
      <span className="flex">Cancellation Policy</span>
      <span>For appointments canceled or reschedule within 24 hours, we charge 50% of the service total</span>
    </form>
      
  )
    
}

function Step5() {
  return <div className="text-xs">Review your choices and confirm your booking.</div>;
}

export default function BookPage({ params }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Artist' },
    { id: 3, title: 'Day & Time' },
    { id: 4, title: 'Your Info' },
    { id: 5, title: 'Confirm' },
  ];

  return (
    <div>
      <div className="border-b border-[#313131] mt-2 text-center text-xs p-3">
        Wayward Tattoo
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div>
          <h1 className="text-2xl font-bold py-1">Wayward Tattoo</h1>
          <span className="text-xs text-gray-500">
            Open until 8:00 PM | 6678 Antigua Blvd, San Diego, 92124
          </span>
        </div>

        <div
          className="w-full h-[300px] bg-cover bg-center mb-4 rounded-md"
          style={{ backgroundImage: "url('/assets/images/wayward-tattoo-header.png')" }}
        />

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Services</h2>
          <ul>
            {[1, 2, 3].map((num) => (
              <li key={num}>
                <div className="grid grid-cols-2 items-center gap-4 border-b py-4">
                  <div>
                    <div className="text-xs font-medium">Tattoo Service {num}</div>
                    <div className="text-xs text-gray-500 mt-1">$125 – 45 min</div>
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
          <p className="text-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold pb-2">Cancellation Policy</h2>
          <p className="text-xs">
            Ut euismod maximus condimentum. Vivamus eget vestibulum massa...
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-[#323232]  shadow-lg">
            {/* <Dialog.Title className="text-xs font-semibold mb-4">Book Appointment</Dialog.Title> */}

            {/* Step Tabs */}
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

            {/* Step Content */}
            <div className="min-h-[200px] px-6">
              {step === 1 && <Step1 />}
              {step === 2 && <Step2 />}
              {step === 3 && <Step3 />}
              {step === 4 && <Step4 />}
              {step === 5 && <Step5 />}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between mt-6 p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Cancel
              </button>

              {step < 5 ? (
                <button
                  onClick={() => setStep((prev) => prev + 1)}
                  className="bg-black text-white px-4 py-2 rounded-md text-xs"
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