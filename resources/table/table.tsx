import React, { useState } from "react";
import Spinner from "./spinner";

interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onSort?: (key: string, column: string) => void;
  isLoading?: boolean;
}

type Direction = "asc" | "desc";

const Table = <T,>({ data, columns, onSort, isLoading }: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: Direction;
  } | null>(null);

  const handleSort = (column: ColumnConfig<T>) => {
    if (!column.sorter || !column.dataIndex) return;

    let direction: Direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === column.dataIndex &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key: column.dataIndex, direction });
    onSort && onSort(column.dataIndex as string, direction);
  };

  return (
    <div className="relative">
      {isLoading && <div className="absolute inset-0 bg-teal-50 bg-opacity-60 flex items-center justify-center">
        <Spinner />
      </div>}
      <table className="min-w-full bg-white border border-gray-100">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                onClick={() => handleSort(column)}
                className={`px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sorter ? "cursor-pointer" : ""
                }`}
              >
                {column.title}
                {column.sorter && column.dataIndex && (
                  <span
                    className={`ml-2 ${
                      sortConfig?.key === column.dataIndex
                        ? "text-blue-500"
                        : ""
                    }`}
                  >
                    {sortConfig?.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="border-t-2 border-gray-100">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700"
                >
                  {column.render
                    ? column.render(item)
                    : (item[column.dataIndex!] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
