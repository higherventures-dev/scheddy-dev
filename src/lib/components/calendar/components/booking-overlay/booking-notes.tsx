import { memo } from "react";
import { Section } from "./section";

export const BookingNotes = memo(({ notes }: { notes: string }) => (
	<Section title="Notes">
		<p className="text-[0.8125rem]/[1.25rem]">{notes}</p>
	</Section>
));

BookingNotes.displayName = "BookingNotes";
