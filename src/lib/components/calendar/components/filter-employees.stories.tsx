import { employees } from "#/app/book/[businessId]/mock";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react";
import { FilterEmployees } from "./filter-employees";

type Props = Pick<ComponentProps<typeof FilterEmployees>, "employees">;

const meta = {
	title: "Components/Calendar/Filter employees",
	parameters: {
		layout: "centered",
	},
	render: function Story(args: Props) {
		const [employeeIds, setEmployeeIds] = useState<number[]>(
			employees.map(({ id }) => id),
		);

		return (
			<FilterEmployees
				{...args}
				employeeIds={employeeIds}
				setEmployeeIds={setEmployeeIds}
			/>
		);
	},
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Filter employees",
	args: { employees },
};
