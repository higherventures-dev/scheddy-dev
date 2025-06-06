import { faker as f } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IntakeForm } from ".";

const logo = f.image.url();
const businessName = f.company.name();
const title = f.lorem.sentence();

describe("<IntakeForm />", () => {
	it("should render text inputs for name fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[{ type: "name", id: "name" }]}
				onSubmit={onSubmit}
			/>,
		);

		const givenName = f.person.firstName();
		const givenNameInput = screen.getByRole("textbox", { name: "First name" });
		await userEvent.type(givenNameInput, givenName, { delay: 20 });

		const familyName = f.person.lastName();
		const familyNameInput = screen.getByRole("textbox", { name: "Last name" });
		await userEvent.type(familyNameInput, familyName, { delay: 20 });

		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({ name: { givenName, familyName } });
	});

	it("should render an email input for email fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[{ type: "email", id: "email", title: "Email" }]}
				onSubmit={onSubmit}
			/>,
		);

		const textbox = screen.getByRole("textbox", { name: "Email" });
		expect(textbox).toHaveProperty("type", "email");

		const email = f.internet.email();
		await userEvent.type(textbox, email, { delay: 20 });
		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({ email });
	});

	it("should render phone input for phone fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[{ type: "phone", id: "phone", title: "Phone" }]}
				onSubmit={onSubmit}
			/>,
		);

		const textbox = screen.getByRole("textbox", { name: "Phone" });
		expect(textbox).toHaveProperty("type", "tel");

		const phone = f.phone.number();
		await userEvent.type(textbox, phone, { delay: 20 });
		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({ phone });
	});

	it("should render a text input for short text fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[{ type: "short-text", id: "name", title: "Name" }]}
				onSubmit={onSubmit}
			/>,
		);

		const name = f.person.fullName();
		const textbox = screen.getByRole("textbox", { name: "Name" });
		await userEvent.type(textbox, name, { delay: 20 });
		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({ name });
	});

	it("should render a text area for long text fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[
					{ type: "long-text", id: "description", title: "Description" },
				]}
				onSubmit={onSubmit}
			/>,
		);

		const description = f.lorem.paragraph();
		const textarea = screen.getByRole("textbox", { name: "Description" });
		await userEvent.type(textarea, description, { delay: 20 });
		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({ description });
	});

	it("should render a switch for toggle fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[{ type: "toggle", id: "bool", title: "Bool" }]}
				onSubmit={onSubmit}
			/>,
		);

		const switch_ = screen.getByRole("switch", { name: "Bool" });
		await userEvent.click(switch_, { delay: 7 });
		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({ bool: true });
	});

	it("should render a multi select for multiple choice fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[
					{
						type: "multiple-choice",
						id: "choices",
						title: "Choices",
						options: ["Option 1", "Option 2", "Option 3", "Option 4"],
					},
				]}
				onSubmit={onSubmit}
			/>,
		);

		const select = screen.getByLabelText("Choices");
		await userEvent.click(select);

		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(4);

		await userEvent.selectOptions(
			screen.getByRole("listbox"),
			options.slice(1, 3),
		);

		// close the select
		await userEvent.click(select);

		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({
			choices: ["Option 2", "Option 3"],
		});
	});

	it("should render a heading for section title fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[
					{ type: "section-title", id: "section-title", text: "Section title" },
				]}
				onSubmit={onSubmit}
			/>,
		);

		const heading = screen.getByRole("heading", { name: "Section title" });
		expect(heading).toBeInTheDocument();
	});

	it("should render a paragraph for section body fields", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[
					{ type: "section-body", id: "section-body", text: "Section body" },
				]}
				onSubmit={onSubmit}
			/>,
		);

		const paragraph = screen.getByText("Section body");
		expect(paragraph).toBeInTheDocument();
	});

	it("should submit the form when the button is clicked", async () => {
		const onSubmit = vi.fn();
		render(
			<IntakeForm
				logo={logo}
				businessName={businessName}
				title={title}
				fields={[
					{ id: "name", type: "name" },
					{
						id: "email",
						type: "email",
						title: "Email",
						placeholder: "Enter email address",
					},
					{
						id: "phone",
						type: "phone",
						title: "Phone",
						placeholder: "Enter phone number",
					},
				]}
				onSubmit={onSubmit}
			/>,
		);

		const firstNameInput = screen.getByLabelText("First name");
		expect(firstNameInput).toHaveAttribute("placeholder", "Enter first name");
		await userEvent.type(firstNameInput, "James", { delay: 20 });

		const lastNameInput = screen.getByLabelText("Last name");
		expect(lastNameInput).toHaveAttribute("placeholder", "Enter last name");
		await userEvent.type(lastNameInput, "Smith", { delay: 20 });

		const emailInput = screen.getByLabelText("Email");
		expect(emailInput).toHaveAttribute("placeholder", "Enter email address");
		expect(emailInput).toHaveAttribute("type", "email");
		await userEvent.type(emailInput, "quiet.lobster8132@maildrop.cc", {
			delay: 20,
		});

		const phoneInput = screen.getByLabelText("Phone");
		expect(phoneInput).toHaveAttribute("placeholder", "Enter phone number");
		expect(phoneInput).toHaveAttribute("type", "tel");
		await userEvent.type(phoneInput, "123-456-7890", { delay: 20 });

		await userEvent.click(screen.getByRole("button", { name: "Submit" }));

		expect(onSubmit).toHaveBeenCalledWith({
			name: { familyName: "Smith", givenName: "James" },
			email: "quiet.lobster8132@maildrop.cc",
			phone: "123-456-7890",
		});
	});
});
