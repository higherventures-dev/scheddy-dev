import type { BookingInformation } from "#/app/book/[businessId]/get-booking-information";
import type { Dayjs } from "#/lib/dayjs";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { Confirmation } from "./confirmation";
import { SelectService } from "./service";
import { Stepper, type Step } from "./stepper";
import { SelectTime } from "./time";

export const BookingModal = ({
	businessId,
	initialServiceId,
	categories,
	services,
	open,
	onClose,
}: Pick<BookingInformation, "categories" | "services"> & {
	businessId: string;
	initialServiceId?: number;
	open: boolean;
	onClose: () => void;
}) => {
	const [serviceId, setServiceId] = useState(initialServiceId);
	const [time, setTime] = useState<Dayjs>();

	const step: Step = (() => {
		if (time) {
			return "confirm";
		}

		if (serviceId) {
			return "time";
		}

		return "service";
	})();

	return (
		<Dialog open={open} onClose={() => onClose()}>
			<div className="fixed inset-0 flex w-screen items-center justify-center bg-black/[32%] p-4">
				<DialogPanel className="max-h-full min-h-[70vh] w-full max-w-[37.5rem] overflow-x-hidden rounded-xl bg-[#323232]">
					<DialogTitle
						as="header"
						className="flex flex-col gap-y-1 bg-[#292929]"
					>
						<div className="m-3 flex flex-row justify-end">
							<Button
								className="h-6 w-6 rounded-full bg-white/[6%] text-center leading-6"
								onClick={() => onClose()}
							>
								<FontAwesomeIcon icon={faClose} width={16} height={16} />
							</Button>
						</div>

						<Stepper step={step} />
					</DialogTitle>

					<div className="overflow-auto px-10 py-6">
						{serviceId == null && (
							<SelectService
								categories={categories}
								services={services}
								onSelect={(id) => setServiceId(id)}
							/>
						)}

						{serviceId != null && time == null && (
							<SelectTime
								businessId={businessId}
								serviceId={serviceId}
								onSelectAction={(startTime) => setTime(startTime)}
							/>
						)}

						{serviceId != null && time != null && (
							<Confirmation
								businessId={businessId}
								serviceId={serviceId}
								time={time}
								categories={categories}
							/>
						)}
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
