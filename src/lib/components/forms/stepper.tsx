import clsx from "clsx";
import { times } from "lodash-es";

export const Stepper = ({
	current,
	steps,
}: {
	current: number;
	steps: number;
}) => (
	<div className="flex gap-x-1">
		{times(steps, (i) => (
			<div
				key={i}
				className={clsx(
					"h-0.5 w-4 overflow-hidden rounded bg-white/[12%] transition-transform duration-300",
					{
						"translate-x-1 scale-x-150": i === current,
						"translate-x-2": i > current,
					},
				)}
			>
				<div
					className={clsx(
						"h-full w-full rounded-sm bg-[#ff7934] transition-transform duration-300",
						{
							"-translate-x-full": i > current,
							"translate-x-full": i < current,
						},
					)}
				/>
			</div>
		))}
	</div>
);
