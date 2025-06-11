import type { BusinessInformation } from "#/lib/actions/get-business-information";
import {
	faCalendar,
	faCircleUser,
	faGear,
	faHouse,
	faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { MenuEntry } from "./components/menu-entry";

const links = [
	{ title: "Overview", icon: faHouse, segment: "(index)" },
	{ title: "Calendar", icon: faCalendar, segment: "calendar" },
	{ title: "Clients", icon: faCircleUser, segment: "clients" },
	{ title: "Sales", icon: faTag, segment: "sales" },
];

type Props = PropsWithChildren<{ business: BusinessInformation }>;

export const PureLayout = ({ business, children }: Props) => (
	<div
		className="grid min-h-screen"
		style={{ gridTemplateColumns: "15rem 1fr" }}
	>
		<aside className="flex flex-col border-r border-white/[6%] bg-[#1A1A1A]">
			<div className="flex flex-row items-center border-b border-white/[6%] px-3 py-2.5">
				{business.logo && (
					<Image
						className="overflow-hidden rounded-sm p-1"
						src={business.logo}
						alt={business.displayName}
						width={28}
						height={28}
					/>
				)}

				<div className="p-1 text-[0.8125rem]/[1rem]">
					{business.displayName}
				</div>
			</div>

			<div className="flex grow flex-col gap-y-1 p-3">
				{links.map(({ title, ...props }) => (
					<MenuEntry key={props.segment} id={business.uuid} {...props}>
						{title}
					</MenuEntry>
				))}
			</div>

			<div className="p-3">
				<Link
					href={`/dashboard/${business.uuid}/settings`}
					className="flex flex-row items-center gap-x-2 px-2 py-1 text-[0.8125rem]/[1.25rem] text-[#808080]"
				>
					<FontAwesomeIcon icon={faGear} width={20} height={20} />

					<p>Settings</p>
				</Link>
			</div>
		</aside>

		<section className="flex flex-col">{children}</section>
	</div>
);
