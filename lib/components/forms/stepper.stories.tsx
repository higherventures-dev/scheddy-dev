import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./stepper";

const meta = {
	title: "Forms/Stepper",
	component: Stepper,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Stepper",
	args: {
		current: 0,
		steps: 5,
	},
};
