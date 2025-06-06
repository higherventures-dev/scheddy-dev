import { getBusinessCustomers } from "#/lib/actions/get-business-customers";
import { Customers } from "./customers";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const customers = await getBusinessCustomers(id);

	return <Customers initialCustomers={customers} />;
}
