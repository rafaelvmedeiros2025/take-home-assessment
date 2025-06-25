import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ItemDetail from "./ItemDetail";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch.mockClear();
});

test("shows loading state initially", () => {
  // leave fetch pending so loading stays visible
  fetch.mockImplementationOnce(() => new Promise(() => {}));

  render(
    <MemoryRouter initialEntries={["/items/1"]}>
      <Routes>
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/loading item details/i)).toBeInTheDocument();
});

test("displays item details on successful fetch", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ name: "Item 1", category: "Cat A", price: 100 }),
  });

  render(
    <MemoryRouter initialEntries={["/items/1"]}>
      <Routes>
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for the heading
  await waitFor(() =>
    expect(screen.getByRole("heading", { name: /item 1/i })).toBeInTheDocument()
  );

  // Function matcher for the Category <p> tag
  const categoryParagraph = screen.getByText((content, element) => {
    return (
      element.tagName.toLowerCase() === "p" &&
      element.textContent.includes("Category:") &&
      element.textContent.includes("Cat A")
    );
  });
  expect(categoryParagraph).toBeInTheDocument();

  // Function matcher for the Price <p> tag
  const priceParagraph = screen.getByText((content, element) => {
    return (
      element.tagName.toLowerCase() === "p" &&
      element.textContent.includes("Price:") &&
      element.textContent.includes("$100.00")
    );
  });
  expect(priceParagraph).toBeInTheDocument();
});

test("shows error and back button if fetch fails", async () => {
  fetch.mockResolvedValueOnce({ ok: false });

  render(
    <MemoryRouter initialEntries={["/items/999"]}>
      <Routes>
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(/item not found/i);
  });

  fireEvent.click(screen.getByRole("button", { name: /back to items list/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/");
});
