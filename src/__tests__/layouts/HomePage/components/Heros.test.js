import { screen, render } from "@testing-library/react";
import { Heros } from "../../../../layouts/HomePage/components/Heros";

describe("Heros component", () => {
  test("render Heros properly", () => {
    render(<Heros />);
    const buttons = screen.getAllByRole("link", { name: /sign up/i });
    expect(buttons).toBeInTheDocument;
    // TODO navigation test
  });
});
