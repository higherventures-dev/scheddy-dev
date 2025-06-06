import { Switch } from "@headlessui/react";
import {
	and,
	isBooleanControl,
	optionIs,
	rankWith,
	type CellProps,
	type RankedTester,
} from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";

export const tester: RankedTester = rankWith(
	3,
	and(isBooleanControl, optionIs("toggle", true)),
);

const ToggleRenderer = ({ data = false, handleChange, path }: CellProps) => (
	<Switch
		checked={data}
		onChange={(checked) => handleChange(path, checked)}
		className="group flex h-5 w-9 items-center rounded-full border border-white/[14%] bg-gray-200 transition data-[checked]:bg-[#69AADE]"
	>
		<span className="size-4.5 rounded-full bg-white transition group-data-[checked]:translate-x-4" />
	</Switch>
);

ToggleRenderer.displayName = "ToggleRenderer";

export const cell = withJsonFormsCellProps(ToggleRenderer);
