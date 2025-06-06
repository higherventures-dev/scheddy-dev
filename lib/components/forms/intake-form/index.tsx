import { useTheme } from "#/lib/components/theme.context";
import type { JsonFormsCore } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cells } from "./cells";
import { renderers } from "./renderers";
import { fieldsToSchema } from "./fields-to-schema";

export const IntakeForm = ({
	logo,
	businessName,
	title,
	subtitle,
	fields,
	onSubmit,
}: {
	logo: string;
	businessName: string;
	title: string;
	subtitle?: string;
	fields: Parameters<typeof fieldsToSchema>[0];
	onSubmit: (data: unknown) => void;
}) => {
	const { schema, uischema } = useMemo(() => fieldsToSchema(fields), [fields]);
	const [data, setData] = useState<JsonFormsCore["data"]>();
	const theme = useTheme();

	return (
		<form
			className="rounded-lg bg-white px-8 py-6 text-[#272626] dark:bg-[#272626] dark:text-white"
			data-theme={theme}
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(data);
			}}
		>
			<div className="flex flex-row items-center gap-x-3">
				<Image
					className="overflow-hidden rounded-lg"
					src={logo}
					alt={businessName}
					width={40}
					height={40}
				/>

				<div className="text-sm font-semibold">{businessName}</div>
			</div>

			<hr className="my-6 border-[#EFEFEF] dark:border-white/[6%]" />

			<header className="mb-6 flex flex-col gap-y-2">
				<h2 className="text-[1.5rem]/[1.75rem] font-semibold tracking-[-2%]">
					{title}
				</h2>

				{subtitle && (
					<p className="text-sm font-medium text-[#808080]">{subtitle}</p>
				)}
			</header>

			<JsonForms
				schema={schema}
				uischema={uischema}
				data={data}
				onChange={({ data }) => {
					setData(data);
				}}
				cells={cells}
				renderers={renderers}
			/>

			<button
				type="submit"
				className="mt-8 w-full rounded-lg border-white/[16%] bg-[#1c1c1c] p-2.5 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-[#1c1c1c]"
			>
				Submit
			</button>
		</form>
	);
};
