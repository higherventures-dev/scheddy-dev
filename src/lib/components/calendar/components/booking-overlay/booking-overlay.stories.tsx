import { employees } from "#/app/book/[businessId]/mock";
import * as actions from "#/lib/actions/get-booking";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { createMock } from "storybook-addon-module-mock";
import { BookingOverlay } from ".";

const meta = {
	title: "Components/Calendar/Show booking",
	parameters: {
		layout: "fullscreen",
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

				<BookingOverlay
					bookingId={1}
					open={open}
					onClose={() => setOpen(false)}
				/>
			</div>
		);
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Show booking",
	args: { employees },
	parameters: {
		moduleMock: {
			mock: () => {
				const mock = createMock(actions, "getBooking");
				mock.mockResolvedValue({
					booking: {
						createdAt: "2024-10-28T23:27:00Z",
						createdBy: "David S.",
					},
					customer: {
						email: "andrew.higgins23@gmail.com",
						familyName: "Smith",
						givenName: "David",
						notes:
							"Davis has a sensitive skin. Apply necessary skincare products before starting a session",
						phone: "909-254-7063",
					},
					employee: {
						givenName: "Michael",
						familyName: "Johnson",
						avatar: "https://placehold.co/40x40.png",
						role: "Senior Tattoo Artist",
					},
					event: {
						id: 1,
						summary: "Continuing session",
						start: "2024-10-30T18:00:00Z",
						end: "2024-10-30T20:00:00Z",
						status: "pending",
					},
					payment: {
						owed: 120,
						price: 120,
					},
				});
				return [mock];
			},
		},
	},
};
