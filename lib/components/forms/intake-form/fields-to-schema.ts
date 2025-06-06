import type {
	JsonSchema7,
	UISchemaElement,
	VerticalLayout,
} from "@jsonforms/core";
import { set } from "lodash-es";
import { z } from "zod";

const nameFieldSchema = z.object({
	type: z.literal("name"),
	id: z.string(),
	required: z.boolean().default(false),
});

const emailFieldSchema = z.object({
	type: z.literal("email"),
	id: z.string(),
	title: z.string(),
	placeholder: z.string().optional(),
	required: z.boolean().default(false),
});

const phoneFieldSchema = z.object({
	type: z.literal("phone"),
	id: z.string(),
	title: z.string(),
	placeholder: z.string().optional(),
	required: z.boolean().default(false),
});

const shortTextFieldSchema = z.object({
	type: z.literal("short-text"),
	id: z.string(),
	title: z.string(),
	placeholder: z.string().optional(),
	helpText: z.string().optional(),
	maxLength: z.number().optional(),
	required: z.boolean().default(false),
});

const longTextFieldSchema = z.object({
	type: z.literal("long-text"),
	id: z.string(),
	title: z.string(),
	placeholder: z.string().optional(),
	helpText: z.string().optional(),
	maxLength: z.number().optional(),
	required: z.boolean().default(false),
});

const multipleChoiceFieldSchema = z.object({
	type: z.literal("multiple-choice"),
	id: z.string(),
	title: z.string(),
	placeholder: z.string().optional(),
	helpText: z.string().optional(),
	options: z.array(z.string()),
	required: z.boolean().default(false),
});

const toggleFieldSchema = z.object({
	type: z.literal("toggle"),
	id: z.string(),
	title: z.string(),
	helpText: z.string().optional(),
	required: z.boolean().default(false),
});

const sectionTitleSchema = z.object({
	type: z.literal("section-title"),
	id: z.string(),
	text: z.string(),
});

const sectionBodySchema = z.object({
	type: z.literal("section-body"),
	id: z.string(),
	text: z.string(),
});

const fieldSchema = z.union([
	nameFieldSchema,
	emailFieldSchema,
	phoneFieldSchema,
	shortTextFieldSchema,
	longTextFieldSchema,
	multipleChoiceFieldSchema,
	toggleFieldSchema,
	sectionTitleSchema,
	sectionBodySchema,
]);

export type FormField = z.input<typeof fieldSchema>;

const formSchema = z.array(fieldSchema);

export type FormFields = z.input<typeof formSchema>;

export const fieldsToSchema = (input: FormFields) => {
	const fields = formSchema.parse(input);

	const schema = {
		type: "object" as JsonSchema7["type"],
		required: [] as NonNullable<JsonSchema7["required"]>,
		properties: {} as NonNullable<JsonSchema7["properties"]>,
	};

	const uischema: VerticalLayout = {
		type: "VerticalLayout",
		elements: [],
	};

	for (const field of fields) {
		switch (field.type) {
			case "name": {
				set(schema.properties, field.id, {
					type: "object",
					properties: {
						givenName: { type: "string" },
						familyName: { type: "string" },
					},
				});

				uischema.elements.push({
					type: "HorizontalLayout",
					elements: [
						{
							type: "Control",
							scope: `#/properties/${field.id}/properties/givenName`,
							label: "First name",
							"ui:autocomplete": "given-name",
							"ui:placeholder": "Enter first name",
						},
						{
							type: "Control",
							scope: `#/properties/${field.id}/properties/familyName`,
							label: "Last name",
							"ui:autocomplete": "family-name",
							"ui:placeholder": "Enter last name",
						},
					],
				} as UISchemaElement);

				break;
			}

			case "email": {
				set(schema.properties, field.id, { type: "string" });

				uischema.elements.push({
					type: "Control",
					scope: `#/properties/${field.id}`,
					label: field.title,
					"ui:inputType": "email",
					"ui:placeholder": field.placeholder,
				} as UISchemaElement);

				break;
			}

			case "phone": {
				set(schema.properties, field.id, { type: "string" });

				uischema.elements.push({
					type: "Control",
					scope: `#/properties/${field.id}`,
					label: field.title,
					"ui:inputType": "tel",
					"ui:placeholder": field.placeholder,
				} as UISchemaElement);

				break;
			}

			case "long-text": {
				set(schema.properties, field.id, { type: "string" });

				uischema.elements.push({
					type: "Control",
					scope: `#/properties/${field.id}`,
					label: field.title,
					"ui:placeholder": field.placeholder,
					options: {
						multiline: true,
					},
				} as UISchemaElement);

				break;
			}

			case "short-text": {
				set(schema.properties, field.id, { type: "string" });

				uischema.elements.push({
					type: "Control",
					scope: `#/properties/${field.id}`,
					label: field.title,
					"ui:placeholder": field.placeholder,
				} as UISchemaElement);

				break;
			}

			case "multiple-choice": {
				set(schema.properties, field.id, {
					type: "array",
					items: {
						type: "string",
						enum: field.options,
					},
				});

				uischema.elements.push({
					type: "Control",
					scope: `#/properties/${field.id}`,
					label: field.title,
					"ui:placeholder": field.placeholder,
					options: {
						multi: true,
					},
				} as UISchemaElement);

				break;
			}

			case "toggle": {
				set(schema.properties, field.id, { type: "boolean" });

				uischema.elements.push({
					type: "Control",
					scope: `#/properties/${field.id}`,
					label: field.title,
					options: {
						toggle: true,
					},
				} as UISchemaElement);

				break;
			}

			case "section-title": {
				uischema.elements.push({
					type: "Label",
					text: field.text,
				} as UISchemaElement);

				break;
			}

			case "section-body": {
				uischema.elements.push({
					type: "Text",
					text: field.text,
				} as UISchemaElement);

				break;
			}
		}
	}

	return { schema, uischema };
};
