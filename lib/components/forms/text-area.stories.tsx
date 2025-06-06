import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./text-area";

const meta = {
	title: "Forms/Text area",
	component: TextArea,
	argTypes: {
		label: {
			control: "text",
		},
		required: {
			control: "boolean",
		},
	},
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
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Text area",
	args: {
		label: "Text area",
		placeholder: "Enter text",
		required: false,
	},
};
