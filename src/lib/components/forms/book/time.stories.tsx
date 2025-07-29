import { dayjs } from "#/lib/dayjs";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { range } from "lodash-es";
import { http } from "msw";
import { SelectTime } from "./time";

const meta = {
	title: "Forms/Book/Select time",
	component: SelectTime,
	args: {
		businessId: "1",
		serviceId: 1,
		onSelectAction: fn(),
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
		msw: {
			handlers: [
				http.get("/api/availability", () =>
					Response.json([
						...range(9 * 60, 12 * 60, 30).map((time) => ({
							employeeId: 1,
							time: dayjs().startOf("day").add(time, "minutes").toISOString(),
						})),
						...range(14 * 60, 17 * 60, 30).map((time) => ({
							employeeId: 1,
							time: dayjs().startOf("day").add(time, "minutes").toISOString(),
						})),
						...range(19 * 60, 21 * 60, 30).map((time) => ({
							employeeId: 1,
							time: dayjs().startOf("day").add(time, "minutes").toISOString(),
						})),
					]),
				),
			],
		},
	},
} satisfies Meta<typeof SelectTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Select time",
};
