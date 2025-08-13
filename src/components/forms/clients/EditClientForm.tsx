'use client';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client } from '../ClientsTable';
import { Tab } from '@headlessui/react';

const clientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email_address: z.string().email('Invalid email').optional(),
  phone_number: z.string().optional(),
  phone_number_2: z.string().optional(),
  occupation: z.string().optional(),
  referral_source: z.string().optional(),
  email_appointment_notification: z.boolean().optional(),
  text_appointment_notification: z.boolean().optional(),
  email_marketing_notification: z.boolean().optional(),
  text_marketing_notification: z.boolean().optional(),
});

const tabs = ['General', 'Bookings', 'Reviews','Photos','Notes'];

export type ClientFormData = z.infer<typeof clientSchema>;

export function EditClientForm({
  initialData,
  onSubmit,
}: {
  initialData: Client;
  onSubmit: (data: ClientFormData) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      email_address: initialData.email_address || '',
      phone_number: initialData.phone_number || '',
      phone_number_2: initialData.phone_number || '',
      occupation: initialData.occupation || '',
      referral_source: initialData.referral_source,
      email_appointment_notification: initialData.email_appointment_notification,
      text_appointment_notification: initialData.text_appointment_notification,
      email_marketing_notification: initialData.email_marketing_notification,
      text_marketing_notification: initialData.text_marketing_notification,
    },
  });
const inputClass = (field: keyof ClientFormData) =>
    `w-full border rounded p-2 bg-[#292929] text-white ${
      errors[field] ? 'border-red-600' : 'border-gray-600'
    }`;

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
      {/* <div>
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
      </div> */}
       <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">First name</label>
          <input
            type="text"
            {...register('first_name')}
            className={inputClass('first_name')}
            aria-invalid={!!errors.first_name}
            aria-describedby="firstName-error"
          />
          {errors.first_name && (
            <p id="firstName-error" className="text-red-600 text-xs mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">Last name</label>
          <input
            type="text"
            {...register('last_name')}
            className={inputClass('last_name')}
            aria-invalid={!!errors.last_name}
            aria-describedby="last_name-error"
          />
          {errors.last_name && (
            <p id="last_name-error" className="text-red-600 text-xs mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Phone number</label>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                value={formatPhoneNumber(field.value || '')}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  field.onChange(raw);
                }}
                maxLength={14}
                className={inputClass('phone_number')}
                aria-invalid={!!errors.phone_number}
                aria-describedby="phoneNumber-error"
              />
            )}
          />
          {errors.phone_number && (
            <p id="phoneNumber-error" className="text-red-600 text-xs mt-1">
              {errors.phone_number.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">Additional phone number</label>
          <Controller
            name="phone_number_2"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                value={formatPhoneNumber(field.value || '')}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  field.onChange(raw);
                }}
                maxLength={14}
                className={inputClass('phone_number_2')}
                aria-invalid={!!errors.phone_number_2}
                aria-describedby="phoneNumber2-error"
              />
            )}
          />
          {errors.phone_number_2 && (
            <p id="phoneNumber2-error" className="text-red-600 text-xs mt-1">
              {errors.phone_number_2.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          {...register('email_address')}
          className={inputClass('email_address')}
          aria-invalid={!!errors.email_address}
          aria-describedby="email_address-error"
        />
        {errors.email_address && (
          <p id="email_address-error" className="text-red-600 text-xs mt-1">
            {errors.email_address.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Occupation</label>
          <input
            type="text"
            {...register('occupation')}
            className={inputClass('occupation')}
            aria-invalid={!!errors.occupation}
            aria-describedby="occupation-error"
          />
          {errors.occupation && (
            <p id="occupation-error" className="text-red-600 text-xs mt-1">
              {errors.occupation.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">Source</label>
          <select
            {...register('referral_source')}
            className={inputClass('referral_source')}
            aria-invalid={!!errors.referral_source}
            aria-describedby="referral_source-error"
          >
            <option value=""></option>
            <option value="1">Walk-in</option>
            <option value="2">Referral</option>
            {/* Add more options here */}
          </select>
          {errors.referral_source && (
            <p id="referral_source-error" className="text-red-600 text-xs mt-1">
              {errors.referral_source.message}
            </p>
          )}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('email_appointment_notification')}
          id="email_appointment_notification"
          className="w-4 h-4"
        />
        <label htmlFor="email_appointment_notification" className="mb-0 select-none">
          Email appointment notification
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('text_appointment_notification')}
          id="text_appointment_notification"
          className="w-4 h-4"
        />
        <label htmlFor="text_appointment_notification" className="mb-0 select-none">
          Text appointment notification
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('email_marketing_notification')}
          id="email_marketing_notification"
          className="w-4 h-4"
        />
        <label htmlFor="email_marketing_notification" className="mb-0 select-none">
          Email marketing notification
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('text_marketing_notification')}
          id="text_marketing_notification"
          className="w-4 h-4"
        />
        <label htmlFor="text_marketing_notification" className="mb-0 select-none">
          Text marketing notification
        </label>
      </div>
      <button type="submit" disabled={isSubmitting} className="bg-white text-black px-4 py-2 rounded text-xs font-semibold">
        Update Client
      </button>
    </form>
  );
}