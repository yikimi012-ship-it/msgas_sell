import { GasRecord, ItemSummaryData, MonthlyTrendData, SummaryMetrics } from '../types/gas';

export function formatKoreanNumber(val: number): string {
  if (isNaN(val)) return '0';
  return val.toLocaleString('ko-KR');
}

export function formatKoreanWon(val: number, compact = false): string {
  if (isNaN(val)) return '0원';
  if (!compact) {
    return `${val.toLocaleString('ko-KR')}원`;
  }
  
  // Compact representation
  const abs = Math.abs(val);
  if (abs >= 100_000_000) {
    const eok = Math.floor(val / 100_000_000);
    const remainder = Math.round((val % 100_000_000) / 10_000);
    if (remainder > 0) {
      return `${eok}억 ${remainder.toLocaleString('ko-KR')}만원`;
    }
    return `${eok}억원`;
  }
  if (abs >= 10_000) {
    const man = Math.round(val / 10_000);
    return `${man.toLocaleString('ko-KR')}만원`;
  }
  return `${val.toLocaleString('ko-KR')}원`;
}

export function calculateSummaryMetrics(records: GasRecord[]): SummaryMetrics | null {
  if (records.length === 0) return null;

  let totalRevenue = 0;
  let totalVolume = 0;

  // Single record extremes
  let maxSingleSale = { month: '', item: '', revenue: -Infinity, volume: 0 };
  let minSingleSale = { month: '', item: '', revenue: Infinity, volume: 0 };

  // Aggregate by Month
  const monthMap: Record<string, { revenue: number; volume: number }> = {};
  // Aggregate by Item
  const itemMap: Record<string, { revenue: number; volume: number }> = {};

  records.forEach(r => {
    totalRevenue += r.revenue;
    totalVolume += r.volume;

    // Single sale max/min
    if (r.revenue > maxSingleSale.revenue) {
      maxSingleSale = { month: r.month, item: r.item, revenue: r.revenue, volume: r.volume };
    }
    if (r.revenue < minSingleSale.revenue) {
      minSingleSale = { month: r.month, item: r.item, revenue: r.revenue, volume: r.volume };
    }

    // Month
    if (!monthMap[r.month]) {
      monthMap[r.month] = { revenue: 0, volume: 0 };
    }
    monthMap[r.month].revenue += r.revenue;
    monthMap[r.month].volume += r.volume;

    // Item
    if (!itemMap[r.item]) {
      itemMap[r.item] = { revenue: 0, volume: 0 };
    }
    itemMap[r.item].revenue += r.revenue;
    itemMap[r.item].volume += r.volume;
  });

  const monthKeys = Object.keys(monthMap);
  const itemKeys = Object.keys(itemMap);

  // Month extremes
  let maxMonthRevenue = { month: '', revenue: -Infinity };
  let minMonthRevenue = { month: '', revenue: Infinity };

  monthKeys.forEach(m => {
    const mData = monthMap[m];
    if (mData.revenue > maxMonthRevenue.revenue) {
      maxMonthRevenue = { month: m, revenue: mData.revenue };
    }
    if (mData.revenue < minMonthRevenue.revenue) {
      minMonthRevenue = { month: m, revenue: mData.revenue };
    }
  });

  // Item extremes
  let maxItemRevenue = { item: '', revenue: -Infinity, percentage: 0 };
  let minItemRevenue = { item: '', revenue: Infinity, percentage: 0 };
  let maxItemVolume = { item: '', volume: -Infinity };
  let minItemVolume = { item: '', volume: Infinity };

  itemKeys.forEach(item => {
    const iData = itemMap[item];
    const percentage = totalRevenue > 0 ? (iData.revenue / totalRevenue) * 100 : 0;

    if (iData.revenue > maxItemRevenue.revenue) {
      maxItemRevenue = { item, revenue: iData.revenue, percentage };
    }
    if (iData.revenue < minItemRevenue.revenue) {
      minItemRevenue = { item, revenue: iData.revenue, percentage };
    }

    if (iData.volume > maxItemVolume.volume) {
      maxItemVolume = { item, volume: iData.volume };
    }
    if (iData.volume < minItemVolume.volume) {
      minItemVolume = { item, volume: iData.volume };
    }
  });

  const uniqueMonthsCount = monthKeys.length || 1;
  const avgMonthlyRevenue = Math.round(totalRevenue / uniqueMonthsCount);
  const avgMonthlyVolume = Math.round(totalVolume / uniqueMonthsCount);
  const avgUnitPrice = totalVolume > 0 ? Math.round(totalRevenue / totalVolume) : 0;

  // Calculate MoM from monthMap
  const sortedMonths = Object.keys(monthMap).sort((a, b) => {
    const getOrder = (str: string) => {
      const match = str.match(/(?:(\d{4})[.\-/년\s]+)?(\d{1,2})월?/);
      if (match) {
        const y = match[1] ? parseInt(match[1], 10) : 2024;
        const m = parseInt(match[2], 10);
        return y * 100 + m;
      }
      return 0;
    };
    return getOrder(a) - getOrder(b);
  });

  let maxMoMGrowth: { month: string; rate: number; diff: number } | null = null;
  let minMoMGrowth: { month: string; rate: number; diff: number } | null = null;
  let momSum = 0;
  let momCount = 0;
  let previousRev: number | null = null;

  sortedMonths.forEach(m => {
    const currentRev = monthMap[m].revenue;
    if (previousRev !== null && previousRev > 0) {
      const rate = Math.round(((currentRev - previousRev) / previousRev) * 1000) / 10;
      const diff = currentRev - previousRev;
      momSum += rate;
      momCount++;

      if (!maxMoMGrowth || rate > maxMoMGrowth.rate) {
        maxMoMGrowth = { month: m, rate, diff };
      }
      if (!minMoMGrowth || rate < minMoMGrowth.rate) {
        minMoMGrowth = { month: m, rate, diff };
      }
    }
    previousRev = currentRev;
  });

  const avgMoMGrowth = momCount > 0 ? Math.round((momSum / momCount) * 10) / 10 : null;

  return {
    totalRevenue,
    totalVolume,
    avgMonthlyRevenue,
    avgMonthlyVolume,
    maxMonthRevenue,
    minMonthRevenue,
    maxItemRevenue,
    minItemRevenue,
    maxItemVolume,
    minItemVolume,
    maxSingleSale,
    minSingleSale,
    avgUnitPrice,
    recordCount: records.length,
    uniqueMonthsCount,
    uniqueItemsCount: itemKeys.length,
    maxMoMGrowth,
    minMoMGrowth,
    avgMoMGrowth,
  };
}

export function calculateMonthlyTrends(records: GasRecord[]): MonthlyTrendData[] {
  const map: Record<string, { totalRevenue: number; totalVolume: number; raw: string; order: number; items: Record<string, number> }> = {};

  records.forEach(r => {
    if (!map[r.month]) {
      // Determine sorting order
      let order = 999;
      if (r.monthNum) {
        order = (r.year ? r.year * 100 : 0) + r.monthNum;
      } else {
        const match = r.month.match(/(\d{4})?[^\d]*(\d{1,2})/);
        if (match) {
          const y = match[1] ? parseInt(match[1], 10) : 2024;
          const m = parseInt(match[2], 10);
          order = y * 100 + m;
        }
      }
      map[r.month] = {
        totalRevenue: 0,
        totalVolume: 0,
        raw: r.month,
        order,
        items: {},
      };
    }

    map[r.month].totalRevenue += r.revenue;
    map[r.month].totalVolume += r.volume;
    map[r.month].items[r.item] = (map[r.month].items[r.item] || 0) + r.revenue;
  });

  const sortedKeys = Object.keys(map).sort((a, b) => map[a].order - map[b].order);

  const results: MonthlyTrendData[] = [];
  let prevRevenue: number | null = null;
  let prevVolume: number | null = null;

  sortedKeys.forEach(m => {
    const entry = map[m];
    let momGrowth: number | null = null;
    let momDiff: number | null = null;
    let momVolumeGrowth: number | null = null;

    if (prevRevenue !== null && prevRevenue > 0) {
      momDiff = entry.totalRevenue - prevRevenue;
      momGrowth = Math.round(((entry.totalRevenue - prevRevenue) / prevRevenue) * 1000) / 10;
    }
    if (prevVolume !== null && prevVolume > 0) {
      momVolumeGrowth = Math.round(((entry.totalVolume - prevVolume) / prevVolume) * 1000) / 10;
    }

    const row: MonthlyTrendData = {
      month: m,
      monthRaw: entry.raw,
      totalRevenue: entry.totalRevenue,
      totalVolume: entry.totalVolume,
      prevRevenue,
      momDiff,
      momGrowth,
      momVolumeGrowth,
      ...entry.items,
    };

    prevRevenue = entry.totalRevenue;
    prevVolume = entry.totalVolume;
    results.push(row);
  });

  return results;
}

export function calculateItemSummaries(records: GasRecord[]): ItemSummaryData[] {
  let totalAllRevenue = 0;
  let totalAllVolume = 0;

  const itemMap: Record<string, { volume: number; revenue: number; months: Record<string, number> }> = {};

  records.forEach(r => {
    totalAllRevenue += r.revenue;
    totalAllVolume += r.volume;

    if (!itemMap[r.item]) {
      itemMap[r.item] = { volume: 0, revenue: 0, months: {} };
    }
    itemMap[r.item].volume += r.volume;
    itemMap[r.item].revenue += r.revenue;
    itemMap[r.item].months[r.month] = (itemMap[r.item].months[r.month] || 0) + r.revenue;
  });

  const items = Object.keys(itemMap);

  return items.map(item => {
    const data = itemMap[item];
    const revenueShare = totalAllRevenue > 0 ? (data.revenue / totalAllRevenue) * 100 : 0;
    const volumeShare = totalAllVolume > 0 ? (data.volume / totalAllVolume) * 100 : 0;
    const avgUnitPrice = data.volume > 0 ? Math.round(data.revenue / data.volume) : 0;

    // Find peak month
    let maxMonth = '';
    let maxMonthRevenue = 0;
    Object.entries(data.months).forEach(([m, rev]) => {
      if (rev > maxMonthRevenue) {
        maxMonthRevenue = rev;
        maxMonth = m;
      }
    });

    return {
      item,
      totalVolume: data.volume,
      totalRevenue: data.revenue,
      avgUnitPrice,
      revenueShare: Math.round(revenueShare * 10) / 10,
      volumeShare: Math.round(volumeShare * 10) / 10,
      maxMonth,
      maxMonthRevenue,
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

// Gas Color Palette tailored for Spotify-inspired dark UI (#121212 / #181818)
export const GAS_COLORS: Record<string, string> = {
  '가정용 LPG(프로판)': '#1ed760', // Spotify Green
  '도시가스(LNG)': '#539df5',      // Spotify Announcement Blue
  '상업용 LPG(부탄)': '#ffa42b',   // Spotify Warning Orange
  '식음료용 탄산가스(CO2)': '#f3727f', // Spotify Negative Red
  '산업용 고순도 질소(N2)': '#b388ff', // Soft Purple
  '의료 및 산업용 산소(O2)': '#00e5ff', // Neon Cyan
  '수소(H2)': '#ffd54f',           // Amber Gold
  '아르곤(Ar)': '#69f0ae',          // Mint Accent
  '기타': '#7c7c7c',                // Spotify Silver Gray
};

export const COLOR_PALETTE = [
  '#1ed760', // Spotify Green
  '#539df5', // Blue
  '#ffa42b', // Orange
  '#b388ff', // Purple
  '#f3727f', // Red/Pink
  '#00e5ff', // Cyan
  '#ffd54f', // Amber
  '#69f0ae', // Mint
  '#ff80ab', // Soft Rose
  '#e040fb', // Vivid Purple
];

export function getItemColor(itemName: string, index = 0): string {
  if (GAS_COLORS[itemName]) return GAS_COLORS[itemName];
  // Substring match
  for (const [key, color] of Object.entries(GAS_COLORS)) {
    if (itemName.includes(key.replace(/[^a-zA-Z가-힣]/g, '')) || key.includes(itemName)) {
      return color;
    }
  }
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}
