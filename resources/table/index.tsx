import React from "react";
import InternalTable from "./table";
import Pagination from "./pagination";
import { PaginationProps } from "./pagination";
import { useTranslation } from "react-i18next";

interface Props {
  columns: ColumnConfig<TableDataModel>[]
  data: TableDataModel[]
  pagination?: PaginationProps
  onSort?: (key: string, column: string) => void
  isLoading?: boolean
}

const Table: React.FC<Props> = (props) => {
  const { pagination, columns, data, onSort, isLoading } = props
  return (
    <div className="container mx-auto">
      <InternalTable data={data} columns={columns} isLoading={isLoading} onSort={(key, column) => {
        onSort && onSort(key, column)
      }} />
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};

export default Table;
