'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema: allow empty email, keep artist_id required
const clientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email_address: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().email('Invalid email').optional()
  ),
  phone_number: z.string().optional(),
  phone_number_2: z.string().optional(),
  occupation: z.string().optional(),
  referral_source: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().optional()
  ),
  email_appointment_notification: z.boolean().optional(),
  text_appointment_notification: z.boolean().optional(),
  email_marketing_notification: z.boolean().optional(),
  text_marketing_notification: z.boolean().optional(),
  // artist_id: z.string().min(1, 'Artist is required'),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export function AddClientForm({
  onSubmit,
  artistId, // <-- supply this from the parent (e.g., the selected artist or current user)
  formId,   // optional: useful if your submit button lives in a Drawer footer outside the <form>
}: {
  onSubmit: (data: ClientFormData) => Promise<void> | void;
  artistId: string;
  formId?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      email_appointment_notification: false,
      text_appointment_notification: false,
      email_marketing_notification: false,
      text_marketing_notification: false,
      artist_id: artistId,
    },
  });

  const inputClass = (field: keyof ClientFormData) =>
    `w-full border rounded p-2 bg-[#292929] text-white ${
      errors[field] ? 'border-red-600' : 'border-gray-600'
    }`;

  const formatPhoneNumber = (value: string) => {
    const digits = (value || '').toString().replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const onSubmitHandler = async (data: ClientFormData) => {
    await onSubmit(data);
    // Preserve artist_id after reset
    reset({
      email_appointment_notification: false,
      text_appointment_notification: false,
      email_marketing_notification: false,
      text_marketing_notification: false,
      artist_id: artistId,
    });
  };

  return (
    <form
      id={formId || 'addClientForm'}
      onSubmit={handleSubmit(onSubmitHandler)}
      className="space-y-4 text-xs"
    >
      {/* ensure artist_id is registered */}
      <input type="hidden" {...register('artist_id')} />

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

      {/* If your submit button is *inside* the form, this is enough. 
         If it's in a Drawer footer (outside), remove this button and render a
         <button type="submit" form={formId || 'addClientForm'}> in the footer. */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-white text-black px-4 py-2 rounded text-xs font-semibold"
      >
        {isSubmitting ? 'Saving…' : 'Save Client'}
      </button>

      {/* Optional: visibility for any hidden field error */}
      {errors.artist_id && (
        <p className="text-red-600 text-xs mt-2">{errors.artist_id.message}</p>
      )}
    </form>
  );
}
