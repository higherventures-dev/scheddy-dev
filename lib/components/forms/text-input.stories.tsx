import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./text-input";

const meta = {
	title: "Forms/Text input",
	component: TextInput,
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
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Text input",
	args: {
		label: "Text input",
		placeholder: "Enter text",
		required: false,
	},
};
