import { getCustomerMock } from "#/lib/actions/get-customer.mock";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CustomerDrawer } from "./customer-drawer";

const meta = {
	title: "Components/Customers/Dialog",
	parameters: {
		layout: "fullscreen",
		moduleMock: {
			mock: () => [getCustomerMock()],
		},
	},
	render: function Story() {
		const [open, setOpen] = useState(true);

		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="rounded-lg bg-white p-2.5 text-sm font-semibold text-[#1c1c1c]"
				>
					Open overlay
				</button>

			</div>
		);
	},
} satisfies Meta<typeof CustomerDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Dialog",
};
