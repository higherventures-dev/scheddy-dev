import type { UniqueIdentifier } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@headlessui/react";
import type { PropsWithChildren } from "react";

const Handle = (props?: SyntheticListenerMap) => (
	<Button
		className="-mx-3.5 flex cursor-grab items-center justify-center self-center p-3.5"
		{...props}
	>
		<svg width={16} height={16} viewBox="0 0 16 16" fill="#808080">
			<path d="M8.00033 11.9999C8.73671 11.9999 9.33366 11.403 9.33366 10.6666C9.33366 9.93021 8.73671 9.33325 8.00033 9.33325C7.26395 9.33325 6.66699 9.93021 6.66699 10.6666C6.66699 11.403 7.26395 11.9999 8.00033 11.9999Z" />
			<path d="M8.00033 6.66667C8.73671 6.66667 9.33366 6.06971 9.33366 5.33333C9.33366 4.59695 8.73671 4 8.00033 4C7.26395 4 6.66699 4.59695 6.66699 5.33333C6.66699 6.06971 7.26395 6.66667 8.00033 6.66667Z" />
			<path d="M2.66683 11.9999C3.40321 11.9999 4.00016 11.403 4.00016 10.6666C4.00016 9.93021 3.40321 9.33325 2.66683 9.33325C1.93045 9.33325 1.3335 9.93021 1.3335 10.6666C1.3335 11.403 1.93045 11.9999 2.66683 11.9999Z" />
			<path d="M2.66683 6.66667C3.40321 6.66667 4.00016 6.06971 4.00016 5.33333C4.00016 4.59695 3.40321 4 2.66683 4C1.93045 4 1.3335 4.59695 1.3335 5.33333C1.3335 6.06971 1.93045 6.66667 2.66683 6.66667Z" />
			<path d="M13.3333 11.9999C14.0697 11.9999 14.6667 11.403 14.6667 10.6666C14.6667 9.93021 14.0697 9.33325 13.3333 9.33325C12.597 9.33325 12 9.93021 12 10.6666C12 11.403 12.597 11.9999 13.3333 11.9999Z" />
			<path d="M13.3333 6.66667C14.0697 6.66667 14.6667 6.06971 14.6667 5.33333C14.6667 4.59695 14.0697 4 13.3333 4C12.597 4 12 4.59695 12 5.33333C12 6.06971 12.597 6.66667 13.3333 6.66667Z" />
		</svg>
	</Button>
);

type SortableProps = PropsWithChildren<{
	id: UniqueIdentifier;
	"data-dragging"?: boolean;
}>;

export const Sortable = ({ id, children, ...props }: SortableProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			className="grid grid-cols-[min-content_1fr] gap-x-4 aria-pressed:opacity-0"
			style={style}
			{...attributes}
			{...props}
		>
			<Handle {...listeners} />

			{children}
		</div>
	);
};

export const SortableOverlay = ({ children }: PropsWithChildren) => (
	<div className="grid auto-rows-auto grid-cols-[auto_1fr] gap-x-4">
		<Handle />

		{children}
	</div>
);
