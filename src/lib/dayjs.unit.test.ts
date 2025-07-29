import { describe, expect, it } from "vitest";
import { dayjs } from "./dayjs";

describe("dayjs", () => {
	it("should be comparable over different timezones", () => {
		const timeUtc = dayjs("2024-11-28T13:00:00Z");
		const timePlusOne = dayjs("2024-11-28T14:00:00+01:00");

		expect(timeUtc.isSame(timePlusOne));
	});

	it("should convert to another timezone", () => {
		const timeUtc = dayjs("2024-11-28T13:00:00Z");
		const timePlusOne = dayjs("2024-11-28T14:00:00+01:00");
		const converted = timeUtc.tz("Europe/Stockholm");

		expect(converted.isSame(timePlusOne));
	});

	it("should return start of day according to timezone", () => {
		const time = dayjs("2024-11-28T13:00:00Z").tz("Europe/Stockholm");
		const startOfDay = time.startOf("day");
		const expected = dayjs("2024-11-27T23:00:00Z");

		expect(startOfDay.isSame(expected)).toBeTruthy();
	});

	it("should parse tz date to utc", () => {
		const timePlusOne = dayjs("2024-11-28T14:00:00+01:00");
		const timeUtc = timePlusOne.utc();

		expect(timeUtc.isSame(timePlusOne));
	});

	it("should change timezones", () => {
		const time = dayjs.tz("2024-11-28T13:00:00Z", "America/Los_Angeles");

		expect(time.utcOffset()).toBe(-8 * 60);
	});
});
