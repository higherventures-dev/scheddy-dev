import { Input } from "@headlessui/react";
import {
	isStringControl,
	rankWith,
	type CellProps,
	type RankedTester,
} from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import { get } from "lodash-es";

export const tester: RankedTester = rankWith(2, isStringControl);

const TextCellRenderer = ({
	data = "",
	handleChange,
	path,
	uischema,
}: CellProps) => (
	<Input
		className="w-full rounded-lg border border-[#272626]/[6%] p-2 placeholder:text-[#999999] dark:border-white/[6%]"
		value={data}
		onChange={(e) => handleChange(path, e.target.value)}
		autoComplete={get(uischema, "ui:autocomplete")}
		type={get(uischema, "ui:inputType")}
		placeholder={get(uischema, "ui:placeholder")}
	/>
);

TextCellRenderer.displayName = "TextCellRenderer";

export const cell = withJsonFormsCellProps(TextCellRenderer);
