import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export type Step = "service" | "employee" | "time" | "confirm" | "totp";

export const Stepper = ({ step }: { step: Step }) => (
	<div className="mx-10 mt-1 mb-6 flex flex-row items-center justify-between text-sm font-semibold">
		<div
			className={clsx("rounded-full px-3 py-1", {
				"bg-white text-[#292929]": step === "service" || step === "employee",
			})}
		>
			Service & Staff
		</div>

		<FontAwesomeIcon
			icon={faChevronRight}
			className="text-[#808080]"
			width={12}
			height={12}
		/>

		<div
			className={clsx("rounded-full px-3 py-1", {
				"bg-white text-[#292929]": step === "time",
			})}
		>
			Day & Time
		</div>

		<FontAwesomeIcon
			icon={faChevronRight}
			className="text-[#808080]"
			width={12}
			height={12}
		/>

		<div
			className={clsx("rounded-full px-3 py-1", {
				"bg-white text-[#292929]": step === "confirm",
			})}
		>
			Confirm
		</div>
	</div>
);
