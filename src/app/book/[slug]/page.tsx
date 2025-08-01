// // app/book/[slug]/page.tsx (Server Component)

// import { use } from 'react';
// import BookPage from './BookPage';

// export default function Page({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = use(params);

//   return <BookPage slug={slug} />;
// }

  // app/book/[slug]/page.tsx
  import BookPage from '@/components/bookings/BookPage';
  import { getProfileBySlug } from '@/lib/actions/getProfileBySlug';
  import { getServicesByProfile } from '@/lib/actions/getServicesByProfile';

  export default async function BookingPage({ params }: { params: { slug: string } }) {

    if (!params.slug) {
      throw new Error("Missing slug in URL parameters.");
    }

    const profile = await getProfileBySlug(params.slug);
    if (!profile) return <div className="p-10 text-center">Profile not found</div>;
    
    const plainProfile = JSON.parse(JSON.stringify(profile));
  

    const services = await getServicesByProfile(profile?.id);

    const plainServices = JSON.parse(JSON.stringify(services));

    //return <BookPage profile={profile} services={services || []} />;
    return <BookPage profile={plainProfile} services={plainServices || []} />;
  }