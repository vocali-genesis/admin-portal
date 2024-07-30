import React, { useState } from "react";

interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
}

type Direction = "asc" | "desc";

const Table = <T,>({ data, columns }: TableProps<T>) => {
  const [sortedData, setSortedData] = useState(data);
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

    const sorted = [...data].sort((a, b) => {
      if (a[column.dataIndex!] < b[column.dataIndex!])
        return direction === "asc" ? -1 : 1;
      if (a[column.dataIndex!] > b[column.dataIndex!])
        return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key: column.dataIndex, direction });
    setSortedData(sorted);
  };

  return (
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
              {column.sorter && (
                <span
                  className={`ml-2 ${
                    sortConfig?.key === column.dataIndex ? "text-blue-500" : ""
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
        {sortedData.map((item, rowIndex) => (
          <tr key={rowIndex} className="border-t-2 border-gray-100">
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
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
  );
};

export default Table;
