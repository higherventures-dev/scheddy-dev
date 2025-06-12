
import { useState } from 'react';
import { magicLinkAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function MagicLink(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className ="shadow-lg, dark:shadow-x1, border, dark:border-gray-700">
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Log In Without Password</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <SubmitButton pendingText="Logging In..." formAction={magicLinkAction}>
          Log in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
    </div>
  );
}