import React from 'react';
import { SummaryMetrics } from '../types/gas';
import { formatKoreanWon, formatKoreanNumber } from '../utils/analytics';
import { TrendingUp, TrendingDown, DollarSign, Package, Award, Sparkles, Scale, Calendar } from 'lucide-react';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      {/* Primary KPI Row - Spotify Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 누적 총 매출액 & 월평균 매출액 */}
        <div className="bg-[#181818] hover:bg-[#202020] border border-[#282828] rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px]">누적 총 매출액</span>
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#1ed760] flex items-center justify-center border border-[#333333]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatKoreanWon(metrics.totalRevenue, true)}
          </div>
          <p className="text-xs text-[#b3b3b3] mt-1 font-mono">
            {formatKoreanWon(metrics.totalRevenue)}
          </p>
          <div className="mt-4 pt-3 border-t border-[#282828] flex items-center justify-between text-xs">
            <span className="text-[#b3b3b3] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1ed760]"></span>
              월평균 매출액
            </span>
            <span className="font-bold text-white">
              {formatKoreanWon(metrics.avgMonthlyRevenue, true)}
            </span>
          </div>
        </div>

        {/* 2. 최고 매출월 vs 최저 매출월 */}
        <div className="bg-[#181818] hover:bg-[#202020] border border-[#282828] rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px]">월별 최고 / 최저</span>
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#539df5] flex items-center justify-center border border-[#333333]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11px] text-[#1ed760] font-bold mb-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>최고 매출월</span>
              </div>
              <div className="text-base font-bold text-white">
                {metrics.maxMonthRevenue.month || '-'}
              </div>
              <div className="text-xs font-semibold text-[#1ed760]">
                {formatKoreanWon(metrics.maxMonthRevenue.revenue, true)}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-[#282828]"></div>
            <div>
              <div className="flex items-center gap-1 text-[11px] text-[#f3727f] font-bold mb-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>최저 매출월</span>
              </div>
              <div className="text-base font-bold text-white">
                {metrics.minMonthRevenue.month || '-'}
              </div>
              <div className="text-xs font-semibold text-[#f3727f]">
                {formatKoreanWon(metrics.minMonthRevenue.revenue, true)}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#282828] flex items-center justify-between text-xs">
            <span className="text-[#b3b3b3]">최고-최저 격차</span>
            <span className="font-semibold text-white">
              {formatKoreanWon(metrics.maxMonthRevenue.revenue - metrics.minMonthRevenue.revenue, true)}
            </span>
          </div>
        </div>

        {/* 3. 최고 매출 품목 (1등 가스) */}
        <div className="bg-[#181818] hover:bg-[#202020] border border-[#282828] rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px]">최고 매출 품목</span>
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#ffa42b] flex items-center justify-center border border-[#333333]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white truncate" title={metrics.maxItemRevenue.item}>
            {metrics.maxItemRevenue.item || '-'}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-white">
              {formatKoreanWon(metrics.maxItemRevenue.revenue, true)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1f1f1f] text-[#1ed760] border border-[#333333]">
              점유율 {metrics.maxItemRevenue.percentage.toFixed(1)}%
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#282828] flex items-center justify-between text-xs">
            <span className="text-[#b3b3b3]">최저 품목</span>
            <span className="font-medium text-[#b3b3b3] truncate max-w-[130px]" title={metrics.minItemRevenue.item}>
              {metrics.minItemRevenue.item} ({metrics.minItemRevenue.percentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* 4. 총 판매량 & 평균 공급 단가 */}
        <div className="bg-[#181818] hover:bg-[#202020] border border-[#282828] rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px]">누적 총 판매량</span>
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#539df5] flex items-center justify-center border border-[#333333]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatKoreanNumber(metrics.totalVolume)}
            <span className="text-sm font-normal text-[#b3b3b3] ml-1.5">단위</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#b3b3b3]">
            <span>월평균: <strong className="text-white">{formatKoreanNumber(metrics.avgMonthlyVolume)}</strong></span>
            <span>·</span>
            <span>총 {metrics.recordCount}건</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#282828] flex items-center justify-between text-xs">
            <span className="text-[#b3b3b3] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#539df5]" />
              평균 단위 단가
            </span>
            <span className="font-bold text-[#1ed760] font-mono">
              {formatKoreanNumber(metrics.avgUnitPrice)}원
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Stat Banner in Spotify Dark Theme */}
      <div className="bg-[#181818] border border-[#282828] rounded-xl p-4 sm:px-5 space-y-3 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#282828] pb-2.5">
          <div className="flex items-center gap-2 text-[#b3b3b3]">
            <Sparkles className="w-4 h-4 text-[#ffa42b] shrink-0" />
            <span className="font-bold text-white tracking-wide uppercase text-[11px]">가스 판매 핵심 지표:</span>
            <span>
              총 {metrics.uniqueMonthsCount}개월간 {metrics.uniqueItemsCount}개 품목 분석
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#b3b3b3]">
            <div>
              <span>최다 판매량 품목: </span>
              <strong className="text-white">{metrics.maxItemVolume.item}</strong>
              <span className="text-[#539df5] ml-1 font-mono">({formatKoreanNumber(metrics.maxItemVolume.volume)})</span>
            </div>
            <div className="hidden sm:inline text-[#383838]">|</div>
            <div>
              <span>단일 최고 거래: </span>
              <strong className="text-white">{metrics.maxSingleSale.month} {metrics.maxSingleSale.item}</strong>
              <span className="text-[#1ed760] ml-1 font-mono">({formatKoreanWon(metrics.maxSingleSale.revenue, true)})</span>
            </div>
          </div>
        </div>

        {/* MoM 전월 대비 증감률 핵심 요약 */}
        {metrics.maxMoMGrowth && metrics.minMoMGrowth && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#1f1f1f] text-[#1ed760] border border-[#333333] uppercase tracking-[1.4px]">
                MoM 성장률
              </span>
              <span className="font-semibold text-white">전월 대비 매출 증감률 현황:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[#b3b3b3]">최대 상승월:</span>
                <span className="text-white font-bold">{metrics.maxMoMGrowth.month}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30">
                  +{metrics.maxMoMGrowth.rate}% ({formatKoreanWon(metrics.maxMoMGrowth.diff, true)})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#b3b3b3]">최대 하락월:</span>
                <span className="text-white font-bold">{metrics.minMoMGrowth.month}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f3727f]/15 text-[#f3727f] border border-[#f3727f]/30">
                  {metrics.minMoMGrowth.rate}% ({formatKoreanWon(metrics.minMoMGrowth.diff, true)})
                </span>
              </div>

              {typeof metrics.avgMoMGrowth === 'number' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#b3b3b3]">월평균 증감률:</span>
                  <span className={`font-bold ${metrics.avgMoMGrowth >= 0 ? 'text-[#1ed760]' : 'text-[#f3727f]'}`}>
                    {metrics.avgMoMGrowth >= 0 ? `+${metrics.avgMoMGrowth}%` : `${metrics.avgMoMGrowth}%`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
