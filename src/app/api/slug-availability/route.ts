import { db } from "#/lib/db";
import { z } from "zod";

const schema = z.object({
	slug: z.string(),
});

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);

	const { slug } = schema.parse({ day: searchParams.get("slug") });

	const business = await db.query.businesses.findFirst({
		columns: { slug: true },
		where: (T, { eq }) => eq(T.slug, slug),
	});

	return Response.json({ available: !business });
};
