import React from 'react';
import { ItemSummaryData, MonthlyTrendData, SummaryMetrics } from '../types/gas';
import { formatKoreanNumber, formatKoreanWon, getItemColor } from '../utils/analytics';
import { Lightbulb, Snowflake, PieChart, Flame } from 'lucide-react';

interface InsightReportProps {
  metrics: SummaryMetrics;
  itemSummaries: ItemSummaryData[];
  monthlyTrends: MonthlyTrendData[];
}

export const InsightReport: React.FC<InsightReportProps> = ({
  metrics,
  itemSummaries,
  monthlyTrends,
}) => {
  // Seasonality check: Winter (11, 12, 1, 2월) vs Summer (6, 7, 8월)
  const winterMonths = monthlyTrends.filter(m => /11월|12월|0?1월|0?2월/.test(m.month));
  const summerMonths = monthlyTrends.filter(m => /0?6월|0?7월|0?8월/.test(m.month));

  const winterAvgRevenue =
    winterMonths.length > 0
      ? Math.round(winterMonths.reduce((acc, m) => acc + m.totalRevenue, 0) / winterMonths.length)
      : null;

  const summerAvgRevenue =
    summerMonths.length > 0
      ? Math.round(summerMonths.reduce((acc, m) => acc + m.totalRevenue, 0) / summerMonths.length)
      : null;

  // Top 2 concentration
  const top2Share = itemSummaries.slice(0, 2).reduce((acc, it) => acc + it.revenueShare, 0);

  // Highest unit price item
  const highestUnitPriceItem = [...itemSummaries].sort((a, b) => b.avgUnitPrice - a.avgUnitPrice)[0];

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#282828] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#ffa42b] border border-[#333333] flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">가스 판매 종합 분석 & 경영 인사이트</h3>
            <p className="text-xs text-[#b3b3b3]">
              품목별 수익 기여도, 계절별 수요 변동 및 단가 구조 분석 보고서
            </p>
          </div>
        </div>
        <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-[#1f1f1f] text-white border border-[#333333] uppercase tracking-wider">
          통계 모델
        </span>
      </div>

      {/* 3 Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Seasonality card */}
        <div className="bg-[#1f1f1f] border border-[#282828] rounded-xl p-4 space-y-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 text-[#539df5] text-xs font-bold uppercase tracking-wider">
            <Snowflake className="w-4 h-4" />
            <span>계절성(동절기 vs 하절기) 패턴</span>
          </div>
          {winterAvgRevenue && summerAvgRevenue ? (
            <div>
              <div className="text-sm text-[#b3b3b3]">
                동절기 월평균: <strong className="text-white font-mono">{formatKoreanWon(winterAvgRevenue, true)}</strong>
              </div>
              <div className="text-sm text-[#b3b3b3] mt-1">
                하절기 월평균: <strong className="text-white font-mono">{formatKoreanWon(summerAvgRevenue, true)}</strong>
              </div>
              <p className="text-xs text-[#b3b3b3] mt-2">
                {winterAvgRevenue > summerAvgRevenue
                  ? `동절기 난방 및 산업 가열 수요로 인해 하절기 대비 약 ${Math.round(((winterAvgRevenue - summerAvgRevenue) / summerAvgRevenue) * 100)}% 높은 매출을 기록했습니다.`
                  : '하절기 탄산/공업용 특수가스 등의 안정적인 가동률이 유지되고 있습니다.'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#b3b3b3]">월별 시계열 데이터 누적으로 계절 변동을 분석합니다.</p>
          )}
        </div>

        {/* Revenue Concentration */}
        <div className="bg-[#1f1f1f] border border-[#282828] rounded-xl p-4 space-y-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 text-[#b388ff] text-xs font-bold uppercase tracking-wider">
            <PieChart className="w-4 h-4" />
            <span>상위 품목 매출 집중도</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">
              {top2Share.toFixed(1)}%
            </div>
            <p className="text-xs text-[#b3b3b3] mt-1">
              상위 2개 품목(
              <span className="text-white font-bold">{itemSummaries[0]?.item}</span>,{' '}
              <span className="text-white font-bold">{itemSummaries[1]?.item}</span>
              )이 전체 매출의 {top2Share.toFixed(1)}%를 차지하고 있습니다.
            </p>
          </div>
        </div>

        {/* High margin / unit price item */}
        <div className="bg-[#1f1f1f] border border-[#282828] rounded-xl p-4 space-y-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 text-[#1ed760] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>최고 공급 단가 품목</span>
          </div>
          {highestUnitPriceItem ? (
            <div>
              <div className="text-base font-bold text-white truncate" title={highestUnitPriceItem.item}>
                {highestUnitPriceItem.item}
              </div>
              <div className="text-sm font-bold text-[#1ed760] font-mono mt-0.5">
                평균 {formatKoreanNumber(highestUnitPriceItem.avgUnitPrice)}원 / 단위
              </div>
              <p className="text-xs text-[#b3b3b3] mt-1.5">
                단위당 부가가치가 가장 높은 품목으로 안정적 마진 기여도가 높습니다.
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#b3b3b3]">-</p>
          )}
        </div>
      </div>

      {/* Item Summary Table in Spotify Style */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide text-[12px]">
          <span>품목별 성과 분석 매트릭스</span>
          <span className="text-xs font-normal text-[#b3b3b3] normal-case">(매출액, 판매량, 공급단가, 피크월 종합)</span>
        </h4>

        <div className="overflow-x-auto rounded-xl border border-[#282828]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1f1f1f] text-[#b3b3b3] uppercase tracking-wider text-[11px] border-b border-[#282828]">
              <tr>
                <th className="py-3 px-3">순위</th>
                <th className="py-3 px-3">가스 품목명</th>
                <th className="py-3 px-3 text-right">총 매출액 (원)</th>
                <th className="py-3 px-3 text-right">매출 비중</th>
                <th className="py-3 px-3 text-right">총 판매량</th>
                <th className="py-3 px-3 text-right">평균 단가</th>
                <th className="py-3 px-3 text-center">최고 성수기(피크월)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828] bg-[#181818]">
              {itemSummaries.map((it, idx) => (
                <tr key={it.item} className="hover:bg-[#202020] transition">
                  <td className="py-3 px-3 font-bold text-[#b3b3b3]">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: getItemColor(it.item, idx) }}
                    ></span>
                    <span>{it.item}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#1ed760] font-bold">
                    {formatKoreanWon(it.totalRevenue)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-[#282828] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#1ed760] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, it.revenueShare)}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-white w-10 text-right font-semibold">{it.revenueShare}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-white">
                    {formatKoreanNumber(it.totalVolume)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#b3b3b3]">
                    {formatKoreanNumber(it.avgUnitPrice)}원
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1f1f1f] text-[#ffa42b] border border-[#282828] font-bold text-[11px]">
                      {it.maxMonth || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly MoM Growth Analysis Table in Spotify Style */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide text-[12px]">
          <span>월별 매출 및 전월 대비 증감률(MoM) 명세표</span>
          <span className="text-xs font-normal text-[#b3b3b3] normal-case">(매출액 증감, 판매량 증감률 종합)</span>
        </h4>

        <div className="overflow-x-auto rounded-xl border border-[#282828]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1f1f1f] text-[#b3b3b3] uppercase tracking-wider text-[11px] border-b border-[#282828]">
              <tr>
                <th className="py-3 px-3">기준 월</th>
                <th className="py-3 px-3 text-right">당월 총 매출액</th>
                <th className="py-3 px-3 text-right">전월 매출액</th>
                <th className="py-3 px-3 text-right">전월 대비 증감액</th>
                <th className="py-3 px-3 text-center">전월 대비 증감률 (MoM)</th>
                <th className="py-3 px-3 text-right">총 판매량</th>
                <th className="py-3 px-3 text-center">판매량 증감률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828] bg-[#181818]">
              {monthlyTrends.map((t, idx) => {
                const hasMoM = t.momGrowth !== null && t.momGrowth !== undefined;
                const isUp = hasMoM && (t.momGrowth as number) >= 0;
                const hasVol = t.momVolumeGrowth !== null && t.momVolumeGrowth !== undefined;
                const isVolUp = hasVol && (t.momVolumeGrowth as number) >= 0;

                return (
                  <tr key={t.month} className="hover:bg-[#202020] transition">
                    <td className="py-3 px-3 font-bold text-white">{t.month}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#1ed760] font-bold">
                      {formatKoreanWon(t.totalRevenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#b3b3b3]">
                      {t.prevRevenue ? formatKoreanWon(t.prevRevenue) : (idx === 0 ? '-' : '0원')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {t.momDiff !== null && t.momDiff !== undefined ? (
                        <span className={t.momDiff >= 0 ? 'text-[#1ed760] font-semibold' : 'text-[#f3727f] font-semibold'}>
                          {t.momDiff >= 0 ? `+${formatKoreanWon(t.momDiff)}` : formatKoreanWon(t.momDiff)}
                        </span>
                      ) : (
                        <span className="text-[#7c7c7c]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      {hasMoM ? (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isUp
                              ? 'bg-[#1ed760]/20 text-[#1ed760] border border-[#1ed760]/30'
                              : 'bg-[#f3727f]/20 text-[#f3727f] border border-[#f3727f]/30'
                          }`}
                        >
                          {isUp ? `+${t.momGrowth}%` : `${t.momGrowth}%`}
                        </span>
                      ) : (
                        <span className="text-[#7c7c7c] text-[11px]">- (기준 시작월)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-white">
                      {formatKoreanNumber(t.totalVolume)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      {hasVol ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            isVolUp
                              ? 'text-[#539df5]'
                              : 'text-[#b3b3b3]'
                          }`}
                        >
                          {isVolUp ? `+${t.momVolumeGrowth}%` : `${t.momVolumeGrowth}%`}
                        </span>
                      ) : (
                        <span className="text-[#7c7c7c] text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
