import type { PropsWithChildren } from "react";

export const Section = ({
	title,
	children,
}: PropsWithChildren<{ title: string }>) => (
	<div className="flex flex-col gap-y-2 border-t border-white/[6%] py-4">
		<h3 className="leading-8 font-semibold">{title}</h3>

		{children}
	</div>
);
