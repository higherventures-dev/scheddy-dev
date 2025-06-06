import { faker as f } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { times } from "lodash-es";
import { http } from "msw";
import { withLayout } from "../layout.storybook";
import { Customers } from "./customers";

const initialCustomers = times(30, () => {
	const firstName = f.person.firstName();
	const lastName = f.person.lastName();
	const email = f.internet.email({ firstName, lastName }).toLowerCase();
	const phone = f.phone.number({ style: "national" });

	return {
		id: f.string.uuid(),
		givenName: firstName,
		familyName: Math.random() > 0.2 ? lastName : null,
		email: Math.random() > 0.2 ? email : null,
		phone: Math.random() > 0.2 ? phone : null,
	};
});

const meta = {
	title: "Pages/Dashboard/Clients",
	component: Customers,
	decorators: [withLayout],
	parameters: {
		layout: "fullscreen",
		msw: {
			handlers: [
				http.get("/api/clients", () => Response.json(initialCustomers)),
			],
		},
		nextjs: {
			appDirectory: true,
			navigation: {
				segments: ["clients"],
			},
		},
	},
} satisfies Meta<typeof Customers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Clients",
	args: { initialCustomers },
};
