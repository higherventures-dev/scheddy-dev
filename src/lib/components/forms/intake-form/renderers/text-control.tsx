import { Field, Label } from "@headlessui/react";
import {
	isStringControl,
	rankWith,
	type ControlProps,
	type RankedTester,
} from "@jsonforms/core";
import { DispatchCell, withJsonFormsControlProps } from "@jsonforms/react";

export const tester: RankedTester = rankWith(1, isStringControl);

const TextControlRenderer = ({
	label,
	path,
	schema,
	uischema,
}: ControlProps) => (
	<Field className="flex flex-grow flex-col gap-y-2 text-sm">
		<Label>{label}</Label>

		<DispatchCell schema={schema} uischema={uischema} path={path} />
	</Field>
);

TextControlRenderer.displayName = "TextControlRenderer";

export const renderer = withJsonFormsControlProps(TextControlRenderer);
