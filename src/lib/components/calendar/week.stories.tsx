import { employees } from "#/app/book/[businessId]/mock";
import { getBookingsMock } from "#/lib/actions/get-bookings.mock";
import type { Meta, StoryObj } from "@storybook/react";
import { Week } from "./week";

const meta = {
	title: "Components/Calendar/Week",
	component: Week,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Week>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Week",
	args: { businessId: "barber-bros", employees },
	parameters: {
		moduleMock: {
			mock: () => [getBookingsMock],
		},
	},
};
