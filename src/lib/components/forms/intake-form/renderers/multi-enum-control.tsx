import { useTheme } from "#/lib/components/theme.context";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Field,
	Label,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import {
	and,
	hasType,
	rankWith,
	resolveSchema,
	schemaMatches,
	schemaSubPathMatches,
	uiTypeIs,
	type ControlProps,
	type DispatchPropsOfMultiEnumControl,
	type OwnPropsOfEnum,
	type RankedTester,
} from "@jsonforms/core";
import { withJsonFormsMultiEnumProps } from "@jsonforms/react";
import clsx from "clsx";
import { get } from "lodash-es";

export const tester: RankedTester = rankWith(
	5,
	and(
		uiTypeIs("Control"),
		(uischema) => uischema.options?.multi === true,
		schemaMatches(
			(schema, rootSchema) =>
				hasType(schema, "array") &&
				!Array.isArray(resolveSchema(schema, "items", rootSchema)),
		),
		schemaSubPathMatches("items", (schema, rootSchema) => {
			const resolvedSchema = schema.$ref
				? resolveSchema(rootSchema, schema.$ref, rootSchema)
				: schema;

			return (
				resolvedSchema.type === "string" && resolvedSchema.enum !== undefined
			);
		}),
	),
);

const MultiEnumRenderer = ({
	path,
	label,
	data,
	handleChange,
	uischema,
	options = [],
}: ControlProps & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl) => {
	const values = data as unknown[] | undefined;
	const theme = useTheme();

	return (
		<Field className="flex flex-grow flex-col gap-y-2 text-sm">
			<Label>{label}</Label>

			<Listbox
				value={values}
				onChange={(values) => handleChange(path, values)}
				multiple
			>
				<ListboxButton className="group flex w-full flex-row items-center justify-between rounded-lg border border-[#272626]/[6%] p-2 text-start placeholder:text-[#999999] dark:border-white/[6%]">
					<span
						className={clsx({
							"text-[#999999]": !data || data.length === 0,
						})}
					>
						{data && data.length !== 0
							? data.join(", ")
							: get(uischema, "ui:placeholder")}
					</span>

					<FontAwesomeIcon
						icon={faChevronDown}
						width={8}
						height={8}
						className="transition-transform group-data-[open]:rotate-180"
					/>
				</ListboxButton>

				<ListboxOptions
					className="mt-1 flex min-w-60 flex-col gap-y-1 rounded-lg border border-[#272626]/[6%] bg-white p-1 text-sm shadow-lg dark:border-white/[6%] dark:bg-[#272626]"
					anchor="bottom start"
					data-theme={theme}
				>
					{options.map(({ label, value }) => (
						<ListboxOption
							key={value}
							value={value}
							className="group flex items-center justify-between gap-x-3 rounded-sm p-1.5 select-none hover:bg-[#272626]/[6%] dark:hover:bg-white/[6%]"
						>
							<span>{label}</span>

							<FontAwesomeIcon
								icon={faCheck}
								width={12}
								height={12}
								className="opacity-0 group-data-[selected]:opacity-100"
							/>
						</ListboxOption>
					))}
				</ListboxOptions>
			</Listbox>
		</Field>
	);
};

MultiEnumRenderer.displayName = "MultiEnumRenderer";

export const renderer = withJsonFormsMultiEnumProps(MultiEnumRenderer);
