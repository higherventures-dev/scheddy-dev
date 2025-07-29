import { getCustomer } from "lib/actions/get-customer";
import { MiniDate } from "lib/components/calendar/mini-date";
import { dayjs } from "lib/dayjs";
import {
	faAdd,
	faClose,
	faCreditCard,
	faEllipsis,
	faEnvelope,
	faPhone,
	faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Dialog,
	DialogBackdrop,
	DialogPanel,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
	type DialogProps,
} from "@headlessui/react";
import { groupBy, sortBy } from "lodash-es";
import type { PropsWithChildren } from "react";
import { useAsync } from "react-use";
import { z } from "zod";

type Props = Pick<DialogProps, "open" | "onClose"> & {
	customerId: string;
};

const schema = z.object({
	bookings: z.array(
		z.object({
			id: z.number(),
			startTime: z
				.string()
				.datetime()
				.transform((datetime) => dayjs(datetime)),
			endTime: z
				.string()
				.datetime()
				.transform((datetime) => dayjs(datetime)),
			price: z.string().transform((v) => +v),
			cancelledAt: z
				.string()
				.datetime()
				.nullable()
				.transform((datetime) => (datetime != null ? dayjs(datetime) : null)),
			employee: z.object({
				profile: z.object({
					givenName: z.string(),
					familyName: z.string().nullable(),
				}),
			}),
		}),
	),
	profile: z.object({
		email: z.string().nullable(),
		phone: z.string().nullable(),
		givenName: z.string(),
		familyName: z.string().nullable(),
	}),
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export const CustomerDrawer = ({ customerId, open, onClose }: Props) => {
	const { error, value } = useAsync(async () => {
		const customer = await getCustomer({ customerId });
		return schema.parse(customer);
	}, [customerId]);

	if (error) {
		console.error(error);
		return null;
	}

	if (!value) {
		return null;
	}

	const bookingsByMonth = sortBy(
		Object.entries(
			groupBy(
				value.bookings,
				({ startTime }) => `${startTime.format("YYYY-MM")}`,
			),
		),
		"[0]",
	).toReversed();

	const generatedRevenue = value.bookings.reduce(
		(acc, { price }) => acc + price,
		0,
	);

	const cancelledBookings = value.bookings.filter(
		({ cancelledAt }) => cancelledAt != null,
	);

	const today = dayjs();

	return (
		<Dialog open={open} onClose={onClose} className="relative" transition>
			<DialogBackdrop
				className="fixed inset-0 bg-black/15"
				onClick={() => onClose(false)}
			/>

			<div className="fixed inset-0 flex w-screen items-stretch justify-end p-2">
				<DialogPanel className="w-[25rem] overflow-auto rounded-lg bg-[#313131]">
					<div className="flex flex-row justify-end p-3">
						<Button
							className="h-6 w-6 cursor-pointer rounded-full bg-white/[6%] text-center leading-6"
							onClick={() => onClose(false)}
						>
							<FontAwesomeIcon icon={faClose} width={16} height={16} />
						</Button>
					</div>

					<div className="flex flex-col px-6 pb-6">
						<div className="mb-4 flex min-h-12 flex-row items-center justify-between">
							<h2 className="text-[1.5rem] font-semibold tracking-tight">
								{value.profile.familyName
									? `${value.profile.givenName} ${value.profile.familyName}`
									: value.profile.givenName}
							</h2>
						</div>

						<TabGroup>
							<TabList className="flex flex-row gap-x-0.5 border-b border-white/[6%] pb-4">
								<Tab as={StateButton}>General</Tab>
								<Tab as={StateButton}>Bookings</Tab>
								<Tab as={StateButton}>Reviews</Tab>
								<Tab as={StateButton}>Photos</Tab>
								<Tab as={StateButton}>Notes</Tab>
							</TabList>

							<TabPanels>
								<TabPanel className="divide-y divide-white/[6%]">
									<div className="flex flex-col gap-y-2 py-4">
										<h3 className="leading-8 font-semibold">
											Contact information
										</h3>

										<div className="grid auto-rows-auto grid-cols-[1fr_2fr] gap-x-2">
											<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
												<div className="flex flex-row items-center gap-x-2 text-[#969696]">
													<FontAwesomeIcon
														icon={faPhone}
														width={12}
														height={12}
													/>

													<span>Phone</span>
												</div>

												<div className="self-center">
													{value.profile.phone ?? "--"}
												</div>
											</div>

											<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
												<div className="flex flex-row items-center gap-x-2 text-[#969696]">
													<FontAwesomeIcon
														icon={faEnvelope}
														width={12}
														height={12}
													/>

													<span>Email</span>
												</div>

												<div className="self-center">
													{value.profile.email ?? "--"}
												</div>
											</div>

											<div className="col-span-full grid min-h-8 grid-cols-subgrid text-[0.8125rem]/[1.25rem]">
												<div className="flex flex-row items-center gap-x-2 text-[#969696]">
													<FontAwesomeIcon
														icon={faCreditCard}
														width={12}
														height={12}
													/>

													<span>Credit</span>
												</div>

												<div className="self-center">
													<Button className="flex h-6 flex-row items-center gap-x-1.5 rounded-md border border-white/[6%] bg-[#313131] px-2 text-sm font-medium">
														<FontAwesomeIcon
															icon={faAdd}
															width={10}
															height={10}
														/>

														<span>Add credit card</span>
													</Button>
												</div>
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-y-2 py-4">
										<h3 className="leading-8 font-semibold">Numbers</h3>

										<div className="grid auto-rows-auto grid-cols-2 gap-3">
											<div className="flex h-20 flex-col justify-center gap-y-2 rounded-lg bg-[#3A3A3A] px-4">
												<div className="text-[1.25rem]/[1.5rem] font-semibold -tracking-[2%] text-[#69AADE]">
													{value.bookings.length}
												</div>

												<div className="text-[0.8125rem]/[1.25rem] font-medium">
													Bookings
												</div>
											</div>

											<div className="flex h-20 flex-col justify-center gap-y-2 rounded-lg bg-[#3A3A3A] px-4">
												<div className="text-[1.25rem]/[1.5rem] font-semibold -tracking-[2%] text-[#80CF93]">
													{currencyFormatter.format(generatedRevenue)}
												</div>

												<div className="text-[0.8125rem]/[1.25rem] font-medium">
													Generated revenue
												</div>
											</div>

											<div className="flex h-20 flex-col justify-center gap-y-2 rounded-lg bg-[#3A3A3A] px-4">
												<div className="text-[1.25rem]/[1.5rem] font-semibold -tracking-[2%] text-[#FB6A58]">
													{cancelledBookings.length}
												</div>

												<div className="text-[0.8125rem]/[1.25rem] font-medium">
													Cancelled
												</div>
											</div>

											<div className="flex h-20 flex-col justify-center gap-y-2 rounded-lg bg-[#3A3A3A] px-4">
												<div className="text-[1.25rem]/[1.5rem] font-semibold -tracking-[2%] text-[#808080]">
													0
												</div>

												<div className="text-[0.8125rem]/[1.25rem] font-medium">
													No-shows
												</div>
											</div>
										</div>
									</div>
								</TabPanel>

								<TabPanel>
									<div className="flex flex-col gap-y-2 divide-y divide-white/[6%]">
										{bookingsByMonth.map(([month, bookings]) => {
											const monthStart = dayjs(`${month}-01`);

											return (
												<div
													key={month}
													className="flex flex-col gap-y-2 pt-4 pb-6"
												>
													<div className="text-[1rem]/[2rem] font-semibold">
														{monthStart.format(
															monthStart.isSame(today, "year")
																? "MMMM"
																: "MMMM YYYY",
														)}
													</div>

													<div className="flex flex-col gap-y-3">
														{bookings.map(
															({ id, startTime, endTime, price, employee }) => {
																const duration = dayjs.duration(
																	endTime.diff(startTime),
																);

																return (
																	<div
																		key={id}
																		className="rounded-lg bg-[#262626]"
																	>
																		<div className="shadow-menu-items rounded-lg border border-white/[6%] bg-[#3A3A3A]">
																			<div className="flex flex-row items-center gap-x-3 px-3 py-2">
																				<MiniDate date={startTime} />

																				<div className="flex flex-col gap-y-1">
																					<div className="text-[0.8125rem]/[1.25rem] font-semibold">
																						{startTime.format("dddd, MMMM D")}
																					</div>

																					<div className="text-xs font-medium text-[#969696]">{`${startTime.format("LT")} - ${endTime.format("LT")}`}</div>
																				</div>
																			</div>

																			<div className="flex flex-row items-center gap-x-3 px-3 py-2">
																				<div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-white/[6%] font-semibold text-[#808080]">
																					<FontAwesomeIcon
																						icon={faTag}
																						width={20}
																						height={20}
																					/>
																				</div>

																				<div className="flex grow flex-col gap-y-1">
																					<div className="flex flex-row justify-between text-[0.8125rem]/[1.25rem] font-semibold">
																						<div>Continuing session</div>

																						<div>
																							{currencyFormatter.format(price)}
																						</div>
																					</div>

																					<div className="text-xs font-medium text-[#969696]">{`${duration.humanize()} · ${employee.profile.familyName ? `${employee.profile.givenName} ${employee.profile.familyName}` : employee.profile.givenName}`}</div>
																				</div>
																			</div>
																		</div>

																		<div className="flex flex-row items-center justify-between px-3 py-2.5">
																			<Button className="cursor-pointer rounded-sm border border-white/[6%] bg-[#313131] px-3 py-1.5 text-xs font-medium">
																				Checkout
																			</Button>

																			<Button className="cursor-pointer">
																				<FontAwesomeIcon
																					className="text-[#969696]"
																					icon={faEllipsis}
																					width={16}
																					height={16}
																				/>
																			</Button>
																		</div>
																	</div>
																);
															},
														)}
													</div>
												</div>
											);
										})}
									</div>
								</TabPanel>

								<TabPanel />
								<TabPanel />
								<TabPanel />
							</TabPanels>
						</TabGroup>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};

type StateButtonProps = PropsWithChildren<{
	"data-selected"?: boolean;
	onClick?: () => void;
}>;

const StateButton = (props: StateButtonProps) => (
	<Button
		className="cursor-pointer rounded-sm px-3 py-1.5 text-xs font-medium data-[selected]:bg-[#3A3A3A]"
		{...props}
	/>
);
