import { Field, Input, Label, type InputProps } from "@headlessui/react";
import type { ReactNode } from "react";

export const TextInput = ({
	className,
	label,
	id,
	...props
}: InputProps & { className?: string; label: ReactNode }) => (
	<Field className={className}>
		<Label className="mb-2 block text-sm" htmlFor={id}>
			{label}
		</Label>

		<Input
			className="w-full rounded-lg border border-white/[6%] bg-neutral-800 p-2 text-sm placeholder:text-[#808080]"
			id={id}
			{...props}
		/>
	</Field>
);
