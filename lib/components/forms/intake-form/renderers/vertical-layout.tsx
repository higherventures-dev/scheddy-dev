import {
	rankWith,
	uiTypeIs,
	type RankedTester,
	type RendererProps,
	type VerticalLayout,
} from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsLayoutProps } from "@jsonforms/react";

export const tester: RankedTester = rankWith(1, uiTypeIs("VerticalLayout"));

const VerticalLayoutRenderer = ({ uischema, ...props }: RendererProps) => {
	const verticalLayout = uischema as VerticalLayout;

	return (
		<div className="flex flex-col gap-y-4">
			{verticalLayout.elements.map((element, index) => (
				<JsonFormsDispatch key={index} {...props} uischema={element} />
			))}
		</div>
	);
};

VerticalLayoutRenderer.displayName = "VerticalLayoutRenderer";

export const renderer = withJsonFormsLayoutProps(VerticalLayoutRenderer);
