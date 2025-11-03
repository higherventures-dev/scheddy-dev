"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({ pendingText = "Submitting...", className, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}                 // passes size="default" if you set it
      type="submit"
      className={twMerge("h-10 px-4 py-2 text-base font-medium rounded-md", className)}
      disabled={pending || props.disabled}
    >
      {pending ? pendingText : props.children}
    </Button>
  );
}
