/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { GasRecord, ColumnMapping } from './types/gas';
import { getSampleGasRecords } from './utils/sampleData';
import {
  parseExcelFile,
  downloadSampleExcel,
  exportRecordsToExcel,
} from './utils/excelParser';
import {
  calculateSummaryMetrics,
  calculateMonthlyTrends,
  calculateItemSummaries,
} from './utils/analytics';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { SummaryCards } from './components/SummaryCards';
import { MonthlyLineChart } from './components/MonthlyLineChart';
import { ItemBarChart } from './components/ItemBarChart';
import { InsightReport } from './components/InsightReport';
import { DataTable } from './components/DataTable';
import { ColumnMappingModal } from './components/ColumnMappingModal';
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  TableProperties,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';

export default function App() {
  // Main Data States
  const [records, setRecords] = useState<GasRecord[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('2024년도_가스판매실적_기본샘플.xlsx');
  const [availableColumns, setAvailableColumns] = useState<string[]>([
    '월',
    '품목',
    '판매량',
    '매출액',
  ]);
  const [currentMapping, setCurrentMapping] = useState<ColumnMapping>({
    month: '월',
    item: '품목',
    volume: '판매량',
    revenue: '매출액',
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'charts' | 'insights' | 'table'>('dashboard');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('ALL');
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize with sample gas dataset on startup so user sees full visualization immediately
  useEffect(() => {
    const sample = getSampleGasRecords();
    setRecords(sample);
  }, []);

  // Filtered Records based on Month selector
  const filteredRecords = useMemo(() => {
    if (selectedMonthFilter === 'ALL') return records;
    return records.filter(r => r.month === selectedMonthFilter);
  }, [records, selectedMonthFilter]);

  // Derived Analytics
  const metrics = useMemo(() => {
    return calculateSummaryMetrics(filteredRecords);
  }, [filteredRecords]);

  const monthlyTrends = useMemo(() => {
    return calculateMonthlyTrends(filteredRecords);
  }, [filteredRecords]);

  const itemSummaries = useMemo(() => {
    return calculateItemSummaries(filteredRecords);
  }, [filteredRecords]);

  const uniqueItemNames = useMemo(() => {
    return Array.from(new Set(filteredRecords.map(r => r.item)));
  }, [filteredRecords]);

  const allUniqueMonths = useMemo(() => {
    return Array.from(new Set(records.map(r => r.month)));
  }, [records]);

  // File Upload Handler
  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await parseExcelFile(file);
      setRecords(result.records);
      setAvailableColumns(result.columns);
      setCurrentMapping(result.detectedMapping);
      setFileName(file.name);
      setCurrentFile(file);
      setSelectedMonthFilter('ALL');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '엑셀 파일을 처리하는 중 오류가 발생했습니다.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-parse with custom mapping
  const handleApplyMapping = async (newMapping: ColumnMapping) => {
    if (!currentFile) {
      setCurrentMapping(newMapping);
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await parseExcelFile(currentFile, newMapping);
      setRecords(result.records);
      setCurrentMapping(newMapping);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '매핑을 적용하는 중 오류가 발생했습니다.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Sample Gas Data
  const handleLoadSample = () => {
    const sample = getSampleGasRecords();
    setRecords(sample);
    setFileName('2024년도_가스판매실적_기본샘플.xlsx');
    setCurrentFile(null);
    setAvailableColumns(['월', '품목', '판매량', '매출액']);
    setCurrentMapping({
      month: '월',
      item: '품목',
      volume: '판매량',
      revenue: '매출액',
    });
    setSelectedMonthFilter('ALL');
    setErrorMessage(null);
  };

  // Reset Data
  const handleReset = () => {
    setRecords([]);
    setFileName('');
    setCurrentFile(null);
    setSelectedMonthFilter('ALL');
  };

  // CRUD for DataTable
  const handleAddRecord = (newRec: Omit<GasRecord, 'id'>) => {
    const record: GasRecord = {
      ...newRec,
      id: `manual-${Date.now()}`,
    };
    setRecords(prev => [record, ...prev]);
  };

  const handleUpdateRecord = (updated: GasRecord) => {
    setRecords(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Export Comprehensive Multi-sheet Excel
  const handleExportExcel = () => {
    if (records.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    exportRecordsToExcel(
      filteredRecords,
      monthlyTrends,
      itemSummaries,
      `가스판매_분석결과_${fileName ? fileName.replace(/\.[^/.]+$/, '') : '데이터'}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onLoadSample={handleLoadSample}
        onDownloadTemplate={downloadSampleExcel}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
        hasData={records.length > 0}
        fileName={fileName}
        recordCount={records.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Upload & File Status Section */}
        <div className="no-print">
          <FileUpload
            onFileSelect={handleFileSelect}
            onLoadSample={handleLoadSample}
            onOpenMapping={() => setIsMappingModalOpen(true)}
            onReset={handleReset}
            isLoading={isLoading}
            fileName={fileName}
            rowCount={records.length}
            mapping={records.length > 0 ? currentMapping : undefined}
            errorMessage={errorMessage}
          />
        </div>

        {records.length > 0 && metrics ? (
          <>
            {/* Filter & Navigation Bar */}
            <div className="no-print bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md backdrop-blur-sm">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  종합 대시보드
                </button>

                <button
                  onClick={() => setActiveTab('charts')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    activeTab === 'charts'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  차트 심층 분석
                </button>

                <button
                  onClick={() => setActiveTab('insights')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    activeTab === 'insights'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  계절성 & 경영 인사이트
                </button>

                <button
                  onClick={() => setActiveTab('table')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    activeTab === 'table'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <TableProperties className="w-4 h-4" />
                  데이터 원본 ({records.length})
                </button>
              </div>

              {/* Month Global Filter & Export Excel Button */}
              <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-blue-400" />
                  <span>기간 필터:</span>
                </div>
                <select
                  value={selectedMonthFilter}
                  onChange={e => setSelectedMonthFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">전체 기간 ({allUniqueMonths.length}개월)</option>
                  {allUniqueMonths.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer whitespace-nowrap"
                  title="분석 결과 및 전월대비 증감률을 엑셀 파일(.xlsx)로 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>결과 엑셀 다운로드</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: 1. Dashboard (All in one view) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* 1. Summary Cards: 최고, 최저, 평균값 요약 */}
                <SummaryCards metrics={metrics} />

                {/* 2. Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 월별 매출 꺾은선 차트 */}
                  <MonthlyLineChart data={monthlyTrends} items={uniqueItemNames} />

                  {/* 품목별 막대 차트 */}
                  <ItemBarChart data={itemSummaries} />
                </div>

                {/* 3. Seasonality and Insight Report */}
                <InsightReport
                  metrics={metrics}
                  itemSummaries={itemSummaries}
                  monthlyTrends={monthlyTrends}
                />
              </div>
            )}

            {/* TAB CONTENT: 2. Charts Only */}
            {activeTab === 'charts' && (
              <div className="space-y-6">
                <MonthlyLineChart data={monthlyTrends} items={uniqueItemNames} />
                <ItemBarChart data={itemSummaries} />
              </div>
            )}

            {/* TAB CONTENT: 3. Insights Only */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <SummaryCards metrics={metrics} />
                <InsightReport
                  metrics={metrics}
                  itemSummaries={itemSummaries}
                  monthlyTrends={monthlyTrends}
                />
              </div>
            )}

            {/* TAB CONTENT: 4. Data Table */}
            {activeTab === 'table' && (
              <DataTable
                records={records}
                onAddRecord={handleAddRecord}
                onUpdateRecord={handleUpdateRecord}
                onDeleteRecord={handleDeleteRecord}
                onExportExcel={handleExportExcel}
              />
            )}
          </>
        ) : (
          /* Empty State when no records loaded */
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">가스 판매 데이터가 없습니다</h3>
            <p className="text-sm text-slate-400">
              상단의 엑셀 파일 업로드 영역에 파일을 끌어다 놓거나, 샘플 데이터를 불러와 분석을 시작해 보세요.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-600/30"
              >
                12개월 가스 판매 샘플 데이터 불러오기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Column Mapping Modal */}
      <ColumnMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        availableColumns={availableColumns}
        currentMapping={currentMapping}
        onApplyMapping={handleApplyMapping}
      />
    </div>
  );
}
