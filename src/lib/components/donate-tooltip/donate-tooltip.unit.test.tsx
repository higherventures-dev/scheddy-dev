import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DonateTooltip } from ".";

describe("<DonateTooltip />", () => {
	it("should call `onDismiss` when dismiss button is clicked", () => {
		const onDismiss = vi.fn();
		render(<DonateTooltip show onDismiss={onDismiss} />);

		fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

		expect(onDismiss).toHaveBeenCalledOnce();
	});
});
