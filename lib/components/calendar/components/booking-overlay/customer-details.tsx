import {
	faAdd,
	faCreditCard,
	faEnvelope,
	faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@headlessui/react";
import { memo } from "react";
import { Section } from "./section";

export const CustomerDetails = memo(
	({ email, phone }: { email: string; phone: string }) => (
		<Section title="Client">
			<div className="grid auto-rows-auto grid-cols-[1fr_2fr] gap-x-2">
				<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
					<div className="flex flex-row items-center gap-x-2 text-[#969696]">
						<FontAwesomeIcon icon={faPhone} width={12} height={12} />

						<div>Phone</div>
					</div>

					<div className="flex items-center">{phone}</div>
				</div>

				<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
					<div className="flex flex-row items-center gap-x-2 text-[#969696]">
						<FontAwesomeIcon icon={faEnvelope} width={12} height={12} />

						<div>Email</div>
					</div>

					<div className="flex items-center">{email}</div>
				</div>

				<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
					<div className="flex flex-row items-center gap-x-2 text-[#969696]">
						<FontAwesomeIcon icon={faCreditCard} width={12} height={12} />

						<div>Credit</div>
					</div>

					<div className="flex items-center">
						<Button className="flex h-6 flex-row items-center gap-x-1.5 rounded-md border border-white/[6%] bg-[#313131] px-2 text-sm font-medium">
							<FontAwesomeIcon icon={faAdd} width={10} height={10} />

							<span>Add credit card</span>
						</Button>
					</div>
				</div>
			</div>
		</Section>
	),
);

CustomerDetails.displayName = "CustomerDetails";
