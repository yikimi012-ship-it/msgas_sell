import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ItemSummaryData } from '../types/gas';
import { formatKoreanNumber, formatKoreanWon, getItemColor } from '../utils/analytics';
import { BarChart3, AlignLeft } from 'lucide-react';

interface ItemBarChartProps {
  data: ItemSummaryData[];
}

export const ItemBarChart: React.FC<ItemBarChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<'revenue' | 'volume'>('revenue');
  const [sortOrder, setSortOrder] = useState<'high' | 'low' | 'name'>('high');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('vertical');

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 text-center text-[#b3b3b3]">
        품목별 차트를 표시할 데이터가 없습니다.
      </div>
    );
  }

  // Sort data copy
  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === 'high') {
      return metric === 'revenue' ? b.totalRevenue - a.totalRevenue : b.totalVolume - a.totalVolume;
    }
    if (sortOrder === 'low') {
      return metric === 'revenue' ? a.totalRevenue - b.totalRevenue : a.totalVolume - b.totalVolume;
    }
    return a.item.localeCompare(b.item, 'ko-KR');
  });

  const formatAxis = (value: number) => {
    if (metric === 'revenue') {
      if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(1)}억`;
      if (value >= 10_000) return `${Math.round(value / 10_000).toLocaleString()}만`;
      return `${value}원`;
    }
    return formatKoreanNumber(value);
  };

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#539df5] border border-[#333333] flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">품목별 판매 비교 막대 차트</h3>
              <p className="text-xs text-[#b3b3b3]">
                가스 종류별 총 {metric === 'revenue' ? '매출액 및 비중(%)' : '판매량 및 비중(%)'} 비교
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
          {/* Metric toggle */}
          <div className="flex items-center bg-[#1f1f1f] p-1 rounded-full border border-[#282828] text-xs">
            <button
              onClick={() => setMetric('revenue')}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                metric === 'revenue'
                  ? 'bg-[#1ed760] text-black shadow-sm'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              매출액(원)
            </button>
            <button
              onClick={() => setMetric('volume')}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                metric === 'volume'
                  ? 'bg-[#1ed760] text-black shadow-sm'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              판매량(단위)
            </button>
          </div>

          {/* Orientation toggle */}
          <div className="flex items-center bg-[#1f1f1f] p-1 rounded-full border border-[#282828] text-xs">
            <button
              onClick={() => setLayout('vertical')}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                layout === 'vertical'
                  ? 'bg-white text-black'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
              title="세로 막대"
            >
              세로
            </button>
            <button
              onClick={() => setLayout('horizontal')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                layout === 'horizontal'
                  ? 'bg-white text-black'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
              title="가로 막대"
            >
              <AlignLeft className="w-3 h-3" />
              가로
            </button>
          </div>

          {/* Sort selector in Pill */}
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'high' | 'low' | 'name')}
            className="bg-[#1f1f1f] border border-[#333333] rounded-full px-3 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider focus:outline-none focus:border-white transition"
          >
            <option value="high">높은 순 정렬</option>
            <option value="low">낮은 순 정렬</option>
            <option value="name">품목명 순</option>
          </select>
        </div>
      </div>

      {/* Chart container */}
      <div className={`${layout === 'horizontal' ? 'h-[400px]' : 'h-[340px]'} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          {layout === 'vertical' ? (
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 20, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#282828" opacity={0.8} />
              <XAxis
                dataKey="item"
                stroke="#7c7c7c"
                tick={{ fontSize: 11, fill: '#b3b3b3' }}
                interval={0}
                tickFormatter={str => (str.length > 8 ? `${str.slice(0, 7)}…` : str)}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke="#7c7c7c"
                tickFormatter={formatAxis}
                tick={{ fontSize: 12, fill: '#b3b3b3' }}
                width={70}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload as ItemSummaryData;
                    return (
                      <div className="bg-[#282828] border border-[#383838] rounded-lg p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white text-xs space-y-1.5">
                        <div className="font-bold text-white border-b border-[#383838] pb-1.5 flex items-center justify-between gap-4">
                          <span>{row.item}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1f1f1f] text-[#1ed760] border border-[#333333]">
                            점유율: {metric === 'revenue' ? `${row.revenueShare}%` : `${row.volumeShare}%`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#b3b3b3]">총 매출액:</span>
                          <span className="font-bold text-[#1ed760] font-mono">
                            {formatKoreanWon(row.totalRevenue, true)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#b3b3b3]">총 판매량:</span>
                          <span className="font-bold text-white font-mono">
                            {formatKoreanNumber(row.totalVolume)} 단위
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[#b3b3b3] text-[11px]">
                          <span>단위당 평균단가:</span>
                          <span className="text-white font-mono">{formatKoreanNumber(row.avgUnitPrice)}원/단위</span>
                        </div>
                        {row.maxMonth && (
                          <div className="flex items-center justify-between gap-4 text-[#b3b3b3] text-[11px] pt-1.5 border-t border-[#383838]">
                            <span>최고 판매 달:</span>
                            <span className="text-[#ffa42b] font-semibold">{row.maxMonth}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey={metric === 'revenue' ? 'totalRevenue' : 'totalVolume'}
                radius={[6, 6, 0, 0]}
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getItemColor(entry.item, index)}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            /* Horizontal Bar */
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#282828" opacity={0.8} />
              <XAxis
                type="number"
                stroke="#7c7c7c"
                tickFormatter={formatAxis}
                tick={{ fontSize: 11, fill: '#b3b3b3' }}
              />
              <YAxis
                type="category"
                dataKey="item"
                stroke="#7c7c7c"
                tick={{ fontSize: 12, fill: '#ffffff' }}
                width={120}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload as ItemSummaryData;
                    return (
                      <div className="bg-[#282828] border border-[#383838] rounded-lg p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white text-xs space-y-1.5">
                        <div className="font-bold text-white border-b border-[#383838] pb-1.5 flex items-center justify-between gap-4">
                          <span>{row.item}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1f1f1f] text-[#1ed760] border border-[#333333]">
                            점유율: {metric === 'revenue' ? `${row.revenueShare}%` : `${row.volumeShare}%`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#b3b3b3]">총 매출액:</span>
                          <span className="font-bold text-[#1ed760] font-mono">
                            {formatKoreanWon(row.totalRevenue, true)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#b3b3b3]">총 판매량:</span>
                          <span className="font-bold text-white font-mono">
                            {formatKoreanNumber(row.totalVolume)} 단위
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[#b3b3b3] text-[11px]">
                          <span>단위당 평균단가:</span>
                          <span className="text-white font-mono">{formatKoreanNumber(row.avgUnitPrice)}원</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey={metric === 'revenue' ? 'totalRevenue' : 'totalVolume'}
                radius={[0, 6, 6, 0]}
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-h-${index}`}
                    fill={getItemColor(entry.item, index)}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Item Share Badges in Spotify Pill style */}
      <div className="mt-4 pt-3 border-t border-[#282828] flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#b3b3b3] font-bold uppercase tracking-wider text-[11px]">품목별 비중:</span>
        {sortedData.map((item, idx) => (
          <div
            key={item.item}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1f1f] border border-[#282828] text-xs transition hover:bg-[#252525]"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getItemColor(item.item, idx) }}
            ></span>
            <span className="text-white font-medium">{item.item}</span>
            <span className="font-bold text-[#b3b3b3] font-mono">{item.revenueShare}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
