"use client";

import { dayjs } from "/lib/dayjs";
import { Button } from "@headlessui/react";
import clsx from "clsx";
import { times } from "lodash-es";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { z } from "zod";
import {
	CalendarConfiguration,
	type CalendarState,
} from "./components/calendar-configuration";
import { FilterEmployees } from "./components/filter-employees";
import { MonthYearDisplay } from "./month-year-display";
import { Navigation } from "./navigation";
import { eventSchema, type Event } from "./schema";

const pixelsPerMinute = 48 / 60;

export function Week({
	businessId,
	employees,
}: {
	businessId: string;
	employees: {
		familyName: string | null;
		givenName: string | null;
		id: number;
		role: string;
		avatar: string | null;
	}[];
}) {
	const today = dayjs();
	const [weekStart, setWeekStart] = useState(() => dayjs().startOf("week"));
	const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
	const [calendarState, setCalendarState] = useState<CalendarState>({
		period: "day",
		showWeekends: false,
		showDeclinedEvents: false,
		showWeekNumbers: false,
	});

	const url = useMemo(() => {
		if (!globalThis.location) return null;

		const url = new URL("/api/bookings", globalThis.location.href);
		url.searchParams.set("from", weekStart.format("YYYY-MM-DD"));
		url.searchParams.set("to", weekStart.endOf("week").format("YYYY-MM-DD"));
		url.searchParams.set("businessId", businessId);
		for (const id in selectedEmployeeIds) {
			url.searchParams.append("employeeIds", id);
		}
		return url.toString();
	}, [businessId, selectedEmployeeIds, weekStart]);

	const { isLoading, data = [] } = useSWR(url, async (url: string) => {
		const res = await fetch(url);
		const data = await res.json();
		return z.array(eventSchema).parse(data);
	});

	if (isLoading) {
		return null;
	}

	const events = data.filter(
		({ employeeId }) =>
			selectedEmployeeIds.length === 0 ||
			selectedEmployeeIds.includes(employeeId),
	);

	return (
		<div className="flex grow flex-col bg-neutral-800">
			<div className="mx-4 flex h-12 flex-row items-center justify-between gap-x-4">
				<div className="flex flex-row gap-x-3">
					<MonthYearDisplay date={weekStart} />

					<Navigation
						onClickPrev={() => setWeekStart(weekStart.subtract(1, "week"))}
						onClickNext={() => setWeekStart(weekStart.add(1, "week"))}
					/>
				</div>

				<div className="flex flex-row items-center gap-x-3">
					<FilterEmployees
						employees={employees}
						employeeIds={selectedEmployeeIds}
						setEmployeeIds={(ids) => setSelectedEmployeeIds(ids)}
					/>

					<div className="h-6 w-px bg-[#4D4D4D]" />

					<CalendarConfiguration
						state={calendarState}
						setState={setCalendarState}
					/>

					<Button
						className="flex flex-row items-center gap-x-1.5 rounded-sm border border-white/[6%] bg-[#313131] px-3 py-1.5 text-xs font-medium text-white"
						onClick={() => setWeekStart(dayjs().startOf("week"))}
					>
						Today
					</Button>
				</div>
			</div>

			<div
				className="grid grow"
				style={{
					gridTemplateColumns: "3.5rem repeat(7, 1fr)",
					gridTemplateRows: "auto 1fr",
				}}
			>
				<div
					className="grid grid-cols-subgrid"
					style={{ gridColumnStart: 2, gridColumnEnd: 9 }}
				>
					{times(7, (i) => {
						const weekday = weekStart.add(i, "day");
						const isToday = weekday.isSame(today, "day");

						return (
							<div
								key={i}
								className={clsx(
									"bg-neutral-800 text-center text-[0.8125rem]/[1.75rem] text-[#808080]",
									{ "font-semibold text-white": isToday },
								)}
							>
								<span>{weekday.format("ddd")}</span>{" "}
								<span
									className={clsx("rounded-sm", {
										"bg-[#69AADE] px-1 py-0.5": isToday,
									})}
								>
									{weekday.format("D")}
								</span>
							</div>
						);
					})}
				</div>

				<div
					className="grid grid-cols-subgrid overflow-y-scroll"
					style={{ gridColumnStart: 1, gridColumnEnd: 9 }}
				>
					<div className="px-1.5">
						{times(23, (i) => (
							<div key={i} className="flex h-12 items-center justify-end">
								<div className="translate-y-1.5 font-mono text-[0.625rem]/[0.75rem] text-[#808080]">
									{dayjs()
										.startOf("day")
										.add(i * 60, "minute")
										.format("h A")}
								</div>
							</div>
						))}
					</div>

					{times(7, (i) => (
						<DayColumn
							key={i}
							events={events.filter((e) => e.start.dateTime.day() === i)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

const DayColumn = ({ events }: { events: Event[] }) => (
	<div className="min-w-20 border-l border-white/[3%] pe-3 even:bg-[#242424]">
		<div className="relative">
			{events.map(({ id, status, summary, description, start, end }) => {
				const minutesFromStart = start.dateTime.diff(
					start.dateTime.startOf("day"),
					"minutes",
				);

				const duration = end.dateTime.diff(start.dateTime, "minutes");

				return (
					<div
						key={id}
						className={clsx(
							"absolute my-0.5 w-full rounded-sm border-white px-2 py-1",
							{
								"border-l-4 bg-white/[10%]": status === "confirmed",
								"border border-dashed": status === "tentative",
							},
						)}
						style={{
							top: (30 + minutesFromStart) * pixelsPerMinute,
							height: duration * pixelsPerMinute - 4,
						}}
					>
						<p className="text-xs leading-none font-semibold">{summary}</p>
						<p className="mt-1 mb-2 text-xs font-medium">{description}</p>
						<p className="text-xs font-medium">{`${start.dateTime.format("h A")} - ${end.dateTime.format("h A")}`}</p>
					</div>
				);
			})}
		</div>
	</div>
);
