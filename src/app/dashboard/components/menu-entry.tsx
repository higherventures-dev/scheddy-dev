"use client";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { PropsWithChildren } from "react";

export const MenuEntry = ({
	id,
	icon,
	segment,
	children,
}: PropsWithChildren<{ id: string; segment: string; icon: IconProp }>) => {
	const currentSegment = useSelectedLayoutSegment();

	return (
		<Link
			href={`/dashboard/${id}${segment === "(index)" ? "" : `/${segment}`}`}
			className={clsx(
				"flex min-h-7 flex-row items-center gap-x-2 rounded-md px-2 py-1.5 text-[0.8125rem]/[1rem] font-semibold",
				{
					"text-[#808080]": segment !== currentSegment,
					"bg-white/[6%] text-white": segment === currentSegment,
				},
			)}
		>
			<FontAwesomeIcon icon={icon} width={20} height={20} />

			<p>{children}</p>
		</Link>
	);
};
