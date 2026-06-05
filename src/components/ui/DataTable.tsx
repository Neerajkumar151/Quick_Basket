import React from 'react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingSkeletons';
import { PackageOpen } from 'lucide-react';

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
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading,
  emptyTitle = "No data found",
  emptyDescription = "There are no records to display."
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return <EmptyState icon={PackageOpen} title={emptyTitle} description={emptyDescription} />;
  }

  return (
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
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border hover:bg-muted/50 transition-colors last:border-0">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey]) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
