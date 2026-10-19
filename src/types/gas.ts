export interface GasRecord {
  id: string;
  month: string;      // e.g. "2024-01" or "1월" or "2024년 1월"
  monthNum?: number;  // normalized 1-12
  year?: number;      // e.g. 2024
  item: string;       // e.g. "LPG(프로판)", "도시가스(LNG)", "산업용 질소" 등
  volume: number;     // 판매량
  revenue: number;    // 매출액 (원)
  unitPrice?: number; // 매출액 / 판매량
}

export interface SummaryMetrics {
  totalRevenue: number;
  totalVolume: number;
  avgMonthlyRevenue: number;
  avgMonthlyVolume: number;
  
  // Highest
  maxMonthRevenue: { month: string; revenue: number };
  minMonthRevenue: { month: string; revenue: number };
  maxItemRevenue: { item: string; revenue: number; percentage: number };
  minItemRevenue: { item: string; revenue: number; percentage: number };
  maxItemVolume: { item: string; volume: number };
  minItemVolume: { item: string; volume: number };
  
  // Single record extremes
  maxSingleSale: { month: string; item: string; revenue: number; volume: number };
  minSingleSale: { month: string; item: string; revenue: number; volume: number };
  
  avgUnitPrice: number; // 평균 단가
  recordCount: number;
  uniqueMonthsCount: number;
  uniqueItemsCount: number;

  // MoM Growth Extremes
  maxMoMGrowth?: { month: string; rate: number; diff: number } | null;
  minMoMGrowth?: { month: string; rate: number; diff: number } | null;
  avgMoMGrowth?: number | null;
}

export interface ColumnMapping {
  month: string;
  item: string;
  volume: string;
  revenue: string;
}

export interface MonthlyTrendData {
  month: string;
  monthRaw: string;
  totalRevenue: number;
  totalVolume: number;
  prevRevenue?: number | null;
  momDiff?: number | null;     // 전월 대비 증감액 (원)
  momGrowth?: number | null;   // 전월 대비 매출 증감률 (%)
  momVolumeGrowth?: number | null; // 전월 대비 판매량 증감률 (%)
  [itemKey: string]: number | string | null | undefined;
}

export interface ItemSummaryData {
  item: string;
  totalVolume: number;
  totalRevenue: number;
  avgUnitPrice: number;
  revenueShare: number; // 0 - 100%
  volumeShare: number;
  maxMonth: string;
  maxMonthRevenue: number;
}
