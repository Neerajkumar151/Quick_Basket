import React from "react";
import { Package, Plus, ChevronRight, AlertCircle, AlertTriangle } from "lucide-react";
import en from "../../locales/en.json";

const RECENT_ORDERS = [
  { id: "#QB-8902", customer: "Sarah Williams", time: "10:24 AM", status: "Delivered", statusColor: "bg-status-delivered/10 text-status-delivered border-status-delivered/20", amount: "$128.40" },
  { id: "#QB-8901", customer: "David Miller", time: "09:45 AM", status: "Processing", statusColor: "bg-status-processing/10 text-status-processing border-status-processing/20", amount: "$42.00" },
  { id: "#QB-8900", customer: "Emma Watson", time: "09:12 AM", status: "Processing", statusColor: "bg-status-processing/10 text-status-processing border-status-processing/20", amount: "$215.10" },
  { id: "#QB-8899", customer: "Robert Down", time: "08:30 AM", status: "Cancelled", statusColor: "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20", amount: "$12.50" },
  { id: "#QB-8898", customer: "Jessica Alba", time: "Yesterday", status: "Pending", statusColor: "bg-status-pending/10 text-status-pending border-status-pending/20", amount: "$89.90" },
];

const LOW_STOCK = [
  { name: "Organic Avocados (Pack of 4)", units: 3, severity: "critical" },
  { name: "Greek Yogurt Blueberry", units: 5, severity: "critical" },
  { name: "Whole Wheat Bread", units: 12, severity: "warning" },
  { name: "Almond Milk 1L", units: 15, severity: "warning" },
];

export const OperationalInsights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Recent Orders - Takes 2 cols */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-border">
          <h2 className="text-xl font-bold text-card-foreground">{en.dashboard.operational.recentOrders.title}</h2>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            {en.dashboard.operational.recentOrders.viewAll} <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">{en.dashboard.operational.recentOrders.columns.orderId}</th>
                <th className="px-6 py-4 font-semibold tracking-wider">{en.dashboard.operational.recentOrders.columns.customer}</th>
                <th className="px-6 py-4 font-semibold tracking-wider">{en.dashboard.operational.recentOrders.columns.time}</th>
                <th className="px-6 py-4 font-semibold tracking-wider">{en.dashboard.operational.recentOrders.columns.status}</th>
                <th className="px-6 py-4 font-semibold tracking-wider">{en.dashboard.operational.recentOrders.columns.total}</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">{en.dashboard.operational.recentOrders.columns.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_ORDERS.map((order, i) => (
                <tr key={i} className="bg-card hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-medium text-muted-foreground group-hover:text-primary transition-colors">{order.id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{order.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">{order.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground transition-colors px-2">
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full">
        <div className="p-6 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-card-foreground">{en.dashboard.operational.lowStock.title}</h2>
            <span className="flex items-center justify-center w-6 h-6 text-xs font-bold bg-status-cancelled/10 text-status-cancelled border border-status-cancelled/20 rounded-full">
              14
            </span>
          </div>
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            {en.dashboard.operational.lowStock.viewInventory}
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-3 flex-1 overflow-y-auto">
          {LOW_STOCK.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border hover:border-border/80 transition-all group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors
                  ${item.severity === 'critical' 
                    ? 'bg-status-cancelled/10 border-status-cancelled/20 text-status-cancelled group-hover:bg-status-cancelled/20' 
                    : 'bg-status-pending/10 border-status-pending/20 text-status-pending group-hover:bg-status-pending/20'
                  }`}
                >
                  {item.severity === 'critical' ? <AlertCircle size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground line-clamp-1">{item.name}</span>
                  <span className={`text-xs font-semibold ${item.severity === 'critical' ? 'text-status-cancelled' : 'text-status-pending'}`}>
                    {item.units} {en.dashboard.operational.lowStock.unitsRemaining}
                  </span>
                </div>
              </div>
              <button className="shrink-0 w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer shadow-sm">
                <Plus size={16} />
              </button>
            </div>
          ))}
          
          <button className="w-full mt-auto py-3.5 border border-dashed border-border rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.02] hover:border-muted-foreground transition-all flex items-center justify-center gap-2">
            <Plus size={16} /> {en.dashboard.operational.lowStock.restockItems}
          </button>
        </div>
      </div>

    </div>
  );
};
