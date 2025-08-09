'use client';

import { ServicesList } from '@/components/services/ServicesList';
import { Service } from '@/lib/types/service';
import { CategoryWithServices } from '@/lib/types/categorywithservices'

type Props = {
  categories: CategoryWithServices[];
};

export default function ServicesClient({ categories }: Props) {
  const handleEdit = (service: Service) => {
    console.log('edit', service);
  };

  const handleDelete = (service: Service) => {
    console.log('delete', service);
  };

  const handleReorder = (categoryId: string, newOrder: Service[]) => {
    console.log('new order for', categoryId, newOrder);
    // Optional: persist to Supabase here
  };

  return (
    <ServicesList
      categories={categories}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}