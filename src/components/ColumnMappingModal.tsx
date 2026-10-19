import React, { useState } from 'react';
import { ColumnMapping } from '../types/gas';
import { Settings2, X, Check, ArrowRight } from 'lucide-react';

interface ColumnMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: string[];
  currentMapping: ColumnMapping;
  onApplyMapping: (newMapping: ColumnMapping) => void;
}

export const ColumnMappingModal: React.FC<ColumnMappingModalProps> = ({
  isOpen,
  onClose,
  availableColumns,
  currentMapping,
  onApplyMapping,
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>(currentMapping);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyMapping(mapping);
    onClose();
  };

  const fields: { key: keyof ColumnMapping; label: string; desc: string; sample: string }[] = [
    { key: 'month', label: '월 (Month)', desc: '기준 월 또는 일자', sample: '예: 2024년 01월, 2024-01, 1월' },
    { key: 'item', label: '품목 (Item)', desc: '가스 종류 및 제품명', sample: '예: LPG(프로판), LNG, 질소(N2)' },
    { key: 'volume', label: '판매량 (Volume)', desc: '판매 수량 또는 체적', sample: '예: 18,500 (kg, ㎥, 캔 등 숫자)' },
    { key: 'revenue', label: '매출액 (Revenue)', desc: '판매 공급가액 또는 총매출', sample: '예: 38,850,000 (원 단위 숫자)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#181818] border border-[#282828] rounded-xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#282828] bg-[#181818]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-[#1ed760] border border-[#333333] flex items-center justify-center">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">열(컬럼) 매핑 설정</h3>
              <p className="text-xs text-[#b3b3b3]">업로드된 엑셀 열 이름을 분석 필드와 연결합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-[#1f1f1f] border border-[#282828] rounded-lg p-3.5 text-xs text-[#b3b3b3]">
            자동 매핑된 열을 확인하세요. 만약 파일의 열 이름이 다르면 드롭다운에서 알맞은 열을 직접 선택할 수 있습니다.
          </div>

          <div className="space-y-3">
            {fields.map(f => (
              <div key={f.key} className="bg-[#1f1f1f] p-3.5 rounded-lg border border-[#282828]">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{f.label}</span>
                    <span className="ml-2 text-xs text-[#b3b3b3]">({f.desc})</span>
                  </div>
                  <span className="text-[11px] text-[#7c7c7c] hidden sm:inline">{f.sample}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#7c7c7c] shrink-0" />
                  <select
                    value={mapping[f.key]}
                    onChange={e => setMapping({ ...mapping, [f.key]: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333333] rounded-full px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white transition"
                  >
                    <option value="">-- 열 선택 --</option>
                    {availableColumns.map(col => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#282828] bg-[#181818]">
          <button
            onClick={onClose}
            className="spotify-pill-secondary"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="spotify-pill-primary"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>매핑 적용</span>
          </button>
        </div>
      </div>
    </div>
  );
};
