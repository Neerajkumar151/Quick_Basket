import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Sector,
  AreaChart, Area
} from "recharts";
import en from "../../locales/en.json";

const REVENUE_DATA = [
  { name: 'Jan', value: 3200 },
  { name: 'Feb', value: 4100 },
  { name: 'Mar', value: 4800 },
  { name: 'Apr', value: 3900 },
  { name: 'May', value: 6500 },
  { name: 'Jun', value: 6200 },
  { name: 'Jul', value: 7100 },
  { name: 'Aug', value: 5800 },
  { name: 'Sep', value: 8900 },
  { name: 'Oct', value: 7200 },
  { name: 'Nov', value: 9800 },
  { name: 'Dec', value: 8500 },
];

const ORDERS_DATA = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 140 },
  { name: 'Mar', value: 180 },
  { name: 'Apr', value: 150 },
  { name: 'May', value: 250 },
  { name: 'Jun', value: 220 },
  { name: 'Jul', value: 290 },
  { name: 'Aug', value: 210 },
  { name: 'Sep', value: 340 },
  { name: 'Oct', value: 280 },
  { name: 'Nov', value: 420 },
  { name: 'Dec', value: 380 },
];

const ORDER_STATUS_DATA = [
  { name: en.dashboard.analytics.statuses.pending, value: 142, color: 'hsl(var(--status-pending))' },
  { name: en.dashboard.analytics.statuses.processing, value: 289, color: 'hsl(var(--status-processing))' },
  { name: en.dashboard.analytics.statuses.delivered, value: 1402, color: 'hsl(var(--status-delivered))' },
  { name: en.dashboard.analytics.statuses.cancelled, value: 34, color: 'hsl(var(--status-cancelled))' },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 12) * cos;
  const my = cy + (outerRadius + 12) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 15;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" fontSize={12} fontWeight="bold">
        {`${payload.name} ${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

export const AnalyticsSection: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
  const [activePieIndex, setActivePieIndex] = useState<number | undefined>(undefined);

  const totalOrders = ORDER_STATUS_DATA.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Top Row: Separated Revenue and Orders Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart - Area Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-[420px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-card-foreground">{en.dashboard.analytics.tabs.revenue}</h2>
            <div className="flex bg-background border border-border rounded-md overflow-hidden shrink-0">
              {['Daily', 'Weekly', 'Monthly'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setDateFilter(filter as any)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    dateFilter === filter 
                      ? 'bg-status-processing/20 text-status-processing' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  {filter === 'Daily' ? en.dashboard.analytics.filters.daily : filter === 'Weekly' ? en.dashboard.analytics.filters.weekly : en.dashboard.analytics.filters.monthly}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--status-processing))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--status-processing))" stopOpacity={0}/>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <RechartsTooltip 
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, en.dashboard.analytics.tabs.revenue]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--status-processing))" 
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
            <h2 className="text-xl font-bold text-card-foreground">{en.dashboard.analytics.tabs.orders}</h2>
            <div className="flex bg-background border border-border rounded-md overflow-hidden shrink-0">
              {['Daily', 'Weekly', 'Monthly'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setDateFilter(filter as any)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    dateFilter === filter 
                      ? 'bg-status-purple/20 text-status-purple' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  {filter === 'Daily' ? en.dashboard.analytics.filters.daily : filter === 'Weekly' ? en.dashboard.analytics.filters.weekly : en.dashboard.analytics.filters.monthly}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ORDERS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value: number) => [value.toLocaleString(), en.dashboard.analytics.tabs.orders]}
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
          <h2 className="text-xl font-bold text-card-foreground mb-6">{en.dashboard.analytics.orderStatusTitle}</h2>
          <div className="flex flex-col gap-4">
            {ORDER_STATUS_DATA.map((status, idx) => {
              const percentage = (status.value / totalOrders) * 100;
              const isActive = activePieIndex === idx;
              return (
                <div 
                  key={status.name} 
                  className={`flex flex-col gap-2 cursor-pointer transition-opacity ${activePieIndex !== undefined && !isActive ? 'opacity-40' : 'opacity-100'}`}
                  onMouseEnter={() => setActivePieIndex(idx)}
                  onMouseLeave={() => setActivePieIndex(undefined)}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      {status.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-bold">{status.value}</span>
                      <span className="text-xs text-muted-foreground w-10 text-right">{percentage.toFixed(1)}%</span>
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
                activeIndex={activePieIndex}
                activeShape={renderActiveShape}
                data={ORDER_STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                onMouseEnter={(_, index) => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(undefined)}
              >
                {ORDER_STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text for Donut */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground tracking-tight">{totalOrders.toLocaleString()}</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">{en.dashboard.analytics.total}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
