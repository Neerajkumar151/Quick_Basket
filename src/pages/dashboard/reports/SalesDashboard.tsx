import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { KPICards, KPIItem } from '../../../components/dashboard/KPICards';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { useSalesMetrics, useRevenueTrends } from '../../../hooks/useReports';
import { DateRange } from '../../../services/reports.service';
import mockData from '../../../constants/mock.json';
import { Wallet, ShoppingBag, Package, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const IconMap: Record<string, any> = {
  Wallet,
  ShoppingBag,
  Package,
  TrendingUp,
  CheckCircle2,
  XCircle
};

export const SalesDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>('thisWeek');
  
  const { data, isLoading, isFetching, refetch } = useSalesMetrics(dateRange);

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

  // Map mock.json KPI definitions to actual data values
  const kpiItems: KPIItem[] = useMemo(() => {
    return mockData.salesKpis.map((kpi: any) => {
      let value: string | number = '-';
      
      if (data) {
        // Map the correct field based on id
        switch (kpi.id) {
          case 'totalOrders':
            value = data.totalOrders;
            break;
          case 'totalSales':
            value = formatCurrency(data.totalSales);
            break;
          case 'totalRevenue':
            value = formatCurrency(data.totalRevenue);
            break;
          case 'deliveredOrders':
            value = data.deliveredOrders;
            break;
          case 'cancelledOrders':
            value = data.cancelledOrders;
            break;
          case 'aov':
            value = formatCurrency(data.aov);
            break;
        }
      }

      return {
        id: kpi.id,
        title: t(kpi.title),
        icon: IconMap[kpi.icon] || ShoppingBag,
        bgClass: kpi.bgClass,
        colorClass: kpi.colorClass,
        value
      };
    });
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
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <RechartsTooltip 
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
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
    </div>
  );
};
