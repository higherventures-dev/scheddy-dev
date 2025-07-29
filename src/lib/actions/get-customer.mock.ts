import * as actions from "#/lib/actions/get-customer";
import { faker as f } from "@faker-js/faker";
import { sample, times } from "lodash-es";
import { createMock } from "storybook-addon-module-mock";
import { dayjs } from "#/lib/dayjs";

const firstName = f.person.firstName();
const lastName = f.person.lastName();
const email = f.internet.email({ firstName, lastName }).toLowerCase();
const phone = f.phone.number({ style: "national" });

const employeeProfiles = times(3, () => ({
	givenName: f.person.firstName(),
	familyName: f.person.lastName(),
}));

export const getCustomerMock = () =>
	createMock(actions, "getCustomer").mockResolvedValue({
		bookings: times(64, (id) => {
			const startTime = f.date.past();

			return {
				id,
				startTime: startTime.toISOString(),
				endTime: dayjs(startTime)
					.add(Math.ceil(Math.random() * 180), "minutes")
					.toISOString(),
				price: f.commerce.price({ min: 13.5, max: 49.5 }),
				cancelledAt:
					Math.random() < 0.05 ? f.date.recent().toISOString() : null,
				employee: {
					profile: sample(employeeProfiles)!,
				},
			};
		}),
		profile: {
			givenName: firstName,
			familyName: Math.random() > 0.2 ? lastName : null,
			email: Math.random() > 0.2 ? email : null,
			phone: Math.random() > 0.2 ? phone : null,
		},
	});
