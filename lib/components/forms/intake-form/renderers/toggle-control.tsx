import { Field, Label } from "@headlessui/react";
import {
	and,
	isBooleanControl,
	optionIs,
	rankWith,
	type ControlProps,
	type RankedTester,
} from "@jsonforms/core";
import { DispatchCell, withJsonFormsControlProps } from "@jsonforms/react";

export const tester: RankedTester = rankWith(
	3,
	and(isBooleanControl, optionIs("toggle", true)),
);

const ToggleControlRenderer = ({
	label,
	path,
	schema,
	uischema,
}: ControlProps) => (
	<Field className="flex flex-grow flex-row items-center gap-x-3 text-sm">
		<DispatchCell schema={schema} uischema={uischema} path={path} />

		<Label>{label}</Label>
	</Field>
);

ToggleControlRenderer.displayName = "ToggleControlRenderer";

export const renderer = withJsonFormsControlProps(ToggleControlRenderer);
