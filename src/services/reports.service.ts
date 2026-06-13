import mockData from '../constants/mock.json';

export type DateRange = 'today' | 'thisWeek' | 'thisMonth' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface SalesMetrics {
  totalOrders: number;
  totalSales: number;
  totalRevenue: number;
  deliveredOrders: number;
  cancelledOrders: number;
  aov: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  grossRevenue: number;
  totalOrders: number;
  deliveredRevenue: number;
}

export interface TrendDataPoint {
  name: string;
  value: number;
}

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Normalizes the data structure
export const reportsService = {
  getSalesMetrics: async (period: DateRange): Promise<SalesMetrics> => {
    await delay();
    
    // Simulate varying data based on period
    const multiplier = period === 'thisMonth' ? 4 : period === 'thisWeek' ? 1 : 0.15;
    
    return {
      totalOrders: Math.round(4829 * multiplier),
      totalSales: 154000 * multiplier,
      totalRevenue: 128430 * multiplier,
      deliveredOrders: Math.round(4200 * multiplier),
      cancelledOrders: Math.round(150 * multiplier),
      aov: 31.89
    };
  },

  getRevenueMetrics: async (period: DateRange, startDate?: string, endDate?: string): Promise<RevenueMetrics> => {
    await delay();
    
    let multiplier = period === 'monthly' ? 4 : period === 'weekly' ? 1 : 0.15;
    
    if (period === 'custom' && startDate && endDate) {
      // Simulate random-ish metrics based on the date strings
      multiplier = ((startDate.charCodeAt(startDate.length - 1) + endDate.charCodeAt(endDate.length - 1)) % 5 + 1) * 0.5;
    }

    return {
      totalRevenue: 128430 * multiplier,
      grossRevenue: 154000 * multiplier,
      totalOrders: Math.round(4829 * multiplier),
      deliveredRevenue: 110000 * multiplier,
    };
  },

  getRevenueTrends: async (period: DateRange, startDate?: string, endDate?: string): Promise<TrendDataPoint[]> => {
    await delay();
    
    // Sync 'daily' (today) to sum up to totalRevenue: 128430 * 0.15 = 19264.5
    if (period === 'daily') {
      return [
        { name: 'Mon', value: 2500 },
        { name: 'Tue', value: 2800 },
        { name: 'Wed', value: 2100 },
        { name: 'Thu', value: 2900 },
        { name: 'Fri', value: 3200 },
        { name: 'Sat', value: 3800 },
        { name: 'Sun', value: 1964.5 }
      ];
    }
    
    // Sync 'weekly' (thisWeek) to sum up to totalRevenue: 128430 * 1 = 128430
    if (period === 'weekly') {
      return [
        { name: 'Week 1', value: 30000 },
        { name: 'Week 2', value: 35000 },
        { name: 'Week 3', value: 28430 },
        { name: 'Week 4', value: 35000 }
      ];
    }

    // Sync 'monthly' (thisMonth) to sum up to totalRevenue: 128430 * 4 = 513720
    // Original mock sum is 76000. Multiplier needed: 513720 / 76000 = 6.75947
    if (period === 'monthly') {
      return mockData.revenueData.map(item => ({
        ...item,
        value: Math.round(item.value * 6.75947)
      }));
    }
    
    if (period === 'custom' && startDate && endDate) {
      // Create some dynamic points based on the dates
      const base = (startDate.charCodeAt(startDate.length - 1) || 1) * 100;
      return [
        { name: startDate, value: base + 1200 },
        { name: 'Mid', value: base + 2500 },
        { name: endDate, value: base + 1800 }
      ];
    }
    
    return mockData.revenueData;
  },

  getRevenueBreakdown: async (period: DateRange, startDate?: string, endDate?: string): Promise<any[]> => {
    await delay();
    
    if (period === 'custom' && startDate && endDate) {
      // Just slice the array differently to simulate data change
      const offset = (startDate.length + endDate.length) % mockData.recentOrders.length;
      return [...mockData.recentOrders.slice(offset), ...mockData.recentOrders.slice(0, offset)];
    }
    
    return mockData.recentOrders;
  }
};
