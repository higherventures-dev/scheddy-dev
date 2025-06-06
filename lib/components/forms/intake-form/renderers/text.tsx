import {
	rankWith,
	uiTypeIs,
	type LabelProps,
	type RankedTester,
} from "@jsonforms/core";
import { withJsonFormsLabelProps } from "@jsonforms/react";

export const tester: RankedTester = rankWith(1, uiTypeIs("Text"));

const TextRenderer = ({ text, visible }: LabelProps) =>
	visible && <div className="text-sm font-medium">{text}</div>;

TextRenderer.displayName = "TextRenderer";

export const renderer = withJsonFormsLabelProps(TextRenderer);
