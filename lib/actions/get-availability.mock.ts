import * as actions from "#/lib/actions/get-availability";
import { dayjs } from "#/lib/dayjs";
import { range } from "lodash-es";
import { createMock } from "storybook-addon-module-mock";

const data = [
	...range(9 * 60, 12 * 60, 30).map((time) => ({
		employeeId: 1,
		time: dayjs().startOf("day").add(time, "minutes"),
	})),
	...range(14 * 60, 17 * 60, 30).map((time) => ({
		employeeId: 1,
		time: dayjs().startOf("day").add(time, "minutes"),
	})),
	...range(19 * 60, 21 * 60, 30).map((time) => ({
		employeeId: 1,
		time: dayjs().startOf("day").add(time, "minutes"),
	})),
];

export const getAvailabilityMock = () =>
	createMock(actions, "getAvailability").mockResolvedValue(data);
