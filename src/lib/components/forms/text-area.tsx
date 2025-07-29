import { Field, Label, Textarea, type TextareaProps } from "@headlessui/react";
import type { ReactNode } from "react";

export const TextArea = ({
	className,
	label,
	id,
	...props
}: TextareaProps & { className?: string; label: ReactNode }) => (
	<Field className={className}>
		<Label className="mb-2 block text-sm" htmlFor={id}>
			{label}
		</Label>

		<Textarea
			className="w-full rounded-lg border border-white/[6%] bg-neutral-800 p-2 text-sm placeholder:text-[#808080]"
			id={id}
			{...props}
		/>
	</Field>
);
