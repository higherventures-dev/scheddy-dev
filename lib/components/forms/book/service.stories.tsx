import { categories, services } from "#/app/book/[businessId]/mock";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SelectService } from "./service";

const meta = {
	title: "Forms/Book/Select service",
	component: SelectService,
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
} satisfies Meta<typeof SelectService>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Select service",
	args: { categories, services, onSelect: fn() },
};
