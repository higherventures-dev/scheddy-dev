'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const clientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export function AddClientForm({ onSubmit }: { onSubmit: (data: ClientFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">First name</label>
        <input {...register('first_name')} className="input" />
        {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last name</label>
        <input {...register('last_name')} className="input" />
        {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input {...register('email')} className="input" type="email" />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input {...register('phone')} className="input" />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary">
        Save Client
      </button>
    </form>
  );
}