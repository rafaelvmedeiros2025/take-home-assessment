import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Items from "./Items";
import { DataProvider } from "../state/DataContext";
import { MemoryRouter, Route, Routes, BrowserRouter } from "react-router-dom";

beforeEach(() => {
  fetch.resetMocks();
});

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <DataProvider>{ui}</DataProvider>
    </BrowserRouter>
  );
}

test("shows loading skeleton while fetching", () => {
  // Mock a fetch that never resolves so loading state remains
  fetch.mockImplementationOnce(() => new Promise(() => {}));

  render(
    <DataProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Items />} />
        </Routes>
      </MemoryRouter>
    </DataProvider>
  );

  // Now useData() is defined, context is provided, and skeletons render
  const skeletons = screen.getAllByLabelText(/loading item/i);
  expect(skeletons.length).toBeGreaterThan(0);
});

test("renders list of items after fetch", async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      data: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
      total: 2,
    })
  );

  renderWithProviders(<Items />);

  // Wait for items to appear
  const item1 = await screen.findByText("Item 1");
  const item2 = screen.getByText("Item 2");

  expect(item1).toBeInTheDocument();
  expect(item2).toBeInTheDocument();
});

test("displays no items message if no results", async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: [], total: 0 }));

  renderWithProviders(<Items />);

  const noItems = await screen.findByRole("alert");
  expect(noItems).toHaveTextContent(/no items found/i);
});

test("updates query and fetches on search input change", async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      data: [{ id: 1, name: "Apple" }],
      total: 1,
    })
  );

  renderWithProviders(<Items />);

  // Wait for initial load
  await screen.findByText("Apple");

  // Mock next fetch for search "Banana"
  fetch.mockResponseOnce(
    JSON.stringify({
      data: [{ id: 2, name: "Banana" }],
      total: 1,
    })
  );

  fireEvent.change(screen.getByLabelText(/search items/i), {
    target: { value: "Banana" },
  });

  // Wait for Banana to appear
  const bananaItem = await screen.findByText("Banana");
  expect(bananaItem).toBeInTheDocument();
});

test("pagination buttons work correctly", async () => {
  fetch.mockResponse(
    JSON.stringify({
      data: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      })),
      total: 200,
    })
  );

  renderWithProviders(<Items />);

  // Wait for first page to load
  await screen.findByText("Item 1");

  // Next page button enabled
  const nextButton = screen.getByRole("button", { name: /next page/i });
  expect(nextButton).not.toBeDisabled();

  // Click next page
  fetch.mockResponseOnce(
    JSON.stringify({
      data: Array.from({ length: 100 }, (_, i) => ({
        id: i + 101,
        name: `Item ${i + 101}`,
      })),
      total: 200,
    })
  );

  fireEvent.click(nextButton);

  // Wait for new page to load
  const item101 = await screen.findByText("Item 101");
  expect(item101).toBeInTheDocument();
});
