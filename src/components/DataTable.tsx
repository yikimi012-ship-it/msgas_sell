import React, { useState, useMemo } from 'react';
import { GasRecord } from '../types/gas';
import { formatKoreanNumber, formatKoreanWon, getItemColor } from '../utils/analytics';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  X,
  Download,
} from 'lucide-react';

interface DataTableProps {
  records: GasRecord[];
  onAddRecord: (record: Omit<GasRecord, 'id'>) => void;
  onUpdateRecord: (record: GasRecord) => void;
  onDeleteRecord: (id: string) => void;
  onExportExcel?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onExportExcel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof GasRecord>('month');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal / Inline Add state
  const [isAdding, setIsAdding] = useState(false);
  const [newMonth, setNewMonth] = useState('2024년 01월');
  const [newItem, setNewItem] = useState('');
  const [newVolume, setNewVolume] = useState<number | ''>('');
  const [newRevenue, setNewRevenue] = useState<number | ''>('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<GasRecord | null>(null);

  // Unique options for filters
  const uniqueMonths = useMemo(() => {
    return Array.from(new Set(records.map(r => r.month)));
  }, [records]);

  const uniqueItems = useMemo(() => {
    return Array.from(new Set(records.map(r => r.item)));
  }, [records]);

  // Filter & Sort
  const filteredRecords = useMemo(() => {
    return records
      .filter(r => {
        if (selectedMonth !== 'ALL' && r.month !== selectedMonth) return false;
        if (selectedItem !== 'ALL' && r.item !== selectedItem) return false;
        if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          return (
            r.month.toLowerCase().includes(lower) ||
            r.item.toLowerCase().includes(lower) ||
            String(r.volume).includes(lower) ||
            String(r.revenue).includes(lower)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || '').localeCompare(String(valB || ''), 'ko-KR')
          : String(valB || '').localeCompare(String(valA || ''), 'ko-KR');
      });
  }, [records, selectedMonth, selectedItem, searchTerm, sortField, sortAsc]);

  // Pagination slice
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const handleSort = (field: keyof GasRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default desc for numbers
    }
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonth || !newItem || newVolume === '' || newRevenue === '') {
      alert('모든 필드를 올바르게 입력해 주세요.');
      return;
    }
    const vol = Number(newVolume);
    const rev = Number(newRevenue);
    const unitPrice = vol > 0 ? Math.round(rev / vol) : 0;

    onAddRecord({
      month: newMonth,
      item: newItem,
      volume: vol,
      revenue: rev,
      unitPrice,
    });

    setIsAdding(false);
    setNewItem('');
    setNewVolume('');
    setNewRevenue('');
  };

  const startEdit = (row: GasRecord) => {
    setEditingId(row.id);
    setEditRow({ ...row });
  };

  const saveEdit = () => {
    if (editRow) {
      const vol = Number(editRow.volume);
      const rev = Number(editRow.revenue);
      onUpdateRecord({
        ...editRow,
        volume: vol,
        revenue: rev,
        unitPrice: vol > 0 ? Math.round(rev / vol) : 0,
      });
    }
    setEditingId(null);
    setEditRow(null);
  };

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)] space-y-4">
      {/* Header and Filter Controls in Spotify Style */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">가스 판매 상세 데이터 목록</h3>
          <p className="text-xs text-[#b3b3b3]">
            총 {records.length}건 중 {filteredRecords.length}건 검색됨 (직접 추가 및 수정 가능)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Spotify Pill Search input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-[#7c7c7c] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="월 또는 품목명 검색..."
              className="w-full bg-[#1f1f1f] text-white rounded-full pl-9 pr-3.5 py-1.5 text-xs placeholder-[#7c7c7c] border border-[#333333] shadow-[inset_0_1px_0_rgb(18,18,18)] focus:border-white focus:outline-none transition"
            />
          </div>

          {/* Month filter in Pill */}
          <select
            value={selectedMonth}
            onChange={e => {
              setSelectedMonth(e.target.value);
              setPage(1);
            }}
            className="bg-[#1f1f1f] border border-[#333333] rounded-full px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white transition"
          >
            <option value="ALL">전체 월</option>
            {uniqueMonths.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Item filter in Pill */}
          <select
            value={selectedItem}
            onChange={e => {
              setSelectedItem(e.target.value);
              setPage(1);
            }}
            className="bg-[#1f1f1f] border border-[#333333] rounded-full px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white max-w-[140px] truncate transition"
          >
            <option value="ALL">전체 품목</option>
            {uniqueItems.map(it => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>

          {/* Add record button (Spotify Green Pill) */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="spotify-pill-primary"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>데이터 추가</span>
          </button>

          {/* Export Excel button (Spotify Pill Secondary) */}
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="spotify-pill-secondary"
              title="현재 데이터 결과를 엑셀 파일(.xlsx)로 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-[#1ed760]" />
              <span>엑셀 다운로드</span>
            </button>
          )}
        </div>
      </div>

      {/* Add New Row Form */}
      {isAdding && (
        <form
          onSubmit={handleSaveNew}
          className="bg-[#1f1f1f] border border-[#1ed760]/40 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        >
          <div>
            <label className="block text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider mb-1">월 (Month)</label>
            <input
              type="text"
              value={newMonth}
              onChange={e => setNewMonth(e.target.value)}
              placeholder="예: 2024년 01월"
              className="w-full bg-[#121212] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider mb-1">품목명 (Item)</label>
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              placeholder="예: LPG(프로판)"
              className="w-full bg-[#121212] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider mb-1">판매량 (Volume)</label>
            <input
              type="number"
              value={newVolume}
              onChange={e => setNewVolume(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="예: 15000"
              className="w-full bg-[#121212] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider mb-1">매출액 (원)</label>
            <input
              type="number"
              value={newRevenue}
              onChange={e => setNewRevenue(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="예: 30000000"
              className="w-full bg-[#121212] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="w-full py-1.5 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold rounded-full text-xs uppercase tracking-wider transition"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="w-full py-1.5 bg-[#282828] hover:bg-[#333333] text-white font-bold rounded-full text-xs uppercase tracking-wider transition"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* Table in Spotify Style */}
      <div className="overflow-x-auto rounded-xl border border-[#282828]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1f1f1f] text-[#b3b3b3] uppercase tracking-wider text-[11px] border-b border-[#282828] select-none">
            <tr>
              <th
                onClick={() => handleSort('month')}
                className="py-3 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>기준 월</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#7c7c7c]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('item')}
                className="py-3 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>품목명</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#7c7c7c]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('volume')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>판매량 (단위)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#7c7c7c]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('revenue')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>매출액 (원)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#7c7c7c]" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">
                <span>단위당 평균단가</span>
              </th>
              <th className="py-3 px-4 text-center w-24">
                <span>관리</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282828] bg-[#181818]">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#7c7c7c]">
                  일치하는 가스 판매 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => {
                const isEditing = editingId === row.id;

                if (isEditing && editRow) {
                  return (
                    <tr key={row.id} className="bg-[#1f1f1f]">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={editRow.month}
                          onChange={e => setEditRow({ ...editRow, month: e.target.value })}
                          className="bg-[#121212] border border-[#333333] rounded px-2 py-1 text-xs text-white w-full"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={editRow.item}
                          onChange={e => setEditRow({ ...editRow, item: e.target.value })}
                          className="bg-[#121212] border border-[#333333] rounded px-2 py-1 text-xs text-white w-full"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={editRow.volume}
                          onChange={e => setEditRow({ ...editRow, volume: Number(e.target.value) })}
                          className="bg-[#121212] border border-[#333333] rounded px-2 py-1 text-xs text-white w-full text-right"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={editRow.revenue}
                          onChange={e => setEditRow({ ...editRow, revenue: Number(e.target.value) })}
                          className="bg-[#121212] border border-[#333333] rounded px-2 py-1 text-xs text-white w-full text-right"
                        />
                      </td>
                      <td className="py-2 px-3 text-right text-[#b3b3b3] font-mono">
                        {editRow.volume > 0 ? `${formatKoreanNumber(Math.round(editRow.revenue / editRow.volume))}원` : '-'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={saveEdit}
                            className="p-1 rounded-full text-[#1ed760] hover:bg-[#282828]"
                            title="저장"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded-full text-[#7c7c7c] hover:bg-[#282828]"
                            title="취소"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id} className="hover:bg-[#202020] transition">
                    <td className="py-3 px-4 font-bold text-white">
                      {row.month}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getItemColor(row.item, idx) }}
                        ></span>
                        <span>{row.item}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-white">
                      {formatKoreanNumber(row.volume)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#1ed760] font-bold">
                      {formatKoreanWon(row.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#b3b3b3]">
                      {row.unitPrice ? `${formatKoreanNumber(row.unitPrice)}원` : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => startEdit(row)}
                          className="w-7 h-7 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#282828] flex items-center justify-center transition"
                          title="수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(row.id)}
                          className="w-7 h-7 rounded-full text-[#b3b3b3] hover:text-[#f3727f] hover:bg-[#282828] flex items-center justify-center transition"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#b3b3b3] pt-2">
        <div className="flex items-center gap-2">
          <span>페이지당 항목:</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-[#1f1f1f] border border-[#333333] rounded-full px-3 py-1 text-xs text-white focus:outline-none"
          >
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={50}>50개</option>
            <option value={100}>100개</option>
          </select>
          <span className="text-[#7c7c7c]">
            (총 {filteredRecords.length}개 중{' '}
            {filteredRecords.length > 0 ? (page - 1) * pageSize + 1 : 0} ~{' '}
            {Math.min(page * pageSize, filteredRecords.length)} 표시)
          </span>
        </div>

        {/* Circular Pagination Controls in Spotify Style */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#333333] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#282828] transition flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-white font-mono px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#333333] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#282828] transition flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
