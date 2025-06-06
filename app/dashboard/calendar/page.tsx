import { getBusinessEmployees } from "/lib/actions/get-business-employees";
import { Calendar } from "./calendar";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const employees = await getBusinessEmployees(id);

	return <Calendar businessId={id} employees={employees} />;
}
