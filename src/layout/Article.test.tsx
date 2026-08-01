import { render, screen } from "@testing-library/react";
import Article from "./Article";
import { PROJECTS } from "../constants";

test("renders a ContentCard for every project", () => {
	render(<Article />);
	PROJECTS.forEach((project) => {
		expect(screen.getByText(project.title)).toBeInTheDocument();
	});
});
