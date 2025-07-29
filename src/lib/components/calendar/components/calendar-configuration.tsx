import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";
import { upperFirst } from "lodash-es";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

type CalendarPeriod = "day" | "week" | "month";

export type CalendarState = {
	period: CalendarPeriod;
	showWeekends: boolean;
	showDeclinedEvents: boolean;
	showWeekNumbers: boolean;
};

export const CalendarConfiguration = ({
	state,
	setState,
}: {
	state: CalendarState;
	setState: Dispatch<SetStateAction<CalendarState>>;
}) => (
	<Menu>
		<MenuButton className="flex flex-row items-center gap-x-1.5 rounded-sm border border-white/[6%] bg-[#313131] px-3 py-1.5 text-xs font-medium text-white">
			<span>{upperFirst(state.period)}</span>

			<FontAwesomeIcon icon={faChevronDown} width={8} height={8} />
		</MenuButton>

		<MenuItems
			transition
			className="mt-1 w-[13.25rem] rounded-lg border border-white/[6%] bg-[#313131] data-[closed]:data-[leave]:opacity-0"
			anchor="bottom end"
		>
			<div className="flex flex-col gap-y-1 border-b border-white/[6%] p-1">
				<MenuItem>
					<MenuEntry
						onClick={() => setState((prev) => ({ ...prev, period: "day" }))}
						active={state.period === "day"}
					>
						Day view
					</MenuEntry>
				</MenuItem>

				<MenuItem>
					<MenuEntry
						onClick={() => setState((prev) => ({ ...prev, period: "week" }))}
						active={state.period === "week"}
					>
						Week view
					</MenuEntry>
				</MenuItem>

				<MenuItem>
					<MenuEntry
						onClick={() => setState((prev) => ({ ...prev, period: "month" }))}
						active={state.period === "month"}
					>
						Month view
					</MenuEntry>
				</MenuItem>
			</div>

			<div className="flex flex-col gap-y-1 p-1">
				<MenuItem>
					<MenuEntry
						onClick={() =>
							setState((prev) => ({
								...prev,
								showWeekends: !prev.showWeekends,
							}))
						}
						active={state.showWeekends}
					>
						Weekends
					</MenuEntry>
				</MenuItem>

				<MenuItem>
					<MenuEntry
						onClick={() =>
							setState((prev) => ({
								...prev,
								showDeclinedEvents: !prev.showDeclinedEvents,
							}))
						}
						active={state.showDeclinedEvents}
					>
						Declined events
					</MenuEntry>
				</MenuItem>

				<MenuItem>
					<MenuEntry
						onClick={() =>
							setState((prev) => ({
								...prev,
								showWeekNumbers: !prev.showWeekNumbers,
							}))
						}
						active={state.showWeekNumbers}
					>
						Week numbers
					</MenuEntry>
				</MenuItem>
			</div>
		</MenuItems>
	</Menu>
);

const MenuEntry = ({
	active,
	onClick,
	children,
}: PropsWithChildren<{
	active: boolean;
	onClick: () => void;
}>) => (
	<button
		className="flex items-center justify-between rounded-sm p-2 text-xs text-white select-none hover:bg-[#393939]"
		onClick={() => onClick()}
	>
		<div>
			<FontAwesomeIcon
				icon={faCheck}
				width={12}
				height={12}
				className={clsx({ "opacity-0": !active })}
			/>

			<span className="ms-2">{children}</span>
		</div>
	</button>
);
