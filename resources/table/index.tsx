import React, { useState } from "react";
import InternalTable from "./table";
import Pagination from "./pagination";

interface Props {
  columns: ColumnConfig<TableDataModel>[]
  data: TableDataModel
  isPagination?: boolean
}

const Table: React.FC<Props> = ({ columns, data, isPagination = false,  }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const paginatedData = !isPagination ? data : data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto">
      <InternalTable data={paginatedData} columns={columns} />
      {isPagination && <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
      />}
    </div>
  );
};

export default Table;
