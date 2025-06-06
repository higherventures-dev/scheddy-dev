import type { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import * as horizontalLayoutRenderer from "./horizontal-layout";
import * as labelRenderer from "./label";
import * as multiEnumControlRenderer from "./multi-enum-control";
import * as textRenderer from "./text";
import * as textControlRenderer from "./text-control";
import * as toggleControlRenderer from "./toggle-control";
import * as verticalLayoutRenderer from "./vertical-layout";

export const renderers: JsonFormsRendererRegistryEntry[] = [
	horizontalLayoutRenderer,
	labelRenderer,
	multiEnumControlRenderer,
	textRenderer,
	textControlRenderer,
	toggleControlRenderer,
	verticalLayoutRenderer,
];
