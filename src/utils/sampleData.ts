import { GasRecord } from '../types/gas';

export const SAMPLE_GAS_DATA: Omit<GasRecord, 'id' | 'unitPrice'>[] = [
  // 1월 (동절기 난방 및 산업 가동 집중)
  { month: '2024년 01월', item: '가정용 LPG(프로판)', volume: 18500, revenue: 38850000 },
  { month: '2024년 01월', item: '상업용 LPG(부탄)', volume: 14200, revenue: 26980000 },
  { month: '2024년 01월', item: '도시가스(LNG)', volume: 32000, revenue: 60800000 },
  { month: '2024년 01월', item: '산업용 고순도 질소(N2)', volume: 22000, revenue: 33000000 },
  { month: '2024년 01월', item: '의료 및 산업용 산소(O2)', volume: 12500, revenue: 20000000 },
  { month: '2024년 01월', item: '식음료용 탄산가스(CO2)', volume: 8900, revenue: 15130000 },

  // 2월
  { month: '2024년 02월', item: '가정용 LPG(프로판)', volume: 17200, revenue: 36120000 },
  { month: '2024년 02월', item: '상업용 LPG(부탄)', volume: 13500, revenue: 25650000 },
  { month: '2024년 02월', item: '도시가스(LNG)', volume: 29800, revenue: 56620000 },
  { month: '2024년 02월', item: '산업용 고순도 질소(N2)', volume: 20800, revenue: 31200000 },
  { month: '2024년 02월', item: '의료 및 산업용 산소(O2)', volume: 11900, revenue: 19040000 },
  { month: '2024년 02월', item: '식음료용 탄산가스(CO2)', volume: 8200, revenue: 13940000 },

  // 3월 (환절기)
  { month: '2024년 03월', item: '가정용 LPG(프로판)', volume: 13400, revenue: 28140000 },
  { month: '2024년 03월', item: '상업용 LPG(부탄)', volume: 12800, revenue: 24320000 },
  { month: '2024년 03월', item: '도시가스(LNG)', volume: 24000, revenue: 45600000 },
  { month: '2024년 03월', item: '산업용 고순도 질소(N2)', volume: 23500, revenue: 35250000 },
  { month: '2024년 03월', item: '의료 및 산업용 산소(O2)', volume: 13100, revenue: 20960000 },
  { month: '2024년 03월', item: '식음료용 탄산가스(CO2)', volume: 9800, revenue: 16660000 },

  // 4월 (봄철)
  { month: '2024년 04월', item: '가정용 LPG(프로판)', volume: 10200, revenue: 21420000 },
  { month: '2024년 04월', item: '상업용 LPG(부탄)', volume: 11900, revenue: 22610000 },
  { month: '2024년 04월', item: '도시가스(LNG)', volume: 18500, revenue: 35150000 },
  { month: '2024년 04월', item: '산업용 고순도 질소(N2)', volume: 24200, revenue: 36300000 },
  { month: '2024년 04월', item: '의료 및 산업용 산소(O2)', volume: 13800, revenue: 22080000 },
  { month: '2024년 04월', item: '식음료용 탄산가스(CO2)', volume: 11200, revenue: 19040000 },

  // 5월
  { month: '2024년 05월', item: '가정용 LPG(프로판)', volume: 8500, revenue: 17850000 },
  { month: '2024년 05월', item: '상업용 LPG(부탄)', volume: 12100, revenue: 22990000 },
  { month: '2024년 05월', item: '도시가스(LNG)', volume: 15200, revenue: 28880000 },
  { month: '2024년 05월', item: '산업용 고순도 질소(N2)', volume: 25100, revenue: 37650000 },
  { month: '2024년 05월', item: '의료 및 산업용 산소(O2)', volume: 14200, revenue: 22720000 },
  { month: '2024년 05월', item: '식음료용 탄산가스(CO2)', volume: 13500, revenue: 22950000 },

  // 6월 (초여름 - 탄산가스 급증, 난방 급감)
  { month: '2024년 06월', item: '가정용 LPG(프로판)', volume: 6900, revenue: 14490000 },
  { month: '2024년 06월', item: '상업용 LPG(부탄)', volume: 11500, revenue: 21850000 },
  { month: '2024년 06월', item: '도시가스(LNG)', volume: 12900, revenue: 24510000 },
  { month: '2024년 06월', item: '산업용 고순도 질소(N2)', volume: 26000, revenue: 39000000 },
  { month: '2024년 06월', item: '의료 및 산업용 산소(O2)', volume: 14500, revenue: 23200000 },
  { month: '2024년 06월', item: '식음료용 탄산가스(CO2)', volume: 16800, revenue: 28560000 },

  // 7월 (한여름)
  { month: '2024년 07월', item: '가정용 LPG(프로판)', volume: 5800, revenue: 12180000 },
  { month: '2024년 07월', item: '상업용 LPG(부탄)', volume: 10800, revenue: 20520000 },
  { month: '2024년 07월', item: '도시가스(LNG)', volume: 11400, revenue: 21660000 },
  { month: '2024년 07월', item: '산업용 고순도 질소(N2)', volume: 24500, revenue: 36750000 },
  { month: '2024년 07월', item: '의료 및 산업용 산소(O2)', volume: 13900, revenue: 22240000 },
  { month: '2024년 07월', item: '식음료용 탄산가스(CO2)', volume: 18200, revenue: 30940000 },

  // 8월
  { month: '2024년 08월', item: '가정용 LPG(프로판)', volume: 5900, revenue: 12390000 },
  { month: '2024년 08월', item: '상업용 LPG(부탄)', volume: 10900, revenue: 20710000 },
  { month: '2024년 08월', item: '도시가스(LNG)', volume: 11800, revenue: 22420000 },
  { month: '2024년 08월', item: '산업용 고순도 질소(N2)', volume: 23800, revenue: 35700000 },
  { month: '2024년 08월', item: '의료 및 산업용 산소(O2)', volume: 13600, revenue: 21760000 },
  { month: '2024년 08월', item: '식음료용 탄산가스(CO2)', volume: 19100, revenue: 32470000 },

  // 9월 (초가을)
  { month: '2024년 09월', item: '가정용 LPG(프로판)', volume: 8200, revenue: 17220000 },
  { month: '2024년 09월', item: '상업용 LPG(부탄)', volume: 11700, revenue: 22230000 },
  { month: '2024년 09월', item: '도시가스(LNG)', volume: 14500, revenue: 27550000 },
  { month: '2024년 09월', item: '산업용 고순도 질소(N2)', volume: 25400, revenue: 38100000 },
  { month: '2024년 09월', item: '의료 및 산업용 산소(O2)', volume: 14300, revenue: 22880000 },
  { month: '2024년 09월', item: '식음료용 탄산가스(CO2)', volume: 14200, revenue: 24140000 },

  // 10월
  { month: '2024년 10월', item: '가정용 LPG(프로판)', volume: 11600, revenue: 24360000 },
  { month: '2024년 10월', item: '상업용 LPG(부탄)', volume: 12600, revenue: 23940000 },
  { month: '2024년 10월', item: '도시가스(LNG)', volume: 20100, revenue: 38190000 },
  { month: '2024년 10월', item: '산업용 고순도 질소(N2)', volume: 26800, revenue: 40200000 },
  { month: '2024년 10월', item: '의료 및 산업용 산소(O2)', volume: 14800, revenue: 23680000 },
  { month: '2024년 10월', item: '식음료용 탄산가스(CO2)', volume: 11000, revenue: 18700000 },

  // 11월
  { month: '2024년 11월', item: '가정용 LPG(프로판)', volume: 15400, revenue: 32340000 },
  { month: '2024년 11월', item: '상업용 LPG(부탄)', volume: 13800, revenue: 26220000 },
  { month: '2024년 11월', item: '도시가스(LNG)', volume: 26500, revenue: 50350000 },
  { month: '2024년 11월', item: '산업용 고순도 질소(N2)', volume: 25200, revenue: 37800000 },
  { month: '2024년 11월', item: '의료 및 산업용 산소(O2)', volume: 14100, revenue: 22560000 },
  { month: '2024년 11월', item: '식음료용 탄산가스(CO2)', volume: 9200, revenue: 15640000 },

  // 12월 (성수기)
  { month: '2024년 12월', item: '가정용 LPG(프로판)', volume: 19800, revenue: 41580000 },
  { month: '2024년 12월', item: '상업용 LPG(부탄)', volume: 15100, revenue: 28690000 },
  { month: '2024년 12월', item: '도시가스(LNG)', volume: 34500, revenue: 65550000 },
  { month: '2024년 12월', item: '산업용 고순도 질소(N2)', volume: 24900, revenue: 37350000 },
  { month: '2024년 12월', item: '의료 및 산업용 산소(O2)', volume: 14600, revenue: 23360000 },
  { month: '2024년 12월', item: '식음료용 탄산가스(CO2)', volume: 9500, revenue: 16150000 },
];

export function getSampleGasRecords(): GasRecord[] {
  return SAMPLE_GAS_DATA.map((row, index) => {
    const unitPrice = row.volume > 0 ? Math.round(row.revenue / row.volume) : 0;
    // Extract month number if possible
    const match = row.month.match(/(\d+)월/);
    const monthNum = match ? parseInt(match[1], 10) : undefined;
    return {
      id: `sample-${index + 1}`,
      ...row,
      monthNum,
      year: 2024,
      unitPrice,
    };
  });
}
