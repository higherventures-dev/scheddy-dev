import type { Dayjs } from "#/lib/dayjs";

export const MonthYearDisplay = ({ date }: { date: Dayjs }) => (
	<div className="flex shrink-0 flex-row items-center px-1.5 text-lg leading-normal tracking-tighter">
		<span className="font-bold">{date.format("MMMM")}</span>{" "}
		<span className="ml-[0.5ch] font-medium">{date.format("YYYY")}</span>
		<div className="ml-2 rounded-sm bg-[#313131] px-1.5 font-mono text-sm font-medium text-[#808080]">
			{date.format("[W]W")}
		</div>
	</div>
);
