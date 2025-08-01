'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function formatAddress(profile: any) {
  const { address, address2, city, state, postal_code } = profile || {};

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
}

export default function ThankYouPage() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white px-4 text-center">
      {/* Thank you message */}
      <div className="text-xl font-semibold mb-6">
        Thank you for your booking! <br />
        We look forward to seeing you soon.
      </div>

      {/* Back to Booking Button */}
      <Link
        href={`/book/${slug}`}
        className="text-sm text-gray-300 underline hover:text-white transition"
      >
        ← Back to Booking Page
      </Link>
    </div>
  );
}
