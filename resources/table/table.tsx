import React, { useState } from "react";
import Spinner from "./spinner";
import Image from "next/image";

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
    <div className="relative overflow-x-auto">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-white">
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
                    {sortConfig?.key === column.dataIndex
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : "▼"}
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
          {!data.length && (
            <tr className="border-t-2 border-gray-100">
              <td colSpan={columns.length} className="px-8 py-6 w-full">
                <div className="w-full flex justify-center">
                  <Image src="/empty.png" alt="empty" width={60} height={30} />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
