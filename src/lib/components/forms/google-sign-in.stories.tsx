import type { Meta, StoryObj } from "@storybook/react";
import { GoogleSignIn } from "./google-sign-in";

const meta = {
	title: "Forms/Google sign-in",
	component: GoogleSignIn,
	argTypes: {
		children: { table: { disable: true } },
		next: { table: { disable: true } },
	},
	args: {
		children: "Sign-in with Google",
	},
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof GoogleSignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Google sign-in",
};
