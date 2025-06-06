import type { BookingInformation } from "#/app/book/[businessId]/get-booking-information";
import { createBooking } from "#/lib/actions/create-booking";
import { schema } from "#/lib/actions/create-booking.schema";
import { signInWithOtp } from "#/lib/actions/sign-in-with-otp";
import { TextInput } from "#/lib/components/forms/text-input";
import type { Dayjs } from "#/lib/dayjs";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import type { z } from "zod";
import { TextArea } from "../text-area";

const localSchema = schema.pick({
	comments: true,
	email: true,
	familyName: true,
	givenName: true,
	phone: true,
});

type Inputs = z.infer<typeof localSchema>;

export const Confirmation = ({
	businessId,
	categories,
	serviceId,
	time,
}: Pick<BookingInformation, "categories"> & {
	businessId: string;
	serviceId: number;
	time: Dayjs;
}) => {
	const { getValues, handleSubmit, register } = useForm<Inputs>({
		resolver: zodResolver(localSchema),
	});
	const [policyAccepted, setPolicyAccepted] = useState(false);

	const [state, submitHandler] = useAsyncFn((data: Inputs) =>
		createBooking({
			businessId,
			serviceId,
			time: time.toISOString(),
			...data,
		}),
	);

	const onSubmit = handleSubmit(submitHandler);

	const onClick = async () => {
		const { email } = getValues();

		await signInWithOtp({ email });
		await onSubmit();
	};

	const selectedService = categories
		.flatMap((services) => services)
		.find(({ id }) => id === serviceId);
	if (!selectedService) {
		return null;
	}

	return (
		<>
			<div className="border-b border-white/[6%] py-6">
				<div className="font-medium">{selectedService.name}</div>
				<div className="mt-0.5 mb-1 text-sm">{`at ${time.format("LT")}`}</div>
				<div className="text-sm">{time.format("LL")}</div>
			</div>

			<div className="flex flex-col gap-y-4 border-b border-white/[6%] py-6">
				<div className="flex flex-row gap-x-6">
					<TextInput
						autoComplete="given-name"
						className="grow"
						label="First name"
						required
						{...register("givenName", { required: true })}
					/>
					<TextInput
						autoComplete="family-name"
						className="grow"
						label="Last name"
						{...register("familyName")}
					/>
				</div>

				<TextInput type="tel" label="Phone number" {...register("phone")} />

				<TextInput type="email" label="Email" {...register("email")} />
			</div>

			<div className="border-b border-white/[6%] py-6">
				<div className="font-medium">Cancellation policy</div>
				<div className="mt-2 mb-6 text-sm">
					For appointments canceled or rescheduled within 24 hours, we charge
					50% of the service total
				</div>

				<label className="flex flex-row items-center gap-x-3">
					<Switch
						checked={policyAccepted}
						onChange={(checked) => setPolicyAccepted(checked)}
						className="group flex h-5 w-9 items-center rounded-full border border-white/[14%] bg-gray-200 transition data-[checked]:bg-[#69AADE]"
					>
						<span className="size-4.5 rounded-full bg-white transition group-data-[checked]:translate-x-4" />
					</Switch>

					<span className="text-sm select-none">
						I agree to cancelation policy
					</span>
				</label>
			</div>

			<div className="border-b border-white/[6%] py-6">
				<TextArea
					label="Comments"
					placeholder="Enter your requests or any other notes..."
					{...register("comments")}
				/>
			</div>

			<Button
				className="mt-6 mb-10 w-full rounded-lg bg-white p-3 text-sm font-semibold text-[#1c1c1c]"
				onClick={onClick}
			>
				{state.loading ? (
					<FontAwesomeIcon
						className="animate-spin"
						icon={faSpinner}
						width={20}
						height={20}
					/>
				) : (
					"Book now"
				)}
			</Button>
		</>
	);
};
