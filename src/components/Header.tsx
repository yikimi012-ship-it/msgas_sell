import React from 'react';
import { Flame, Download, FileSpreadsheet, RefreshCw, Printer } from 'lucide-react';

interface HeaderProps {
  onLoadSample: () => void;
  onDownloadTemplate: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  hasData: boolean;
  fileName?: string;
  recordCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadSample,
  onDownloadTemplate,
  onExportExcel,
  onPrint,
  hasData,
  fileName,
  recordCount,
}) => {
  return (
    <header className="bg-[#121212] border-b border-[#282828] text-white sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Logo & Brand in Spotify Style */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-[0_4px_12px_rgba(30,215,96,0.35)] shrink-0 transition-transform hover:scale-105 cursor-pointer">
              <Flame className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">가스 판매 데이터 분석</h1>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#1f1f1f] text-[#1ed760] border border-[#282828]">
                  LPG · LNG · 특수가스
                </span>
              </div>
              <p className="text-xs text-[#b3b3b3]">
                {hasData
                  ? `${fileName ? `현재 파일: ${fileName} (${recordCount}건)` : `샘플 데이터 로드됨 (${recordCount}건)`}`
                  : '엑셀 파일(.xlsx)을 업로드하여 차트 및 통계 요약을 분석하세요'}
              </p>
            </div>
          </div>

          {/* Action buttons (Spotify Pill buttons) */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={onLoadSample}
              className="spotify-pill-secondary"
              title="12개월 표준 가스 판매 샘플 데이터 불러오기"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#1ed760]" />
              <span>샘플 데이터</span>
            </button>

            <button
              onClick={onDownloadTemplate}
              className="spotify-pill-secondary"
              title="월, 품목, 판매량, 매출액 기본 엑셀 양식 다운로드"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#b3b3b3]" />
              <span>표준 양식 (.XLSX)</span>
            </button>

            {hasData && (
              <>
                <button
                  onClick={onExportExcel}
                  className="spotify-pill-primary"
                  title="현재 분석된 데이터 및 전월 대비 증감률을 엑셀 파일(.xlsx)로 다운로드"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>결과 엑셀 다운로드</span>
                </button>

                <button
                  onClick={onPrint}
                  className="spotify-pill-outline"
                  title="분석 보고서 인쇄 및 PDF 저장"
                >
                  <Printer className="w-3.5 h-3.5 text-[#b3b3b3]" />
                  <span>보고서 출력</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
