"use client";

import { dayjs, type Dayjs } from "#/lib/dayjs";
import { Button } from "@headlessui/react";
import clsx from "clsx";
import { times } from "lodash-es";
import { useState } from "react";
import { Availability } from "./availability";

export const SelectTime = ({
	businessId,
	serviceId,
	onSelectAction,
}: {
	businessId: string;
	serviceId: number;
	onSelectAction: (time: Dayjs) => void;
}) => {
	const today = dayjs().startOf("day");
	const [selectedDay, setSelectedDay] = useState(() => today);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="grid grid-cols-7 gap-x-3.5 border-b border-white/[6%] pt-4 pb-2">
				{times(7, (i) => {
					const day = today.add(i, "day");

					return (
						<Button
							key={day.format()}
							className="aspect-square text-center font-semibold"
							onClick={() => setSelectedDay(day)}
						>
							<div className="text-[0.8125rem]/[1.25rem] uppercase">
								{day.format("ddd")}
							</div>
							<div
								className={clsx("mx-auto w-8 leading-8", {
									"rounded-full bg-[#FF7934]": day.isSame(selectedDay, "day"),
								})}
							>
								{day.format("D")}
							</div>
						</Button>
					);
				})}
			</div>

			<div className="text-center text-sm">
				<span className="font-medium text-[#808080]">Selected date:</span>{" "}
				<span className="font-semibold">{selectedDay.format("dddd, LL")}</span>
			</div>

			<Availability
				businessId={businessId}
				serviceId={serviceId}
				day={selectedDay.toISOString()}
				onSelect={(startTime) => onSelectAction(startTime)}
			/>
		</div>
	);
};
