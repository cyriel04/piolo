import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders without crashing", () => {
	render(<App />);
	expect(screen.getByText(/Piolo Valledor Portfolio/i)).toBeInTheDocument();
});
