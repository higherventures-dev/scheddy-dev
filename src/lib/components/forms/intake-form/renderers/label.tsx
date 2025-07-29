import {
	rankWith,
	uiTypeIs,
	type LabelProps,
	type RankedTester,
} from "@jsonforms/core";
import { withJsonFormsLabelProps } from "@jsonforms/react";

export const tester: RankedTester = rankWith(1, uiTypeIs("Label"));

const LabelRenderer = ({ text, visible }: LabelProps) =>
	visible && (
		<h3 className="text-[1.5rem]/[1.75rem] font-semibold tracking-[-2%]">
			{text}
		</h3>
	);

LabelRenderer.displayName = "LabelRenderer";

export const renderer = withJsonFormsLabelProps(LabelRenderer);
