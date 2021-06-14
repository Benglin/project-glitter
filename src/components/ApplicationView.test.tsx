import { render, screen } from "@testing-library/react";
import ApplicationView from "./ApplicationView";

test("renders learn react link", () => {
    render(<ApplicationView />);
    const linkElement = screen.getByText(/Hello world/i);
    expect(linkElement).toBeInTheDocument();
});
