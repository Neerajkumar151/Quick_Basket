import React from "react";
import { ChevronRight } from "lucide-react";
import en from "../../locales/en.json";
import { DataTable, ColumnDef } from "../ui/DataTable";
import { StatusBadge } from "../ui/StatusBadge";
import { RowActions } from "../ui/RowActions";

import mockData from "../../constants/mock.json";

const RECENT_ORDERS = mockData.recentOrders;

export const OperationalInsights: React.FC = () => {
  const columns: ColumnDef<typeof RECENT_ORDERS[0]>[] = [
    {
      header: en.dashboard.operational.recentOrders.columns.orderId,
      accessorKey: 'id',
      className: "font-medium text-muted-foreground"
    },
    {
      header: en.dashboard.operational.recentOrders.columns.customer,
      accessorKey: 'customer',
      className: "font-semibold text-foreground"
    },
    {
      header: en.dashboard.operational.recentOrders.columns.time,
      accessorKey: 'time',
      className: "text-muted-foreground"
    },
    {
      header: en.dashboard.operational.recentOrders.columns.status,
      cell: (order) => <StatusBadge status={order.status} />
    },
    {
      header: en.dashboard.operational.recentOrders.columns.total,
      accessorKey: 'amount',
      className: "font-bold text-foreground"
    },
    {
      header: en.dashboard.operational.recentOrders.columns.action,
      className: "text-right",
      cell: () => (
        <div className="flex justify-end">
          <RowActions actions={[{ label: 'View Order', onClick: () => {} }]} />
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-border">
          <h2 className="text-h3 font-bold text-card-foreground">{en.dashboard.operational.recentOrders.title}</h2>
          <button className="flex items-center gap-1 text-description font-medium text-primary hover:text-primary/80 transition-colors">
            {en.dashboard.operational.recentOrders.viewAll} <ChevronRight size={16} />
          </button>
        </div>
        
        <DataTable data={RECENT_ORDERS} columns={columns} />
      </div>
    </div>
  );
};
