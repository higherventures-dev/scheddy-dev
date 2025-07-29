import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./stepper";

const meta = {
	title: "Forms/Book/Stepper",
	component: Stepper,
	decorators: [
		(Story) => (
			<div className="w-[600px]">
				<Story />
			</div>
		),
	],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Stepper",
	args: { step: "service" },
};
