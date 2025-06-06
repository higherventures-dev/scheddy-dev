import type { Dayjs } from "#/lib/dayjs";

export const MiniDate = ({ date }: { date: Dayjs }) => (
	<div className="flex h-10 w-10 flex-col items-stretch rounded-lg border border-white/[6%] p-px text-center font-semibold">
		<div className="rounded-t-md rounded-b-[1px] bg-[#3D3D3D] text-[0.5rem]/[0.75rem] uppercase">
			{date.format("MMM")}
		</div>

		<div className="flex grow items-center justify-center text-sm">
			{date.format("D")}
		</div>
	</div>
);
