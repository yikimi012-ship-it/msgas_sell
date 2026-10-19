import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
  Bar,
  ReferenceLine,
  Cell,
} from 'recharts';
import { MonthlyTrendData } from '../types/gas';
import { formatKoreanNumber, formatKoreanWon, getItemColor } from '../utils/analytics';
import { TrendingUp, Layers, LineChart as LineIcon, Percent, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MonthlyLineChartProps {
  data: MonthlyTrendData[];
  items: string[];
}

export const MonthlyLineChart: React.FC<MonthlyLineChartProps> = ({ data, items }) => {
  const [metric, setMetric] = useState<'revenue' | 'volume'>('revenue');
  const [viewMode, setViewMode] = useState<'total' | 'byItem' | 'mom'>('total');

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 text-center text-[#b3b3b3]">
        월별 차트를 표시할 데이터가 없습니다.
      </div>
    );
  }

  // Format axis ticks
  const formatYAxis = (value: number) => {
    if (viewMode === 'mom') {
      return `${value}%`;
    }
    if (metric === 'revenue') {
      if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(1)}억`;
      if (value >= 10_000) return `${Math.round(value / 10_000).toLocaleString()}만`;
      return `${value}원`;
    }
    return formatKoreanNumber(value);
  };

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)] space-y-4">
      {/* Chart Header & Controls in Spotify Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#1ed760] border border-[#333333] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">월별 매출 및 추이 꺾은선 차트</h3>
              <p className="text-xs text-[#b3b3b3]">
                {viewMode === 'total' && '월별 전체 누적 매출 추이와 전월 대비(MoM) 증감 흐름'}
                {viewMode === 'byItem' && '가스 품목별 개별 월간 매출 변화 비교'}
                {viewMode === 'mom' && '월별 전월 대비(MoM) 성장률 및 매출 증감률 변동 추이'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls - Spotify Pill Switchers */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#1f1f1f] p-1 rounded-full border border-[#282828] text-xs">
            <button
              onClick={() => setViewMode('total')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                viewMode === 'total'
                  ? 'bg-[#1ed760] text-black shadow-sm'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              <LineIcon className="w-3.5 h-3.5" />
              전체 총계
            </button>
            <button
              onClick={() => setViewMode('byItem')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                viewMode === 'byItem'
                  ? 'bg-[#1ed760] text-black shadow-sm'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              품목별 비교
            </button>
            <button
              onClick={() => setViewMode('mom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                viewMode === 'mom'
                  ? 'bg-[#1ed760] text-black shadow-sm'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
              title="전월 대비 증감률(%) 집중 차트"
            >
              <Percent className="w-3.5 h-3.5" />
              MoM 증감률
            </button>
          </div>

          {/* Metric toggle */}
          {viewMode !== 'mom' && (
            <div className="flex items-center bg-[#1f1f1f] p-1 rounded-full border border-[#282828] text-xs">
              <button
                onClick={() => setMetric('revenue')}
                className={`px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                  metric === 'revenue'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#b3b3b3] hover:text-white'
                }`}
              >
                매출액(원)
              </button>
              <button
                onClick={() => setMetric('volume')}
                className={`px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition ${
                  metric === 'volume'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#b3b3b3] hover:text-white'
                }`}
              >
                판매량(단위)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart container */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'total' ? (
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="spotifyRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1ed760" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1ed760" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="spotifyVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#539df5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#539df5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#282828" opacity={0.8} />
              <XAxis
                dataKey="month"
                stroke="#7c7c7c"
                tick={{ fontSize: 12, fill: '#b3b3b3' }}
                tickMargin={8}
              />
              <YAxis
                stroke="#7c7c7c"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: '#b3b3b3' }}
                tickMargin={8}
                width={70}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload as MonthlyTrendData;
                    const val = metric === 'revenue' ? row.totalRevenue : row.totalVolume;
                    return (
                      <div className="bg-[#282828] border border-[#383838] rounded-lg p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white text-xs space-y-1.5">
                        <div className="font-bold text-white border-b border-[#383838] pb-1.5 flex items-center justify-between gap-4">
                          <span>{label}</span>
                          {row.momGrowth !== null && row.momGrowth !== undefined ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 ${
                                row.momGrowth >= 0
                                  ? 'bg-[#1ed760]/20 text-[#1ed760]'
                                  : 'bg-[#f3727f]/20 text-[#f3727f]'
                              }`}
                            >
                              {row.momGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              전월 대비 {row.momGrowth >= 0 ? `+${row.momGrowth}%` : `${row.momGrowth}%`}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#7c7c7c]">(기준 시작월)</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#b3b3b3]">
                            {metric === 'revenue' ? '총 매출액:' : '총 판매량:'}
                          </span>
                          <span className="font-bold text-[#1ed760] font-mono">
                            {metric === 'revenue' ? formatKoreanWon(val) : `${formatKoreanNumber(val)} 단위`}
                          </span>
                        </div>
                        {metric === 'revenue' && (
                          <div className="flex items-center justify-between gap-4 text-[#b3b3b3] text-[11px]">
                            <span>(간편 표기):</span>
                            <span className="text-white">{formatKoreanWon(val, true)}</span>
                          </div>
                        )}
                        {row.momDiff !== null && row.momDiff !== undefined && (
                          <div className="flex items-center justify-between gap-4 text-[#b3b3b3] text-[11px]">
                            <span>전월 대비 증감액:</span>
                            <span className={`font-mono font-semibold ${row.momDiff >= 0 ? 'text-[#1ed760]' : 'text-[#f3727f]'}`}>
                              {row.momDiff >= 0 ? `+${formatKoreanWon(row.momDiff, true)}` : formatKoreanWon(row.momDiff, true)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={metric === 'revenue' ? 'totalRevenue' : 'totalVolume'}
                stroke={metric === 'revenue' ? '#1ed760' : '#539df5'}
                strokeWidth={3}
                fill={metric === 'revenue' ? 'url(#spotifyRevenueGrad)' : 'url(#spotifyVolumeGrad)'}
                name={metric === 'revenue' ? '총 매출액' : '총 판매량'}
              />
              <Line
                type="monotone"
                dataKey={metric === 'revenue' ? 'totalRevenue' : 'totalVolume'}
                stroke={metric === 'revenue' ? '#1ed760' : '#539df5'}
                strokeWidth={3}
                dot={{ r: 4, fill: '#1ed760', stroke: '#121212', strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : viewMode === 'mom' ? (
            /* Dedicated MoM Growth Rate Bar & Line Chart in Spotify Green & Red */
            <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#282828" opacity={0.8} />
              <ReferenceLine y={0} stroke="#4d4d4d" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                stroke="#7c7c7c"
                tick={{ fontSize: 12, fill: '#b3b3b3' }}
                tickMargin={8}
              />
              <YAxis
                stroke="#7c7c7c"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: '#b3b3b3' }}
                tickMargin={8}
                width={60}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload as MonthlyTrendData;
                    return (
                      <div className="bg-[#282828] border border-[#383838] rounded-lg p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white text-xs space-y-1.5">
                        <div className="font-bold text-white border-b border-[#383838] pb-1.5">
                          {label} 전월 대비 분석
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#b3b3b3]">전월 대비 증감률:</span>
                          <span className={`font-bold font-mono text-sm ${
                            row.momGrowth === null || row.momGrowth === undefined
                              ? 'text-[#b3b3b3]'
                              : row.momGrowth >= 0 ? 'text-[#1ed760]' : 'text-[#f3727f]'
                          }`}>
                            {row.momGrowth !== null && row.momGrowth !== undefined
                              ? `${row.momGrowth >= 0 ? `+${row.momGrowth}%` : `${row.momGrowth}%`}`
                              : '기준월 (0%)'}
                          </span>
                        </div>
                        {row.momDiff !== null && row.momDiff !== undefined && (
                          <div className="flex items-center justify-between gap-4 text-[#b3b3b3] text-[11px]">
                            <span>전월 대비 증감액:</span>
                            <span className={`font-mono font-semibold ${row.momDiff >= 0 ? 'text-[#1ed760]' : 'text-[#f3727f]'}`}>
                              {row.momDiff >= 0 ? `+${formatKoreanWon(row.momDiff, true)}` : formatKoreanWon(row.momDiff, true)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-4 text-[#b3b3b3] text-[11px] pt-1.5 border-t border-[#383838]">
                          <span>당월 총 매출액:</span>
                          <span className="text-white font-mono font-semibold">{formatKoreanWon(row.totalRevenue, true)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="momGrowth" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`mom-bar-${index}`}
                    fill={
                      entry.momGrowth === null || entry.momGrowth === undefined
                        ? '#4d4d4d'
                        : entry.momGrowth >= 0
                        ? '#1ed760'
                        : '#f3727f'
                    }
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="momGrowth"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ r: 4, fill: '#1ed760' }}
              />
            </ComposedChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#282828" opacity={0.8} />
              <XAxis
                dataKey="month"
                stroke="#7c7c7c"
                tick={{ fontSize: 12, fill: '#b3b3b3' }}
                tickMargin={8}
              />
              <YAxis
                stroke="#7c7c7c"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: '#b3b3b3' }}
                tickMargin={8}
                width={70}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#282828] border border-[#383838] rounded-lg p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white text-xs space-y-1.5 max-w-xs">
                        <div className="font-bold text-white border-b border-[#383838] pb-1.5">
                          {label} 품목별 내역
                        </div>
                        {payload.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: entry.color }}
                              ></span>
                              <span className="text-[#b3b3b3] truncate">{entry.name}:</span>
                            </div>
                            <span className="font-semibold text-white font-mono shrink-0">
                              {typeof entry.value === 'number'
                                ? formatKoreanWon(entry.value, true)
                                : '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span className="text-xs text-[#b3b3b3]">{value}</span>}
              />
              {items.map((item, idx) => (
                <Line
                  key={item}
                  type="monotone"
                  dataKey={item}
                  name={item}
                  stroke={getItemColor(item, idx)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Visual MoM Timeline Badges Bar in Spotify Card style */}
      <div className="pt-3 border-t border-[#282828]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Percent className="w-3.5 h-3.5 text-[#1ed760]" />
            월별 전월 대비(MoM) 증감률 타임라인
          </span>
          <span className="text-[11px] text-[#7c7c7c]">
            초록: 상승 (▲) / 빨강: 하락 (▼)
          </span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex items-center gap-2 min-w-max">
            {data.map((m, idx) => {
              const hasMoM = m.momGrowth !== null && m.momGrowth !== undefined;
              const isUp = hasMoM && (m.momGrowth as number) >= 0;

              return (
                <div
                  key={m.month}
                  className="bg-[#1f1f1f] hover:bg-[#252525] border border-[#282828] rounded-lg p-2.5 text-center min-w-[105px] shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition"
                >
                  <div className="text-[11px] font-bold text-[#b3b3b3] truncate">{m.month}</div>
                  <div className="text-xs font-bold text-white font-mono mt-0.5">
                    {formatKoreanWon(m.totalRevenue, true)}
                  </div>
                  <div className="mt-1.5">
                    {idx === 0 || !hasMoM ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#282828] text-[#7c7c7c]">
                        <Minus className="w-2.5 h-2.5" /> 기준월
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isUp
                            ? 'bg-[#1ed760]/20 text-[#1ed760] border border-[#1ed760]/30'
                            : 'bg-[#f3727f]/20 text-[#f3727f] border border-[#f3727f]/30'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? `+${m.momGrowth}%` : `${m.momGrowth}%`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
