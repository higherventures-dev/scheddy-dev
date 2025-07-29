import type { BookingInformation } from "#/app/book/[businessId]/get-booking-information";
import { Button } from "@headlessui/react";
import { compact } from "lodash-es";

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export const SelectService = ({
	categories,
	services,
	onSelect,
}: Pick<BookingInformation, "categories" | "services"> & {
	onSelect: (id: number) => void;
}) => (
	<div className="flex flex-col gap-y-6">
		{categories.map(({ id, name, services: serviceIds }) => {
			if (serviceIds.length === 0) {
				return null;
			}

			return (
				<div key={id} className="flex flex-col gap-y-1">
					<h3 className="text-[1.0625rem]/[2rem] font-semibold tracking-[-2%]">
						{name}
					</h3>

					<div className="flex flex-col gap-y-2">
						{compact(
							serviceIds.map((id) => services.find((s) => s.id === id)),
						).map(({ id, name, price, duration }) => (
							<div
								key={id}
								className="flex min-h-16 flex-row items-center justify-between border-b border-white/[6%]"
							>
								<div className="flex flex-col gap-y-1">
									<p className="text-sm font-semibold">{name}</p>
									<p className="text-[0.8125rem]/[1rem] font-semibold text-[#808080]">
										{currencyFormatter.format(+price)}
										{" · "}
										{duration} min
									</p>
								</div>

								<Button
									className="rounded-full border border-white/[6%] px-3 py-1 text-sm font-semibold"
									onClick={() => {
										onSelect(id);
									}}
								>
									Book
								</Button>
							</div>
						))}
					</div>
				</div>
			);
		})}
	</div>
);
