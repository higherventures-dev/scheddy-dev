import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { SignInForm } from "./sign-in-form";

const meta = {
	title: "Forms/Sign-in form",
	component: SignInForm,
	argTypes: {
		action: { table: { disable: true } },
	},
	args: { action: fn() },
	decorators: [
		(Story) => (
			<div className="w-[25rem]">
				<Story />
			</div>
		),
	],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Sign-in form",
};
