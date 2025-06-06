import { dayjs, type Dayjs } from "#/lib/dayjs";
import { Button } from "@headlessui/react";
import useSWR from "swr";
import { z } from "zod";

type Props = {
	businessId: string;
	serviceId: number;
	day: string;
	onSelect: (startTime: Dayjs) => void;
};

const schema = z.object({
	employeeId: z.number().optional(),
	time: z
		.string()
		.datetime()
		.transform((arg) => dayjs(arg)),
});

export const Availability = ({
	businessId,
	serviceId,
	day,
	onSelect,
}: Props) => {
	const {
		isLoading,
		error,
		data = [],
	} = useSWR(
		["/api/availability", businessId, serviceId, day],
		async ([path, businessId, serviceId, day]) => {
			const url = new URL(path, window.location.origin);
			url.searchParams.set("businessId", businessId);
			url.searchParams.set("serviceId", `${serviceId}`);
			url.searchParams.set("day", day);

			const res = await fetch(url);
			return z.array(schema).parse(await res.json());
		},
	);

	if (error) {
		console.error(error);
		return null;
	}

	if (isLoading) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-2">
			{data.map(({ time }) => (
				<Button
					key={time.format()}
					className="rounded-lg bg-white/[6%] text-center text-[0.875rem]/[3rem] font-semibold"
					onClick={() => onSelect(time)}
				>
					{time.format("LT")}
				</Button>
			))}
		</div>
	);
};
