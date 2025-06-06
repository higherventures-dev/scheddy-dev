import {
	rankWith,
	uiTypeIs,
	type HorizontalLayout,
	type RankedTester,
	type RendererProps,
} from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsLayoutProps } from "@jsonforms/react";

export const tester: RankedTester = rankWith(1, uiTypeIs("HorizontalLayout"));

const HorizontalLayoutRenderer = ({ uischema, ...props }: RendererProps) => {
	const horizontalLayout = uischema as HorizontalLayout;

	return (
		<div className="flex flex-row gap-x-3">
			{horizontalLayout.elements.map((element, index) => (
				<JsonFormsDispatch key={index} {...props} uischema={element} />
			))}
		</div>
	);
};

HorizontalLayoutRenderer.displayName = "HorizontalLayoutRenderer";

export const renderer = withJsonFormsLayoutProps(HorizontalLayoutRenderer);
