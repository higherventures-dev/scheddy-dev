import { Button } from "@headlessui/react";
import { memo } from "react";
import { Section } from "./section";

export const PaymentDetails = memo(
	({ price, owed }: { price: number; owed: number }) => {
		const currencyFormatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		});

		return (
			<Section title="Payment">
				<div className="text-[0.8125rem]/[1.25rem]">
					<div className="flex flex-row items-center justify-between py-1.5">
						<p>Total price</p>
						<p>{currencyFormatter.format(price)}</p>
					</div>

					<div className="flex flex-row items-center justify-between py-1.5">
						<p>Amount owed</p>
						<p>{currencyFormatter.format(owed)}</p>
					</div>
				</div>

				<Button className="mt-2 mb-1 w-full rounded-md border border-white/[6%] bg-white/[8%] text-center text-[0.8125rem]/[2rem] font-medium">
					Take payment
				</Button>
			</Section>
		);
	},
);

PaymentDetails.displayName = "PaymentDetails";
