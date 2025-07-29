// app/services/page.tsx
import { createClient } from '@/utils/supabase/client';
import { CategoryWithServices } from '@/types';
import ServicesClient from './ServicesClient'; // 👈 New file next to page.tsx

export default async function ServicesPage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, services(id, name, price, duration)')
    .order('order_index', { ascending: true });

  return (
    <main className="p-6 min-h-screen text-white">
      <div className="w-[50vw]">
        <h1 className="text-xl mb-6">Services</h1>
        {/* <ServicesClient categories={categories ?? []} /> */}
      </div>
    </main>
  );
}