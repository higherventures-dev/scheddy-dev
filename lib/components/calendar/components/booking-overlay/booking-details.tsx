import { faLocationArrow, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { Section } from "./section";

type Props = {
	bookedVia: string;
	createdBy: string;
	createdAt: string;
};

export const BookingDetails = memo(
	({ bookedVia, createdBy, createdAt }: Props) => (
		<Section title="Booking details">
			<div className="grid auto-rows-auto grid-cols-[1fr_2fr] gap-x-2">
				<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
					<div className="flex flex-row items-center gap-x-2 text-[#969696]">
						<FontAwesomeIcon icon={faUser} width={12} height={12} />

						<div>Booked by</div>
					</div>

					<div className="flex items-center">
						{`${createdBy} on ${createdAt}`}
					</div>
				</div>

				<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
					<div className="flex flex-row items-center gap-x-2 text-[#969696]">
						<FontAwesomeIcon icon={faLocationArrow} width={12} height={12} />

						<div>Booked via</div>
					</div>

					<div className="flex items-center">{bookedVia}</div>
				</div>
			</div>
		</Section>
	),
);

BookingDetails.displayName = "BookingDetails";
