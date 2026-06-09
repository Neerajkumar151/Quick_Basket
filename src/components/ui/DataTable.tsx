import React, { useState } from 'react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingSkeletons';
import { PackageOpen } from 'lucide-react';
import { Pagination } from './Pagination';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string; // For alignment (e.g. text-right)
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
  pagination?: boolean;
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading,
  emptyTitle = "No data found",
  emptyDescription = "There are no records to display.",
  itemsPerPage = 10,
  pagination = true
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return <EmptyState icon={PackageOpen} title={emptyTitle} description={emptyDescription} />;
  }

  // Handle pagination logic internally
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = pagination 
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-description text-left whitespace-nowrap">
        <thead className="text-caption uppercase bg-input/50 text-muted-foreground border-b border-border">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-6 py-4 font-semibold ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border hover:bg-muted/50 transition-colors last:border-0">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey as keyof T]) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {pagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
