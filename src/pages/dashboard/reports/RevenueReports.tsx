import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Landmark } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { KPICards, KPIItem } from '../../../components/dashboard/KPICards';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useRevenueMetrics, useRevenueTrends, useRevenueBreakdown } from '../../../hooks/useReports';
import { DateRange } from '../../../services/reports.service';
import mockData from '../../../constants/mock.json';
import { Wallet, ShoppingBag, Package, TrendingUp } from 'lucide-react';

const IconMap: Record<string, any> = {
  Wallet,
  ShoppingBag,
  Package,
  TrendingUp,
  Landmark
};

export const RevenueReports: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>('monthly');
  
  // UI State for inputs
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Applied state for API calls
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  const { data: metrics, isLoading: isMetricsLoading } = useRevenueMetrics(dateRange, appliedStartDate, appliedEndDate);
  const { data: trends, isLoading: isTrendsLoading } = useRevenueTrends(dateRange, appliedStartDate, appliedEndDate);
  const { data: breakdown, isLoading: isBreakdownLoading } = useRevenueBreakdown(dateRange, appliedStartDate, appliedEndDate);

  const breakdownColumns: ColumnDef<any>[] = useMemo(() => [
    { header: t('dashboard.operational.recentOrders.columns.orderId') || 'Order ID', accessorKey: 'id' },
    { header: t('dashboard.operational.recentOrders.columns.customer') || 'Customer', accessorKey: 'customer' },
    { header: t('dashboard.operational.recentOrders.columns.time') || 'Time', accessorKey: 'time' },
    { 
      header: t('dashboard.operational.recentOrders.columns.status') || 'Status', 
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />
    },
    { 
      header: t('dashboard.operational.recentOrders.columns.total') || 'Amount', 
      accessorKey: 'amount',
      className: 'font-medium'
    }
  ], [t]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExportCSV = () => {
    if (!trends) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Revenue\n"
      + trends.map(row => `${row.name},${row.value}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyCustomDate = () => {
    setAppliedStartDate(customStartDate);
    setAppliedEndDate(customEndDate);
  };

  const handleDateRangeChange = (val: string) => {
    setDateRange(val as DateRange);
    if (val !== 'custom') {
      setAppliedStartDate('');
      setAppliedEndDate('');
    }
  };

  const kpiItems: KPIItem[] = useMemo(() => {
    return mockData.revenueKpis.map((kpi: any) => {
      let value: string | number = '-';
      
      if (metrics) {
        switch (kpi.id) {
          case 'totalRevenue':
            value = formatCurrency(metrics.totalRevenue);
            break;
          case 'grossRevenue':
            value = formatCurrency(metrics.grossRevenue);
            break;
          case 'deliveredRevenue':
            value = formatCurrency(metrics.deliveredRevenue);
            break;
          case 'totalOrders':
            value = metrics.totalOrders;
            break;
        }
      }

      return {
        id: kpi.id,
        title: t(kpi.title),
        icon: IconMap[kpi.icon] || Wallet,
        bgClass: kpi.bgClass,
        colorClass: kpi.colorClass,
        value
      };
    });
  }, [metrics, t]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              View By:
            </label>
            <Select 
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="w-32"
            >
              <option value="daily">{t('reports.revenue.filters.daily') || 'Daily'}</option>
              <option value="weekly">{t('reports.revenue.filters.weekly') || 'Weekly'}</option>
              <option value="monthly">{t('reports.revenue.filters.monthly') || 'Monthly'}</option>
              <option value="custom">Custom Range</option>
            </Select>
          </div>

          {dateRange === 'custom' && (
            <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-4 p-1 rounded-lg bg-input/50 border border-border/50">
              <Input 
                type="date" 
                value={customStartDate} 
                onChange={(e) => setCustomStartDate(e.target.value)} 
                className="w-auto h-9 text-sm"
              />
              <span className="text-muted-foreground text-sm font-medium px-1">to</span>
              <Input 
                type="date" 
                value={customEndDate} 
                onChange={(e) => setCustomEndDate(e.target.value)} 
                className="w-auto h-9 text-sm"
              />
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleApplyCustomDate}
                disabled={!customStartDate || !customEndDate}
                className="h-9 px-4 ml-1"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          onClick={handleExportCSV}
          className="gap-2 w-full sm:w-auto"
        >
          <Download size={16} />
          {t('reports.revenue.export') || 'Export CSV'}
        </Button>
      </div>

      {/* KPI Grid */}
      <KPICards items={kpiItems} />

      {/* Revenue Trends Chart */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          {t('reports.revenue.trends')}
        </h3>
        <div className="h-[300px] w-full">
          {isTrendsLoading ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Order-Based Revenue Breakdown
        </h3>
        <DataTable 
          columns={breakdownColumns} 
          data={breakdown || []} 
          isLoading={isBreakdownLoading}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};
