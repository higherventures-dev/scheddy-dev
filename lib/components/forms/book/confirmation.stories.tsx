import { categories, services } from "#/app/book/[businessId]/mock";
import * as actions from "#/lib/actions/create-booking";
import { dayjs } from "#/lib/dayjs";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/test";
import { createMock } from "storybook-addon-module-mock";
import { Confirmation } from "./confirmation";

const meta = {
	title: "Forms/Book/Confirmation",
	component: Confirmation,
	argTypes: {
		categories: { table: { disable: true } },
		businessId: { table: { disable: true } },
		serviceId: {
			name: "Service",
			options: services.map(({ name }) => name),
			mapping: Object.fromEntries(services.map(({ id, name }) => [name, id])),
		},
	},
	args: {
		businessId: "barber-bros",
		categories,
		serviceId: 1,
		time: dayjs("2024-11-28T13:00:00Z"),
	},
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
} satisfies Meta<typeof Confirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Confirmation",
	play: async ({ canvas }) => {
		const givenNameInput = canvas.getByLabelText("First name", {
			selector: "input",
		});
		await userEvent.type(givenNameInput, "James", { delay: 100 });

		const familyNameInput = canvas.getByLabelText("Last name", {
			selector: "input",
		});
		await userEvent.type(familyNameInput, "Smith", { delay: 100 });

		const phoneInput = canvas.getByLabelText("Phone number", {
			selector: "input",
		});
		await userEvent.type(phoneInput, "561-555-7689", { delay: 100 });

		const emailInput = canvas.getByLabelText("Email", {
			selector: "input",
		});
		await userEvent.type(emailInput, "quiet.lobster8132@maildrop.cc", {
			delay: 100,
		});

		const cancellationPolicySwitch = canvas.getByRole("switch", {
			checked: false,
		});
		await userEvent.click(cancellationPolicySwitch);

		const commentInput = canvas.getByLabelText("Comments", {
			selector: "textarea",
		});
		await userEvent.type(
			commentInput,
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel feugiat nulla, vitae vestibulum lacus. Donec ac cursus orci, ac ornare augue.",
			{ delay: 10 },
		);

		const bookNowButton = canvas.getByText("Book now", {
			selector: "button",
		});
		await userEvent.click(bookNowButton);
	},
	parameters: {
		moduleMock: {
			mock: () => {
				const mock = createMock(actions, "createBooking");
				mock.mockResolvedValue({ id: 1 });
				return [mock];
			},
		},
	},
};
