import { getBusinessServices } from "@/lib/actions/get-business-services";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
	businessId: z.string(),
});

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const { businessId } = schema.parse({
		businessId: searchParams.get("businessId"),
	});

	const business = await db.query.businesses.findFirst({
		columns: {
			id: true,
			timezone: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
	});

	if (!business) {
		throw new Error("ERR_GET_SERVICES_BUSINESS_NOT_FOUND");
	}

	const services = await getBusinessServices(businessId);
	return Response.json(services);
};
