import type { Dayjs } from "#/lib/dayjs";
import clsx from "clsx";
import { times } from "lodash-es";
import { useState } from "react";
import { MonthYearDisplay } from "./month-year-display";
import { Navigation } from "./navigation";
import type { Event } from "./schema";

export function Month({
	// events,
	initialMonth,
	currentDateTime,
}: {
	events: Event[];
	initialMonth: Dayjs;
	currentDateTime: Dayjs;
}) {
	const [monthStart, setMonthStart] = useState(initialMonth);

	return (
		<div className="bg-neutral-800">
			<div className="flex h-12 flex-row items-center justify-between">
				<div className="mx-4 flex flex-row gap-x-3">
					<MonthYearDisplay date={monthStart} />

					<Navigation
						onClickPrev={() => setMonthStart(monthStart.subtract(1, "month"))}
						onClickNext={() => setMonthStart(monthStart.add(1, "month"))}
					/>
				</div>
			</div>

			<div
				className="grid"
				style={{
					gridTemplateColumns: "1.75rem repeat(7, minmax(13rem, 1fr))",
					gridTemplateRows: "1.75rem repeat(6, minmax(8.875rem, 1fr))",
				}}
			>
				<div
					className="grid grid-cols-subgrid"
					style={{ gridColumnStart: 1, gridColumnEnd: -1 }}
				>
					<div className="border-b border-white/[3%] text-center font-mono text-[0.625rem]/[1.75rem] font-medium text-[#808080]">
						M
					</div>

					{times(7, (i) => {
						const weekStart = monthStart.startOf("week");
						const weekday = weekStart.add(i, "day");
						const isSameWeekdayAndMonth =
							weekday.day() === currentDateTime.day() &&
							monthStart.isSame(currentDateTime, "month");

						return (
							<div
								key={i}
								className={clsx(
									"border-b border-white/[3%] bg-neutral-800 text-center text-[0.8125rem]/[1.75rem] text-[#808080]",
									{ "font-semibold text-white": isSameWeekdayAndMonth },
								)}
							>
								{weekday.format("ddd")}
							</div>
						);
					})}
				</div>

				<div
					className="grid grid-rows-subgrid items-center text-center font-mono text-[0.625rem]/[8.875rem] font-medium text-[#808080]"
					style={{ gridRowStart: 2, gridRowEnd: -1 }}
				>
					{times(7, (i) => {
						const yearStart = monthStart.startOf("year");
						const week = monthStart.diff(yearStart, "week") + i + 1;

						return (
							<div key={week} className="border-e border-b border-white/[3%]">
								{week}
							</div>
						);
					})}
				</div>

				<div
					className="grid grid-cols-subgrid grid-rows-subgrid"
					style={{
						gridColumnStart: 2,
						gridColumnEnd: -1,
						gridRowStart: 2,
						gridRowEnd: -1,
					}}
				>
					{times(42, (i) => {
						const rangeStart = monthStart.startOf("week");
						const day = rangeStart.add(i, "day");
						const isToday = day.isSame(currentDateTime, "date");
						const isCurrentMonth = day.isSame(monthStart, "month");

						return (
							<div
								key={i}
								className={clsx("border-r border-b border-white/[3%]", {
									"bg-[#242424]": day.day() % 2 === 0,
								})}
							>
								<div
									className={clsx(
										"m-px ms-auto mr-2 w-fit min-w-5 text-center text-[0.8125rem]/[1rem] text-[#808080]",
										{
											"text-[#808080]": !isCurrentMonth,
											"text-white": isCurrentMonth,
											"rounded-sm bg-[#69AADE] font-semibold": isToday,
											"font-semibold": day.date() === 1,
										},
									)}
								>
									{day.date() === 1 ? day.format("MMMM D") : day.format("D")}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
