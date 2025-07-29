import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, getByRole, userEvent } from "@storybook/test";
import { IntakeForm } from ".";
import { fields } from "./mock";

const meta = {
	title: "Forms/Intake form",
	component: IntakeForm,
	argTypes: {
		logo: { name: "Logo" },
		businessName: { name: "Business name" },
		title: { name: "Title" },
		subtitle: { name: "Subtitle" },
		fields: { table: { disable: true } },
		onSubmit: { table: { disable: true } },
	},
	args: {
		logo: "https://placehold.co/40x40",
		businessName: "Wayward Tattoo",
		title: "Test Intake Form",
		subtitle:
			"Please complete this form to confirm your authorization from your doctor to receive this service.",
		fields,
		onSubmit: fn(),
	},
	decorators: [
		(Story) => (
			<div className="w-[35rem]">
				<Story />
			</div>
		),
	],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof IntakeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "Intake form",
};

export const Interactive: Story = {
	play: async ({ args, canvas, step }) => {
		await step("Fill in name", async () => {
			await userEvent.type(
				canvas.getByLabelText("First name", { selector: "input" }),
				"James",
				{ delay: 100 },
			);

			await userEvent.type(
				canvas.getByLabelText("Last name", { selector: "input" }),
				"Smith",
				{ delay: 100 },
			);
		});

		await step("Fill in email", () =>
			userEvent.type(
				canvas.getByLabelText("Email", { selector: "input" }),
				"quiet.lobster8132@maildrop.cc",
				{ delay: 100 },
			),
		);

		await step("Select allergies", async () => {
			await userEvent.click(canvas.getByRole("button", { name: "Allergies" }), {
				delay: 100,
			});

			await userEvent.click(
				getByRole(document.body, "option", { name: "Nuts" }),
				{ delay: 100 },
			);

			await userEvent.click(
				getByRole(document.body, "option", { name: "Gluten" }),
				{ delay: 100 },
			);

			await userEvent.click(canvas.getByRole("button", { name: "Allergies" }), {
				delay: 100,
			});
		});

		await step("Accept cancellation policy", () =>
			userEvent.click(canvas.getByRole("switch", { checked: false }), {
				delay: 100,
			}),
		);

		await step("Submit", () =>
			userEvent.click(canvas.getByRole("button", { name: "Submit" }), {
				delay: 100,
			}),
		);

		await step("Submit form", () =>
			expect(args.onSubmit).toHaveBeenCalledWith({
				givenName: "James",
				familyName: "Smith",
				email: "quiet.lobster8132@maildrop.cc",
				allergies: ["Nuts", "Gluten"],
				cancellationPolicy: true,
			}),
		);
	},
};
