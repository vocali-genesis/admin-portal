import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Table from "./table";

// Mock the data and column configs
const mockData = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

const mockColumns: ColumnConfig<(typeof mockData)[0]>[] = [
  { title: "ID", dataIndex: "id", sorter: true },
  { title: "Name", dataIndex: "name", sorter: true },
  { title: "Email", dataIndex: "email", sorter: true },
];

describe("Table component", () => {
  it("should render the table with the provided data", async () => {
    render(<Table data={mockData} columns={mockColumns} />);

    // Wait for the table rows to be rendered
    await waitFor(() => {
      mockData.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        expect(screen.getByText(item.email)).toBeInTheDocument();
      });
    });
  });

  test("should render the empty state when data is empty", () => {
    render(<Table data={[]} columns={mockColumns} />);
    expect(screen.getByTestId("table.no-data")).toBeInTheDocument();
  });

  test("should sort the table when a sortable column header is clicked", async () => {
    const onSort = jest.fn();
    render(<Table data={mockData} columns={mockColumns} onSort={onSort} />);

    await waitFor(() => {
      mockData.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        expect(screen.getByText(item.email)).toBeInTheDocument();
      });
    });

    // Simulate a click on a sortable column header
    const nameHeader = await screen.findByText(mockColumns[1].title);
    act(() => nameHeader.click());

    // Assert that the onSort callback was called with the correct arguments
    expect(onSort).toHaveBeenCalledWith("name", "asc");
  });
});
