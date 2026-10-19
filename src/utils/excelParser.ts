import * as XLSX from 'xlsx';
import { ColumnMapping, GasRecord } from '../types/gas';
import { SAMPLE_GAS_DATA } from './sampleData';

export interface ParseResult {
  records: GasRecord[];
  columns: string[];
  rawRowsCount: number;
  detectedMapping: ColumnMapping;
  errors?: string[];
}

export function detectColumns(headers: string[]): ColumnMapping {
  const cleanHeaders = headers.map(h => ({
    raw: h,
    lower: String(h || '').trim().toLowerCase().replace(/[\s_\-()]/g, ''),
  }));

  const monthCandidates = ['월', '년월', '연월', '일자', '날짜', '기준월', '기간', 'month', 'date', 'period'];
  const itemCandidates = ['품목', '품목명', '가스', '가스종류', '제품', '제품명', '종류', '구분', '항목', 'item', 'product', 'gas'];
  const volumeCandidates = ['판매량', '수량', '판매수량', '용량', '체적', 'volume', 'qty', 'quantity', 'amountvol'];
  const revenueCandidates = ['매출액', '매출', '판매금액', '금액', '매출금액', '공급가액', 'revenue', 'sales', 'price', 'total'];

  const findMatch = (candidates: string[]): string => {
    // 1. Exact or starts-with match
    for (const cand of candidates) {
      const found = cleanHeaders.find(h => h.lower === cand || h.lower.startsWith(cand) || h.lower.endsWith(cand));
      if (found) return found.raw;
    }
    // 2. Substring match
    for (const cand of candidates) {
      const found = cleanHeaders.find(h => h.lower.includes(cand));
      if (found) return found.raw;
    }
    return '';
  };

  return {
    month: findMatch(monthCandidates) || (headers[0] ?? ''),
    item: findMatch(itemCandidates) || (headers[1] ?? ''),
    volume: findMatch(volumeCandidates) || (headers[2] ?? ''),
    revenue: findMatch(revenueCandidates) || (headers[3] ?? ''),
  };
}

export function cleanNumber(val: unknown): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

export function extractMonthNumber(val: string): { monthNum?: number; year?: number; normalized: string } {
  const str = String(val || '').trim();
  
  // Format: 2024년 01월 or 2024-01 or 2024.01
  const ymMatch = str.match(/(?:(\d{4})[.\-/년\s]+)?(\d{1,2})월?/);
  if (ymMatch) {
    const year = ymMatch[1] ? parseInt(ymMatch[1], 10) : undefined;
    const monthNum = parseInt(ymMatch[2], 10);
    if (monthNum >= 1 && monthNum <= 12) {
      const normMonth = year ? `${year}년 ${String(monthNum).padStart(2, '0')}월` : `${monthNum}월`;
      return { monthNum, year, normalized: normMonth };
    }
  }

  return { normalized: str || '미상' };
}

export async function parseExcelFile(file: File, customMapping?: ColumnMapping): Promise<ParseResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('엑셀 파일에 유효한 시트가 없습니다.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

  if (jsonData.length === 0) {
    throw new Error('시트에 데이터가 비어 있습니다.');
  }

  // Detect columns from keys of first object
  const columns = Object.keys(jsonData[0] || {});
  const mapping = customMapping || detectColumns(columns);

  const errors: string[] = [];
  const records: GasRecord[] = [];

  jsonData.forEach((row, index) => {
    const rawMonth = String(row[mapping.month] ?? '').trim();
    const rawItem = String(row[mapping.item] ?? '').trim();
    const rawVolume = row[mapping.volume];
    const rawRevenue = row[mapping.revenue];

    // Skip empty lines
    if (!rawMonth && !rawItem && (rawVolume === '' || rawVolume === undefined) && (rawRevenue === '' || rawRevenue === undefined)) {
      return;
    }

    const volume = cleanNumber(rawVolume);
    const revenue = cleanNumber(rawRevenue);
    const { monthNum, year, normalized } = extractMonthNumber(rawMonth || `행 ${index + 1}`);

    const unitPrice = volume > 0 ? Math.round(revenue / volume) : 0;

    records.push({
      id: `row-${index + 1}-${Date.now()}`,
      month: normalized,
      monthNum,
      year,
      item: rawItem || '기타 가스',
      volume,
      revenue,
      unitPrice,
    });
  });

  if (records.length === 0) {
    throw new Error('유효한 데이터 행을 찾을 수 없습니다.');
  }

  return {
    records,
    columns,
    rawRowsCount: jsonData.length,
    detectedMapping: mapping,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Download Sample Template in XLSX format
export function downloadSampleExcel() {
  const worksheetData = [
    ['월', '품목', '판매량', '매출액'],
    ...SAMPLE_GAS_DATA.map(d => [d.month, d.item, d.volume, d.revenue]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  ws['!cols'] = [
    { wch: 16 }, // 월
    { wch: 24 }, // 품목
    { wch: 14 }, // 판매량
    { wch: 16 }, // 매출액
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '가스판매현황');
  XLSX.writeFile(wb, '가스_월별_판매데이터_표준양식.xlsx');
}

// Export Records to Excel with MoM and Item Summaries
export function exportRecordsToExcel(
  records: GasRecord[],
  monthlyTrends?: any[],
  itemSummaries?: any[],
  fileName = '가스_판매데이터_분석결과.xlsx'
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet 1: 상세 판매 데이터
  const exportData = records.map(r => ({
    '기준 월': r.month,
    '가스 품목명': r.item,
    '판매량 (단위)': r.volume,
    '매출액 (원)': r.revenue,
    '단위당 평균단가 (원)': r.unitPrice || (r.volume > 0 ? Math.round(r.revenue / r.volume) : 0),
  }));

  const ws1 = XLSX.utils.json_to_sheet(exportData);
  ws1['!cols'] = [
    { wch: 18 },
    { wch: 26 },
    { wch: 16 },
    { wch: 18 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, '상세_판매데이터');

  // 2. Sheet 2: 월별 추이 및 전월 대비 증감률 (MoM)
  if (monthlyTrends && monthlyTrends.length > 0) {
    const trendData = monthlyTrends.map((t, idx) => ({
      '기준 월': t.month,
      '총 매출액 (원)': t.totalRevenue,
      '전월 매출액 (원)': t.prevRevenue !== null && t.prevRevenue !== undefined ? t.prevRevenue : (idx === 0 ? '-' : 0),
      '전월 대비 증감액 (원)': t.momDiff !== null && t.momDiff !== undefined ? t.momDiff : '-',
      '전월 대비 증감률 (%)': t.momGrowth !== null && t.momGrowth !== undefined ? `${t.momGrowth > 0 ? `+${t.momGrowth}` : t.momGrowth}%` : '-',
      '총 판매량': t.totalVolume,
      '판매량 전월 증감률 (%)': t.momVolumeGrowth !== null && t.momVolumeGrowth !== undefined ? `${t.momVolumeGrowth > 0 ? `+${t.momVolumeGrowth}` : t.momVolumeGrowth}%` : '-',
    }));

    const ws2 = XLSX.utils.json_to_sheet(trendData);
    ws2['!cols'] = [
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 16 },
      { wch: 22 },
    ];
    XLSX.utils.book_append_sheet(wb, ws2, '월별추이_전월증감률');
  }

  // 3. Sheet 3: 품목별 성과 및 점유율
  if (itemSummaries && itemSummaries.length > 0) {
    const itemData = itemSummaries.map((it, idx) => ({
      '순위': idx + 1,
      '가스 품목명': it.item,
      '총 매출액 (원)': it.totalRevenue,
      '매출 비중 (%)': `${it.revenueShare}%`,
      '총 판매량': it.totalVolume,
      '판매량 비중 (%)': `${it.volumeShare}%`,
      '단위당 평균단가 (원)': it.avgUnitPrice,
      '최고 성수기 (피크월)': it.maxMonth || '-',
    }));

    const ws3 = XLSX.utils.json_to_sheet(itemData);
    ws3['!cols'] = [
      { wch: 8 },
      { wch: 26 },
      { wch: 18 },
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 20 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, ws3, '품목별_집계');
  }

  const finalFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  XLSX.writeFile(wb, finalFileName);
}

