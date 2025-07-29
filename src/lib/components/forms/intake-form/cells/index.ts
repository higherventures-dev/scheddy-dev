import type { JsonFormsCellRendererRegistryEntry } from "@jsonforms/core";
import * as textCellRenderer from "./text-cell";
import * as toggleCellRenderer from "./toggle-cell";

export const cells: JsonFormsCellRendererRegistryEntry[] = [
	textCellRenderer,
	toggleCellRenderer,
];
