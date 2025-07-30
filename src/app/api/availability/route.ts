import { getAvailability } from "@/lib/actions/get-availability";
import { dayjs } from "@/lib/dayjs";
import { z } from "zod";

const schema = z.object({
	businessId: z.string(),
	serviceId: z.number(),
	employeeId: z.number().optional(),
	day: z
		.string()
		.date()
		.transform((arg) => dayjs(arg)),
});

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);

	const { businessId, employeeId, serviceId, day } = schema.parse({
		businessId: searchParams.get("businessId"),
		employeeId: searchParams.get("employeeId"),
		serviceId: searchParams.get("serviceId"),
		day: searchParams.get("day"),
	});

	const availability = await getAvailability({
		businessId,
		employeeId,
		serviceId,
		day,
	});

	return Response.json(
		availability.map(({ time, ...availability }) => ({
			...availability,
			time: time.toISOString(),
		})),
	);
};
