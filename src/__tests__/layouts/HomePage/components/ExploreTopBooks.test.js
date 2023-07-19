import { render, screen } from "@testing-library/react";
import { ExploreTopBooks } from "../../../../layouts/HomePage/components/ExploreTopBooks";

describe("ExploreTopBooks component", () => {
  test("renders ExploreTopBooks component properly", () => {
    render(<ExploreTopBooks />);
    const heading = screen.getByRole("heading");
    const button = screen.getByRole("link", { name: /explore top books/i });
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
