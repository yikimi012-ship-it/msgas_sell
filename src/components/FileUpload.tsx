import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Sparkles, CheckCircle2, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ColumnMapping } from '../types/gas';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onLoadSample: () => void;
  onOpenMapping: () => void;
  onReset: () => void;
  isLoading: boolean;
  fileName?: string;
  rowCount?: number;
  mapping?: ColumnMapping;
  errorMessage?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onLoadSample,
  onOpenMapping,
  onReset,
  isLoading,
  fileName,
  rowCount,
  mapping,
  errorMessage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcess(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcess(file);
    }
  };

  const validateAndProcess = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => lowerName.endsWith(ext));
    if (!isValid) {
      alert('지원되는 파일 형식: .xlsx, .xls, .csv 엑셀 파일만 업로드할 수 있습니다.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      {/* If file is already uploaded, show Spotify-themed file card */}
      {fileName ? (
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-[#282828] border border-[#383838] flex items-center justify-center text-[#1ed760] shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-base tracking-tight">{fileName}</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30 flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    분석 완료 ({rowCount}행)
                  </span>
                </div>
                {mapping && (
                  <p className="text-xs text-[#b3b3b3] mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>열 매핑:</span>
                    <span className="text-white font-medium">월[{mapping.month}]</span> ·
                    <span className="text-white font-medium">품목[{mapping.item}]</span> ·
                    <span className="text-white font-medium">판매량[{mapping.volume}]</span> ·
                    <span className="text-white font-medium">매출액[{mapping.revenue}]</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={onOpenMapping}
                className="spotify-pill-secondary"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#539df5]" />
                <span>열 매핑 변경</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="spotify-pill-primary"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>다른 파일 업로드</span>
              </button>

              <button
                onClick={onReset}
                className="w-9 h-9 rounded-full bg-[#1f1f1f] hover:bg-[#282828] text-[#b3b3b3] hover:text-[#f3727f] border border-[#333333] transition-all flex items-center justify-center shrink-0"
                title="초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        /* Upload Drag & Drop Area with Spotify near-black styling */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
            isDragging
              ? 'border-[#1ed760] bg-[#1ed760]/10 shadow-[0_0_24px_rgba(30,215,96,0.2)]'
              : 'border-[#333333] bg-[#181818] hover:border-[#555555]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#1f1f1f] border border-[#333333] flex items-center justify-center text-[#1ed760] mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              <Upload className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
              월별 가스 판매 엑셀 파일(.xlsx, .xls) 업로드
            </h3>
            <p className="text-xs sm:text-sm text-[#b3b3b3] mb-5 max-w-md">
              <strong className="text-white font-semibold">월, 품목, 판매량, 매출액</strong> 열이 포함된 엑셀 파일을 드래그하거나 선택하세요.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="spotify-pill-primary cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
                <span>컴퓨터에서 파일 선택</span>
              </button>

              <button
                type="button"
                onClick={onLoadSample}
                disabled={isLoading}
                className="spotify-pill-secondary cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffa42b]" />
                <span>샘플 데이터로 시작</span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#b3b3b3]">
              <span>✓ 지원 형식: .xlsx, .xls, .csv</span>
              <span>✓ 컬럼 자동 감지</span>
              <span>✓ 브라우저 안전 처리</span>
            </div>
          </div>
        </div>
      )}

      {/* Error notification if any */}
      {errorMessage && (
        <div className="mt-3 bg-[#181818] border border-[#f3727f]/60 rounded-xl p-3.5 text-xs text-[#f3727f] flex items-center gap-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
