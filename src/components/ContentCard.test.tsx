import { render, screen } from "@testing-library/react";
import ContentCard, { Project } from "./ContentCard";

const linkedProject: Project = {
	title: "Test Project",
	url: "https://example.com",
	company: "Test Co",
	stack: ["React", "TypeScript"],
	description: "A test project description.",
};

const unlinkedProject: Project = {
	...linkedProject,
	title: "No Link Project",
	url: null,
};

test("renders project details", () => {
	render(<ContentCard project={linkedProject} />);
	expect(screen.getByText("Test Project")).toBeInTheDocument();
	expect(screen.getByText("Test Co")).toBeInTheDocument();
	expect(screen.getByText("A test project description.")).toBeInTheDocument();
	expect(screen.getByText("React")).toBeInTheDocument();
	expect(screen.getByText("TypeScript")).toBeInTheDocument();
});

test("wraps the title in a link when a url is provided", () => {
	render(<ContentCard project={linkedProject} />);
	const link = screen.getByRole("link", { name: "Test Project" });
	expect(link).toHaveAttribute("href", "https://example.com");
});

test("does not render a link when url is null", () => {
	render(<ContentCard project={unlinkedProject} />);
	expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
