"use client";

import { Week } from "@/lib/components/calendar/week";
import { useState } from "react";

export const Calendar = ({
	businessId,
	employees,
}: {
	businessId: string;
	employees: {
		familyName: string | null;
		givenName: string | null;
		id: number;
		role: string;
		avatar: string | null;
	}[];
}) => {
	const [calendarStyle /*, setCalendarStyle */] = useState<
		"week" | "day" | "month"
	>("week");

	if (calendarStyle === "week") {
		return <Week businessId={businessId} employees={employees} />;
	}

	if (calendarStyle === "day") {
		return <div>Day</div>;
	}

	return <div>Month</div>;
};
