import { employees } from "#/app/book/[businessId]/mock";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import {
	CalendarConfiguration,
	type CalendarState,
} from "./calendar-configuration";

const meta = {
	title: "Components/Calendar/Calendar configuration",
	parameters: {
		layout: "centered",
	},
	render: function Story() {
		const [state, setState] = useState<CalendarState>({
			period: "day",
			showWeekends: false,
			showDeclinedEvents: false,
			showWeekNumbers: false,
		});

		return <CalendarConfiguration state={state} setState={fn(setState)} />;
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Calendar configuration",
	args: { employees },
};
