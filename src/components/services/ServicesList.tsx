'use client';

import { Service } from '@/lib/types/service';
import { CategoryWithServices } from '@/lib/types/categorywithservices';

type Props = {
  categories: CategoryWithServices[];
};

export default function ServicesList({ categories }: Props) {
  return (
    <h1>Services</h1>
    // <ServicesList
    //   categories={categories}
    //   onEdit={handleEdit}
    //   onDelete={handleDelete}
    //   onReorder={handleReorder}
    // />
  );
}