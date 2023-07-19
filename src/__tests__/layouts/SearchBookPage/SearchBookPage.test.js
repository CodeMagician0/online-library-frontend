import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBookPage } from "../../../layouts/SearchBookPage/SearchBookPage";

describe("SearchBookPage component", () => {
  test("search input display properly", async () => {
    render(<SearchBookPage />);
    waitFor(() => {
      const input = screen.getByLabelText(/search/i);
      userEvent.type(input, "become a guru");
      expect(input.textContent).toEqual("become a guru");
    });
  });
});

describe("Pagination component", () => {
  test("pagination function properly", async () => {
    render(<SearchBookPage />);
    waitFor(() => {
      // the mock data return book list within 5 pages
      screen.getByRole("");
      const nav = screen.getByLabelText("...");
      expect(nav).toBeInTheDocument();
      const firstPage = screen.getByRole("listitem", { name: 1 });
      expect(firstPage).toHaveClass("active");

      const goTolastPageBtn = screen.getByRole("button", {
        name: /last page/i,
      });
      userEvent.click(goTolastPageBtn);

      const lastPage = screen.getByRole("listitem", { name: 5 });
      expect(firstPage).not.toHaveClass("active");
      expect(lastPage).toHaveClass("active");

      const goTofirstPageBtn = screen.getByRole("button", {
        name: /first page/i,
      });
      userEvent.click(goTofirstPageBtn);
      expect(lastPage).not.toHaveClass("active");
      expect(firstPage).toHaveClass("active");

      // when in third page, there will be two buttons before and behind the current button
      const thirdPage = screen.getByRole("listitem", { name: 3 });
      userEvent.click(thirdPage);
      expect(firstPage).not.toHaveClass("active");
      expect(thirdPage).toHaveClass("active");
      expect(screen.getAllByRole("listitem").length).toEqual(5);
    });
  });
});
