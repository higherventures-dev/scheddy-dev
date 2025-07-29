import type { Decorator } from "@storybook/react";
import { PureLayout } from "./pure-layout";

export const withLayout: Decorator = (Story) => (
	<PureLayout
		business={{
			logo: "https://placehold.co/20x20.png",
			displayName: "Barber Bros",
			slug: "barber-bros",
			uuid: "1d9e35b3-dff2-4702-bc9a-9397cf7d851b",
			address: null,
			email: null,
			phone: null,
		}}
	>
		<Story />
	</PureLayout>
);
