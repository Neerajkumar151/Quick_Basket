import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { KPICards, KPIItem } from '../../../components/dashboard/KPICards';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useSalesMetrics, useRevenueTrends } from '../../../hooks/useReports';
import { DateRange } from '../../../services/reports.service';
import { Wallet, ShoppingBag, Package, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const SalesDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>('thisWeek');
  
  const { data, isLoading, isFetching, isError, refetch } = useSalesMetrics(dateRange);

  // Map the dateRange to trend periods for the chart
  const trendPeriod = dateRange === 'today' ? 'daily' : dateRange === 'thisWeek' ? 'weekly' : 'monthly';
  const { data: trendData, isLoading: isTrendLoading } = useRevenueTrends(trendPeriod as any);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isUpdating = isLoading || isFetching;

  const kpiItems: KPIItem[] = useMemo(() => {
    return [
      {
        id: 'totalOrders',
        title: t('dashboard.kpis.primary.orders', 'Total Orders'),
        icon: ShoppingBag,
        bgClass: 'bg-primary/10',
        colorClass: 'text-primary',
        value: data ? data.totalOrders : '-'
      },
      {
        id: 'totalSales',
        title: t('dashboard.kpis.primary.sales', 'Total Sales'),
        icon: TrendingUp,
        bgClass: 'bg-status-delivered/10',
        colorClass: 'text-status-delivered',
        value: data ? formatCurrency(data.totalSales) : '-'
      },
      {
        id: 'totalRevenue',
        title: t('dashboard.kpis.primary.revenue', 'Total Revenue'),
        icon: Wallet,
        bgClass: 'bg-status-purple/10',
        colorClass: 'text-status-purple',
        value: data ? formatCurrency(data.totalRevenue) : '-'
      },
      {
        id: 'deliveredOrders',
        title: t('dashboard.kpis.orderStatus.delivered', 'Delivered Orders'),
        icon: CheckCircle2,
        bgClass: 'bg-status-delivered/10',
        colorClass: 'text-status-delivered',
        value: data ? data.deliveredOrders : '-'
      },
      {
        id: 'cancelledOrders',
        title: t('dashboard.kpis.orderStatus.cancelled', 'Cancelled Orders'),
        icon: XCircle,
        bgClass: 'bg-status-cancelled/10',
        colorClass: 'text-status-cancelled',
        value: data ? data.cancelledOrders : '-'
      },
      {
        id: 'aov',
        title: t('dashboard.kpis.primary.aov', 'Average Order Value'),
        icon: Package,
        bgClass: 'bg-status-pending/10',
        colorClass: 'text-status-pending',
        value: data ? formatCurrency(data.aov) : '-'
      }
    ];
  }, [data, t]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-64">
          <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {t('reports.sales.filters.today') ? 'Date Range:' : 'Date Range:'}
          </label>
          <Select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
          >
            <option value="today">{t('reports.sales.filters.today')}</option>
            <option value="thisWeek">{t('reports.sales.filters.thisWeek')}</option>
            <option value="thisMonth">{t('reports.sales.filters.thisMonth')}</option>
          </Select>
        </div>

        <Button 
          onClick={() => refetch()} 
          disabled={isUpdating}
          className="gap-2"
        >
          <RefreshCw size={16} className={isUpdating ? "animate-spin" : ""} />
          {t('reports.sales.refresh')}
        </Button>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          {/* KPI Grid */}
          <KPICards items={kpiItems} />

          {/* Sales Trend Chart */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-h3 font-bold text-card-foreground">{t('reports.sales.trendTitle', 'Sales Trend')}</h2>
            </div>
            <div className="flex-1 w-full relative">
              {isTrendLoading ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">{t('common.loading', 'Loading...')}</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
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
                    />
                    <RechartsTooltip 
                      cursor={{ stroke: 'hsl(var(--muted-foreground) / 0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', backdropFilter: 'blur(8px)', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 'bold' }}
                      formatter={(value: any) => [`₹${value.toLocaleString()}`, t('reports.sales.sales', 'Sales')]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={1000} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
