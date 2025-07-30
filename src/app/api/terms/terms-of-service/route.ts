import { db } from "@/lib/db";

export const GET = async () => {
	const row = await db.query.systemSettings.findFirst({
		columns: {
			value: true,
		},
		where: (T, { eq }) => eq(T.key, "terms-of-services"),
	});

	if (!row) {
		return Response.json(null, { status: 404 });
	}

	return Response.json(row);
};
