import type { Meta, StoryObj } from "@storybook/react";
import { useSessionStorage } from "react-use";
import { DonateTooltip } from ".";

const meta = {
	title: "Components/Donate tooltip",
	render: function Story() {
		const [hidden, setHidden] = useSessionStorage(
			"hide-donation-tooltip",
			false,
		);

		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<button
					className="rounded-lg bg-white p-3 text-sm font-semibold text-[#1c1c1c]"
					onClick={() => setHidden(false)}
				>
					Reset
				</button>

				<DonateTooltip show={!hidden} onDismiss={() => setHidden(true)} />
			</div>
		);
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { name: "Donate tooltip" };
