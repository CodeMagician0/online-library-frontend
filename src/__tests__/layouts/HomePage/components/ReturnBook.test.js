import { render, screen } from "@testing-library/react";
import { ReturnBook } from "../../../../layouts/HomePage/components/ReturnBook";
import mockBooks from "../../../../mocks/mockBooks";

describe("ReturnBook component", () => {
  test("renders book information properly", () => {
    const book = mockBooks(1)[0];
    render(<ReturnBook book={book} />);
    const image = screen.getByAltText("book");
    const reserve = screen.getByRole("link", { name: /reserve/i });
    const title = screen.getByText(book.title);
    const author = screen.getByText(book.author);

    expect(title.textContent).toEqual(book.title);
    expect(author.textContent).toEqual(book.author);
    expect(reserve).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });
});

// TODO navigation test
