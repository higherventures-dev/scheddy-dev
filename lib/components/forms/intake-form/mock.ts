import type { FormTemplate } from "#/app/dashboard/[id]/settings/form-templates/form-dialog/get-form-template";

export const fields = [
	{
		type: "name",
		id: "name",
		required: true,
	},
	{
		type: "email",
		id: "email",
		title: "Email",
		required: true,
	},
	{
		type: "short-text",
		id: "concerns",
		title: "What are your primary facial concerns?",
		required: true,
	},
	{
		type: "multiple-choice",
		id: "allergies",
		title: "Allergies",
		options: ["Nuts", "Essential oils", "Gluten", "Latex"],
		required: true,
	},
	{
		type: "section-title",
		id: "cancellationPolicyTitle",
		text: "Cancellation policy",
	},
	{
		type: "section-body",
		id: "cancellationPolicyBody",
		text: "For appointments canceled or rescheduled within 24 hours of appointment start time, we charge 50% of the service total.",
	},
	{
		type: "toggle",
		id: "cancellationPolicy",
		title: "Cancellation policy",
		required: true,
	},
] satisfies FormTemplate["fields"];
