"use client";

import {
	faEllipsis,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Field, Input } from "@headlessui/react";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { CustomerDrawer } from "./customer-drawer";
import useSWR from "swr";
import { z } from "zod";
import { useParams } from "next/navigation";

const schema = z.object({
	id: z.string(),
	givenName: z.string().nullable(),
	familyName: z.string().nullable(),
	email: z.string().nullable(),
	phone: z.string().nullable(),
});

const fetcher = (url: string) =>
	fetch(url)
		.then((res) => res.json())
		.then((data) => z.array(schema).parse(data));

type Props = {
	initialCustomers: z.infer<typeof schema>[];
};

export const Customers = ({ initialCustomers }: Props) => {
	const { id } = useParams<{ id: string }>();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

	const url = new URL("/api/clients", window.location.href);
	url.searchParams.set("businessId", id);
	const { data: customers = [] } = useSWR(url.toString(), fetcher, {
		fallbackData: initialCustomers,
	});

	const searchTerms = [
		...searchQuery
			.toLowerCase()
			.matchAll(/\S+/g)
			.map((match) => match[0]),
	];

	const filteredCustomers =
		searchTerms.length !== 0
			? customers.filter(({ email, familyName, givenName }) =>
					searchTerms.every(
						(term) =>
							email?.toLowerCase().includes(term) ||
							familyName?.toLowerCase().includes(term) ||
							givenName?.toLowerCase().includes(term),
					),
				)
			: customers;

	return (
		<div className="bg-[#262626] px-5">
			<div className="py-3 text-[1.125rem]/[1.5rem] font-bold">Clients</div>

			<div className="flex items-center py-2.5">
				<Field className="relative min-h-7 w-[15.125rem] rounded-md border border-[#313131] text-[0.8125rem]/[1rem]">
					<Input
						className="absolute inset-0 rounded-md bg-[#313131] pl-10"
						placeholder="Search clients"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					<FontAwesomeIcon
						icon={faMagnifyingGlass}
						width={16}
						height={16}
						className="absolute top-[50%] left-4 translate-y-[-50%] text-[#969696]"
					/>
				</Field>
			</div>

			<div
				role="table"
				className="grid grid-cols-[min-content_auto_auto_auto_auto_min-content] gap-x-5 text-[0.8125rem]/[1rem]"
			>
				<div
					className="grid min-h-12 grid-cols-subgrid items-center px-5 font-medium text-[#808080]"
					style={{ gridColumnStart: 1, gridColumnEnd: -1 }}
				>
					<div />
					<div>First name</div>
					<div>Last name</div>
					<div>Phone</div>
					<div>Email address</div>
					<div />
				</div>

				{filteredCustomers.map(
					({ id, givenName, familyName, email, phone }) => (
						<div
							key={id}
							role="row"
							className="grid min-h-12 grid-cols-subgrid items-center border-t border-white/[3%] px-5"
							style={{ gridColumnStart: 1, gridColumnEnd: -1 }}
						>
							<div role="cell">
								<div className="flex size-6 items-center justify-center rounded-full bg-white/[12%]">
									{givenName?.[0]}
								</div>
							</div>

							<div role="cell">
								{givenName ? (
									<Highlighter
										highlightClassName="bg-yellow-400"
										searchWords={searchTerms}
										textToHighlight={givenName}
									/>
								) : (
									<span className="text-[#808080]">--</span>
								)}
							</div>

							<div role="cell">
								{familyName ? (
									<Highlighter
										highlightClassName="bg-yellow-400"
										searchWords={searchTerms}
										textToHighlight={familyName}
									/>
								) : (
									<span className="text-[#808080]">--</span>
								)}
							</div>

							<div role="cell">
								{phone ?? <span className="text-[#808080]">--</span>}
							</div>

							<div role="cell">
								{email ? (
									<Highlighter
										highlightClassName="bg-yellow-400"
										searchWords={searchTerms}
										textToHighlight={email}
									/>
								) : (
									<span className="text-[#808080]">--</span>
								)}
							</div>

							<div role="cell">
								<Button
									className="cursor-pointer"
									onClick={() => setSelectedCustomer(id)}
								>
									<FontAwesomeIcon
										className="text-[#969696]"
										icon={faEllipsis}
										width={16}
										height={16}
									/>
								</Button>
							</div>
						</div>
					),
				)}
			</div>

			{selectedCustomer && (
				<CustomerDrawer
					customerId={selectedCustomer}
					open
					onClose={() => setSelectedCustomer(null)}
				/>
			)}
		</div>
	);
};
