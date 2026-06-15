import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Sector,
  AreaChart, Area
} from "recharts";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { DashboardAnalytics, OrderStatusDistributionItem } from "../../types/dashboard";

interface AnalyticsSectionProps {
  analytics?: DashboardAnalytics;
  revenueFilter: 'Daily' | 'Weekly' | 'Monthly';
  setRevenueFilter: (filter: 'Daily' | 'Weekly' | 'Monthly') => void;
  ordersFilter: 'Daily' | 'Weekly' | 'Monthly';
  setOrdersFilter: (filter: 'Daily' | 'Weekly' | 'Monthly') => void;
}

const getOrderStatusData = (t: TFunction, distribution: OrderStatusDistributionItem[] = []) => {
  // If API provides distribution, map it. Otherwise fallback to empty.
  return distribution.map(item => {
    let color = item.color;
    if (!color) {
      const lowerName = item.name.toLowerCase();
      if (lowerName.includes('cancel') || lowerName.includes('reject')) {
        color = 'hsl(var(--status-cancelled))';
      } else if (lowerName === 'delivered' || lowerName.includes('complet')) {
        color = 'hsl(var(--status-delivered))';
      } else if (lowerName === 'out_for_delivery' || lowerName.includes('out for delivery')) {
        color = 'hsl(var(--status-cyan))';
      } else if (lowerName === 'processing' || lowerName.includes('progress')) {
        color = 'hsl(var(--status-blue))';
      } else if (lowerName === 'placed' || lowerName.includes('place')) {
        color = 'hsl(var(--status-purple))';
      } else if (lowerName.includes('pend')) {
        color = 'hsl(var(--status-pending))';
      } else {
        color = 'hsl(var(--primary))';
      }
    }
    return { ...item, name: t(item.name as any) || item.name, color };
  });
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 6) * cos;
  const sy = cy + (outerRadius + 6) * sin;
  const mx = cx + (outerRadius + 14) * cos;
  const my = cy + (outerRadius + 14) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 10;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey - 4} textAnchor={textAnchor} fill="hsl(var(--foreground))" fontSize={11} fontWeight="bold">
        {payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey + 12} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" fontSize={11}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = React.memo(({ 
  analytics, 
  revenueFilter, 
  setRevenueFilter, 
  ordersFilter, 
  setOrdersFilter 
}) => {
  const { t } = useTranslation();
  const [activePieIndex, setActivePieIndex] = useState<number | undefined>(undefined);
  
  const orderStatusData = getOrderStatusData(t, analytics?.orderStatusDistribution || []);
  const totalOrders = orderStatusData.reduce((acc: any, curr: any) => acc + curr.value, 0);

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Top Row: Separated Revenue and Orders Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart - Area Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-[420px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h3 font-bold text-card-foreground">{t("dashboard.analytics.tabs.revenue")}</h2>
            <div className="flex bg-background border border-border rounded-md overflow-hidden shrink-0">
              {['Daily', 'Weekly', 'Monthly'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setRevenueFilter(filter as any)}
                  className={`px-3 py-1.5 text-caption font-medium transition-colors ${
                    revenueFilter === filter 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {filter === 'Daily' ? t("dashboard.analytics.filters.daily") : filter === 'Weekly' ? t("dashboard.analytics.filters.weekly") : t("dashboard.analytics.filters.monthly")}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.revenueTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, t("dashboard.analytics.tabs.revenue")]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={1000} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart - Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-[420px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h3 font-bold text-card-foreground">{t("dashboard.analytics.tabs.orders")}</h2>
            <div className="flex bg-background border border-border rounded-md overflow-hidden shrink-0">
              {['Daily', 'Weekly', 'Monthly'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setOrdersFilter(filter as any)}
                  className={`px-3 py-1.5 text-caption font-medium transition-colors ${
                    ordersFilter === filter 
                      ? 'bg-status-purple/20 text-status-purple' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  {filter === 'Daily' ? t("dashboard.analytics.filters.daily") : filter === 'Weekly' ? t("dashboard.analytics.filters.weekly") : t("dashboard.analytics.filters.monthly")}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.orderTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted-foreground) / 0.03)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', backdropFilter: 'blur(8px)', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 'bold' }}
                  formatter={(value: any) => [value.toLocaleString(), t("dashboard.analytics.tabs.orders")]}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--status-purple))" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  opacity={0.8}
                  activeBar={{ fill: 'hsl(var(--status-purple))', opacity: 1, filter: 'brightness(1.2)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row: Order Status Distribution */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 min-h-[340px]">
        
        {/* Legends / Breakdown */}
        <div className="flex flex-col flex-1 justify-center">
          <h2 className="text-h3 font-bold text-card-foreground mb-6">{t("dashboard.analytics.orderStatusTitle")}</h2>
          <div className="flex flex-col gap-4">
            {orderStatusData.map((status, idx) => {
              const percentage = (status.value / totalOrders) * 100;
              const isActive = activePieIndex === idx;
              return (
                <div 
                  key={status.name} 
                  className={`flex flex-col gap-2 cursor-pointer transition-opacity ${activePieIndex !== undefined && !isActive ? 'opacity-40' : 'opacity-100'}`}
                  onMouseEnter={() => setActivePieIndex(idx)}
                  onMouseLeave={() => setActivePieIndex(undefined)}
                >
                  <div className="flex justify-between items-center text-description">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      {status.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-bold">{status.value}</span>
                      <span className="text-caption text-muted-foreground w-10 text-right">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%`, backgroundColor: status.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="flex-1 relative min-h-[300px] md:min-h-full border-t border-border pt-6 md:pt-0 md:border-t-0 md:border-l md:pl-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                // @ts-ignore Recharts types mismatch for activeIndex
                activeIndex={activePieIndex as any}
                activeShape={renderActiveShape}
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                onMouseEnter={(_, index) => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(undefined)}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text for Donut */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-h1 font-bold text-foreground tracking-tight">{totalOrders.toLocaleString()}</span>
            <span className="text-caption uppercase tracking-widest text-muted-foreground mt-1">{t("dashboard.analytics.total")}</span>
          </div>
        </div>

      </div>
    </div>
  );
});
AnalyticsSection.displayName = "AnalyticsSection";
