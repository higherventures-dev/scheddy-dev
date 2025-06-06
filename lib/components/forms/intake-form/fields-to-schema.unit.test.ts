import { describe, expect, it } from "vitest";
import { fieldsToSchema } from "./fields-to-schema";

describe("fieldsToSchema", () => {
	it("should convert name field", () => {
		expect(fieldsToSchema([{ type: "name", id: "name" }])).toStrictEqual({
			schema: {
				properties: {
					name: {
						properties: {
							familyName: { type: "string" },
							givenName: { type: "string" },
						},
						type: "object",
					},
				},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						elements: [
							{
								label: "First name",
								scope: "#/properties/name/properties/givenName",
								type: "Control",
								"ui:autocomplete": "given-name",
								"ui:placeholder": "Enter first name",
							},
							{
								label: "Last name",
								scope: "#/properties/name/properties/familyName",
								type: "Control",
								"ui:autocomplete": "family-name",
								"ui:placeholder": "Enter last name",
							},
						],
						type: "HorizontalLayout",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	it("should convert email field", () => {
		expect(
			fieldsToSchema([
				{
					type: "email",
					id: "email",
					title: "Email",
					placeholder: "Enter email address",
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {
					email: { type: "string" },
				},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						label: "Email",
						scope: "#/properties/email",
						type: "Control",
						"ui:inputType": "email",
						"ui:placeholder": "Enter email address",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	it("should convert phone field", () => {
		expect(
			fieldsToSchema([
				{
					type: "phone",
					id: "phone",
					title: "Phone",
					placeholder: "Enter phone number",
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {
					phone: { type: "string" },
				},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						label: "Phone",
						scope: "#/properties/phone",
						type: "Control",
						"ui:inputType": "tel",
						"ui:placeholder": "Enter phone number",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	it("should convert short text field", () => {
		expect(
			fieldsToSchema([
				{
					type: "short-text",
					id: "short-text",
					title: "Short text",
					placeholder: "Enter short text",
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {
					"short-text": { type: "string" },
				},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						label: "Short text",
						scope: "#/properties/short-text",
						type: "Control",
						"ui:placeholder": "Enter short text",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	it("should convert long text field", () => {
		expect(
			fieldsToSchema([
				{
					type: "long-text",
					id: "long-text",
					title: "Long text",
					placeholder: "Enter long text",
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {
					"long-text": { type: "string" },
				},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						label: "Long text",
						options: {
							multiline: true,
						},
						scope: "#/properties/long-text",
						type: "Control",
						"ui:placeholder": "Enter long text",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	// it("should convert single choice field", () => {
	// 	expect(
	// 		fieldsToSchema([
	// 			{
	// 				type: "single-choice",
	// 				id: "single-choice",
	// 				title: "Single choice",
	// 				placeholder: "Select an option",
	// 				options: ["Option 1", "Option 2"],
	// 			},
	// 		]),
	// 	).toStrictEqual({
	// 		schema: {
	// 			properties: {
	// 				"single-choice": {
	// 					type: "string",
	// 					enum: ["Option 1", "Option 2"],
	// 				},
	// 			},
	// 			required: [],
	// 			type: "object",
	// 		},
	// 		uischema: {
	// 			elements: [
	// 				{
	// 					label: "Single choice",
	// 					scope: "#/properties/single-choice",
	// 					type: "Control",
	// 					"ui:placeholder": "Select an option",
	// 				},
	// 			],
	// 			type: "VerticalLayout",
	// 		},
	// 	});
	// });

	it("should convert multiple choice field", () => {
		expect(
			fieldsToSchema([
				{
					type: "multiple-choice",
					id: "multiple-choice",
					title: "Multiple choice",
					placeholder: "Select all option that apply",
					options: ["Option 1", "Option 2"],
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {
					"multiple-choice": {
						type: "array",
						items: {
							type: "string",
							enum: ["Option 1", "Option 2"],
						},
					},
				},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						label: "Multiple choice",
						options: {
							multi: true,
						},
						scope: "#/properties/multiple-choice",
						type: "Control",
						"ui:placeholder": "Select all option that apply",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	it("should convert boolean field", () => {
		expect(
			fieldsToSchema([
				{
					type: "toggle",
					id: "boolean",
					title: "Boolean",
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {
					boolean: { type: "boolean" },
				},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						label: "Boolean",
						options: {
							toggle: true,
						},
						scope: "#/properties/boolean",
						type: "Control",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	it("should convert section title field", () => {
		expect(
			fieldsToSchema([
				{
					type: "section-title",
					id: "section-title",
					text: "Section title",
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						text: "Section title",
						type: "Label",
					},
				],
				type: "VerticalLayout",
			},
		});
	});

	it("should convert section body field", () => {
		expect(
			fieldsToSchema([
				{
					type: "section-body",
					id: "section-body",
					text: "Section body",
				},
			]),
		).toStrictEqual({
			schema: {
				properties: {},
				required: [],
				type: "object",
			},
			uischema: {
				elements: [
					{
						text: "Section body",
						type: "Text",
					},
				],
				type: "VerticalLayout",
			},
		});
	});
});
