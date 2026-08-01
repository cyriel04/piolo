import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "./Navigation";

const renderNav = () =>
	render(
		<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<Navigation />
		</MemoryRouter>
	);

test("renders the PV logo and all nav links", () => {
	renderNav();
	expect(screen.getByText("PV")).toBeInTheDocument();
	[
		"experience",
		"projects",
		"skills",
		"education",
		"certifications",
		"contact",
	].forEach((label) => {
		expect(screen.getAllByText(label).length).toBeGreaterThan(0);
	});
});

test("the contact link uses react-router navigation", () => {
	renderNav();
	const contactLinks = screen.getAllByText("contact");
	expect(contactLinks[0].closest("a")).toHaveAttribute("href", "/contact");
});

test("opens the mobile drawer when the menu button is clicked", () => {
	renderNav();
	fireEvent.click(screen.getByLabelText("Open menu"));
	expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
});
