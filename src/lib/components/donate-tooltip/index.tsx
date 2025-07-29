import { Button, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

type Props = {
	show: boolean;
	onDismiss: () => void;
};

export const DonateTooltip = ({ show, onDismiss }: Props) => (
	<Dialog open={show} onClose={onDismiss}>
		<DialogBackdrop className="fixed inset-0 bg-black/15" />

		<div className="fixed inset-0 flex items-center justify-center p-4">
			<DialogPanel className="shadow-menu-items flex flex-col gap-y-3 rounded-xl border border-white/[6%] bg-[#262626] px-4 py-3">
				<div className="flex flex-col gap-y-0.5">
					<div className="flex flex-row text-sm font-semibold">
						Are you enjoying Scheddy?
					</div>

					<div className="text-[0.8125rem]/[1rem] text-[#808080]">
						Consider making a donation to keep it alive!
					</div>
				</div>

				<div className="flex flex-row items-center justify-end gap-x-2 text-xs font-semibold">
					<Button className="cursor-pointer rounded-sm border border-white/[6%] bg-[#313131] px-3 py-1.5">
						Donate
					</Button>

					<Button
						className="cursor-pointer rounded-sm border border-white/[6%] bg-[#313131] px-3 py-1.5"
						onClick={() => onDismiss()}
					>
						Dismiss
					</Button>
				</div>
			</DialogPanel>
		</div>
	</Dialog>
);
