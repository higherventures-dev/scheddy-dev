import { getBooking } from "#/lib/actions/get-booking";
import { dayjs } from "#/lib/dayjs";
import {
	faCheck,
	faCircleQuestion,
	faLeftLong,
	faSquareXmark,
	faTag,
	faTimesSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Dialog,
	DialogBackdrop,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	type DialogProps,
} from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useAsync } from "react-use";
import { z } from "zod";
import { MiniDate } from "../../mini-date";
import { BookingDetails } from "./booking-details";
import { BookingNotes } from "./booking-notes";
import { CustomerDetails } from "./customer-details";
import { PaymentDetails } from "./payment-details";

const schema = z.object({
	event: z.object({
		id: z.number(),
		summary: z.string(),
		start: z
			.string()
			.datetime()
			.transform((datetime) => dayjs(datetime)),
		end: z
			.string()
			.datetime()
			.transform((datetime) => dayjs(datetime)),
		status: z.union([
			z.literal("confirmed"),
			z.literal("pending"),
			z.literal("no-show"),
			z.literal("cancelled"),
		]),
	}),
	employee: z.object({
		givenName: z.string(),
		familyName: z.string(),
		avatar: z.string(),
		role: z.string(),
	}),
	payment: z.object({
		price: z.number(),
		owed: z.number(),
	}),
	customer: z.object({
		givenName: z.string(),
		familyName: z.string(),
		phone: z.string(),
		email: z.string(),
		notes: z.string(),
	}),
	booking: z.object({
		createdBy: z.string(),
		createdAt: z
			.string()
			.datetime()
			.transform((datetime) => dayjs(datetime)),
	}),
});

export const BookingOverlay = ({
	bookingId,
	open,
	onClose,
}: Pick<DialogProps, "open" | "onClose"> & { bookingId: number }) => {
	const { error, value } = useAsync(async () => {
		const booking = await getBooking({ bookingId });
		return schema.parse(booking);
	}, [bookingId]);

	if (error) {
		console.error(error);
		return null;
	}

	if (!value) {
		return null;
	}

	const currencyFormatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});

	const duration = value.event.end.diff(value.event.start, "minutes");
	const durationFormatter = new Intl.NumberFormat("en-US", {
		style: "unit",
		unit: duration >= 60 ? "hour" : "minute",
		unitDisplay: "long",
	});

	return (
		<Dialog open={open} onClose={onClose} className="relative">
			<DialogBackdrop className="fixed inset-0 bg-black/15" />

			<div className="fixed inset-0 flex w-screen items-stretch justify-end p-2">
				<div className="w-[25rem] overflow-auto rounded-lg bg-[#313131]">
					<div className="p-6">
						<div className="pt-2 pb-4">
							<div className="mb-2 flex min-h-12 flex-row items-center justify-between">
								<h2 className="text-[1.5rem] font-semibold tracking-tight">{`${value.customer.givenName} ${value.customer.familyName}`}</h2>

								<Menu>
									<MenuButton className="flex flex-row items-center gap-x-1.5 rounded-sm border border-white/[6%] bg-[#313131] px-3 py-1.5 text-xs font-medium text-white">
										{value.event.status}
									</MenuButton>

									<MenuItems
										className="mt-1 flex w-[13.25rem] flex-col rounded-lg border border-white/[6%] bg-[#313131] data-[closed]:data-[leave]:opacity-0"
										anchor="bottom end"
									>
										<MenuItem>
											<button className="m-1 flex min-h-7 items-center gap-x-2 rounded-sm px-2 text-start text-xs font-medium text-white select-none hover:bg-[#393939]">
												<FontAwesomeIcon
													className="text-[#5586AF]"
													icon={faCircleQuestion}
													width={12}
													height={12}
												/>

												<div className="grow">Unconfirmed</div>

												<FontAwesomeIcon
													icon={faCheck}
													width={12}
													height={12}
													className={clsx({
														"opacity-0": value.event.status !== "pending",
													})}
												/>
											</button>
										</MenuItem>

										<MenuItem>
											<button className="m-1 flex min-h-7 items-center gap-x-2 rounded-sm px-2 text-start text-xs font-medium text-white select-none hover:bg-[#393939]">
												<FontAwesomeIcon
													className="text-[#5586AF]"
													icon={faLeftLong}
													width={12}
													height={12}
												/>

												<div className="grow">Confirmed</div>

												<FontAwesomeIcon
													icon={faCheck}
													width={12}
													height={12}
													className={clsx({
														"opacity-0": value.event.status !== "confirmed",
													})}
												/>
											</button>
										</MenuItem>

										<MenuItem>
											<button className="m-1 flex min-h-7 items-center gap-x-2 rounded-sm px-2 text-start text-xs font-medium text-[#FF5C66] select-none hover:bg-[#393939]">
												<FontAwesomeIcon
													icon={faTimesSquare}
													width={12}
													height={12}
												/>

												<div className="grow">No-show</div>

												<FontAwesomeIcon
													icon={faCheck}
													width={12}
													height={12}
													className={clsx({
														"opacity-0": value.event.status !== "no-show",
													})}
												/>
											</button>
										</MenuItem>

										<MenuItem>
											<button className="m-1 flex min-h-7 items-center gap-x-2 rounded-sm px-2 text-start text-xs font-medium text-[#FF5C66] select-none hover:bg-[#393939]">
												<FontAwesomeIcon
													icon={faSquareXmark}
													width={12}
													height={12}
												/>

												<div className="grow">Cancel</div>

												<FontAwesomeIcon
													icon={faCheck}
													width={12}
													height={12}
													className={clsx({
														"opacity-0": value.event.status !== "cancelled",
													})}
												/>
											</button>
										</MenuItem>
									</MenuItems>
								</Menu>
							</div>

							<div className="flex flex-row items-center gap-x-3 py-2">
								<MiniDate date={value.event.start} />

								<div className="flex flex-col gap-y-1">
									<div className="text-[0.8125rem]/[1.25rem] font-semibold">
										{value.event.start.format("dddd, MMMM D")}
									</div>

									<div className="text-xs font-medium text-[#969696]">{`${value.event.start.format("LT")} - ${value.event.end.format("LT")}`}</div>
								</div>
							</div>

							<div className="flex flex-row items-center gap-x-3 py-2">
								<div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-white/[6%] font-semibold text-[#808080]">
									<FontAwesomeIcon icon={faTag} width={20} height={20} />
								</div>

								<div className="flex flex-col gap-y-1">
									<div className="text-[0.8125rem]/[1.25rem] font-semibold">
										{value.event.summary}
									</div>

									<div className="text-xs font-medium text-[#969696]">{`${durationFormatter.format(duration >= 60 ? duration / 60 : duration)} · ${currencyFormatter.format(value.payment.price)}`}</div>
								</div>
							</div>

							<div className="flex flex-row items-center gap-x-3 py-2">
								<Image
									className="h-10 w-10 overflow-hidden rounded-full"
									src={value.employee.avatar}
									alt={`${value.employee.givenName} ${value.employee.familyName}`}
									width={40}
									height={40}
								/>

								<div className="flex flex-col gap-y-1">
									<div className="text-[0.8125rem]/[1.25rem] font-semibold">
										{`${value.employee.givenName} ${value.employee.familyName}`}
									</div>

									<div className="text-xs font-medium text-[#969696]">
										{value.employee.role}
									</div>
								</div>
							</div>
						</div>

						<PaymentDetails
							owed={value.payment.owed}
							price={value.payment.price}
						/>

						<CustomerDetails
							email={value.customer.email}
							phone={value.customer.phone}
						/>

						<BookingNotes notes={value.customer.notes} />

						<BookingDetails
							bookedVia="Scheddy Widget"
							createdAt={value.booking.createdAt.format("lll")}
							createdBy={value.booking.createdBy}
						/>
					</div>
				</div>
			</div>
		</Dialog>
	);
};
