import React, { useState } from "react";
import Spinner from "./spinner";
import Image from "next/image";
import styled from "styled-components";

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
    <Container>
      {isLoading && (
        <SpinnerOverlay>
          <Spinner />
        </SpinnerOverlay>
      )}
      <StyledTable>
        <thead>
          <TableHeader>
            {columns.map((column, index) => (
              <TableHeaderCell
                key={index}
                onClick={() => handleSort(column)}
                sortable={!!column.sorter}
              >
                {column.title}
                {column.sorter && column.dataIndex && (
                  <SortIndicator
                    active={sortConfig?.key === column.dataIndex}
                    direction={sortConfig?.direction}
                  >
                    {sortConfig?.key === column.dataIndex
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : "▼"}
                  </SortIndicator>
                )}
              </TableHeaderCell>
            ))}
          </TableHeader>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.render
                    ? column.render(item)
                    : column.dataIndex &&
                        typeof item[column.dataIndex] !== "object"
                      ? (item[column.dataIndex] as React.ReactNode)
                      : column.dataIndex
                        ? JSON.stringify(item[column.dataIndex])
                        : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!data.length && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <EmptyState>
                  <Image src="/empty.png" alt="empty" width={60} height={30} />
                </EmptyState>
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </StyledTable>
    </Container>
  );
};

export default Table;

// Styled Components
const Container = styled.div`
  position: relative;
  overflow-x: auto;
`;

const SpinnerOverlay = styled.div`
  inset: 0;
  background-color: white;
  background-opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

const StyledTable = styled.table`
  width: 100%;
  background-color: white;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1vh;
`;

const TableHeader = styled.tr`
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
`;

const TableHeaderCell = styled.th<{ sortable: boolean }>`
  padding: 2.5vh 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  cursor: ${(props) => (props.sortable ? "pointer" : "default")};
`;

const SortIndicator = styled.span<{ active?: boolean; direction?: Direction }>`
  margin-left: 8px;
  color: ${(props) => (props.active ? "blue" : "inherit")};
  font-size: 12px;
`;

const TableRow = styled.tr`
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
`;

const TableCell = styled.td`
  padding: 2.5vh 16px;
  color: #333;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
`;

const EmptyState = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2.5vh 16px;
`;
