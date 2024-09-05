import React from "react";
import InternalTable from "./table";
import Pagination from "./pagination";
import { PaginationProps } from "./pagination";

interface Props<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  pagination?: PaginationProps;
  onSort?: (key: string, column: string) => void;
  isLoading?: boolean;
}

function Table<T extends Record<string, unknown> = Record<string, unknown>>(
  props: Props<T>
) {
  const { pagination, columns, data, onSort, isLoading } = props;
  return (
    <div className="container mx-auto">
      <InternalTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        onSort={(key, column) => {
          onSort && onSort(key, column);
        }}
      />
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}

export default Table;
