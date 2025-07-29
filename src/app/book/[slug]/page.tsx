// app/book/[slug]/page.tsx (Server Component)

import { use } from 'react';
import BookPage from './BookPage';

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return <BookPage slug={slug} />;
}