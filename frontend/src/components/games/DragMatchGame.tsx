import React, { useState } from 'react';
import type { GameProps } from './MatchingGame';
import { cleanMediaUrl } from '../../lib/utils';

// "Kéo thả ghép cặp" — dành cho NOI_CAP có NHIỀU cặp (vd ghép chữ hoa/thường cả bảng
// chữ cái). Nối bằng đường thẳng (MatchingGame) càng nhiều cặp càng dễ rối dây chồng
// chéo; game này bỏ hẳn đường nối — mỗi ô bên phải là 1 hộp, kéo thẻ bên trái thả vào
// đúng hộp. Ô xếp dạng lưới tự xuống dòng nên co giãn tốt với số lượng lớn.
// Hỗ trợ cả 2 cách thao tác (giống SortingGame đã có sẵn trong dự án) để học sinh nhỏ
// tuổi (lớp 1) dùng máy tính bảng vẫn thao tác được dễ dàng: kéo thả HOẶC bấm chọn thẻ
// rồi bấm vào hộp muốn thả.
export const DragMatchGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const cotTrai = cauHinh?.cotTrai || [];
  const cotPhai = cauHinh?.cotPhai || [];

  // phaiId -> traiId
  const [placements, setPlacements] = useState<Record<string, string>>(
    result && activeDapAnChuan?.capDung
      ? Object.fromEntries(activeDapAnChuan.capDung.map((c: any) => [c.phaiId, c.traiId]))
      : {}
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const submitIfDone = (newPlacements: Record<string, string>) => {
    if (Object.keys(newPlacements).length === cotTrai.length) {
      setTimeout(() => {
        const capChon = Object.entries(newPlacements).map(([phaiId, traiId]) => ({ traiId, phaiId }));
        onSubmit({ capChon });
      }, 400);
    }
  };

  const placeItem = (traiId: string, phaiId: string) => {
    if (result) return;
    // Nếu thẻ này đang nằm ở hộp khác thì gỡ ra trước; hộp đích nếu đang có thẻ khác
    // thì thẻ cũ tự trả lại khay — cho phép sửa thoải mái, không bị "kẹt" lựa chọn sai.
    const newPlacements = { ...placements };
    Object.keys(newPlacements).forEach(pid => { if (newPlacements[pid] === traiId) delete newPlacements[pid]; });
    newPlacements[phaiId] = traiId;
    setPlacements(newPlacements);
    setSelectedItem(null);
    submitIfDone(newPlacements);
  };

  const removeFromBox = (phaiId: string) => {
    if (result) return;
    const newPlacements = { ...placements };
    delete newPlacements[phaiId];
    setPlacements(newPlacements);
  };

  const handleDragStart = (e: React.DragEvent, traiId: string) => {
    if (result) { e.preventDefault(); return; }
    e.dataTransfer.setData('text/plain', traiId);
  };

  const handleDrop = (e: React.DragEvent, phaiId: string) => {
    e.preventDefault();
    const traiId = e.dataTransfer.getData('text/plain');
    if (traiId) placeItem(traiId, phaiId);
  };

  const unplacedItems = cotTrai.filter((t: any) => !Object.values(placements).includes(t.id));

  const renderChip = (item: any, opts: { inBox?: boolean; correctness?: boolean | null } = {}) => (
    <div className="flex items-center gap-2 justify-center">
      {item.hinhAnh && <img src={cleanMediaUrl(item.hinhAnh)} alt="" className="w-8 h-8 object-contain shrink-0" />}
      <span className="font-bold text-sm sm:text-base text-slate-800 text-center">{item.noiDung || '...'}</span>
      {opts.correctness === true && <span className="text-emerald-600 font-black shrink-0">✓</span>}
      {opts.correctness === false && <span className="text-rose-600 font-black shrink-0">✕</span>}
    </div>
  );

  return (
    <div className="w-full min-h-[450px] bg-amber-50 rounded-2xl p-5 sm:p-8 flex flex-col gap-8">
      {cauHinh?.cauHoi && (
        <h3 className="text-center text-lg sm:text-xl font-black text-slate-800">{cauHinh.cauHoi}</h3>
      )}

      {/* Khay thẻ chưa ghép */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">Kéo thẻ vào đúng ô bên dưới</p>
        <div className="flex flex-wrap gap-3 min-h-[64px]">
          {unplacedItems.map((item: any) => (
            <div
              key={item.id}
              draggable={!result}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={() => !result && setSelectedItem(sel => (sel === item.id ? null : item.id))}
              className={`px-4 py-3 rounded-2xl border-4 bg-white shadow-md cursor-grab active:cursor-grabbing transition-all select-none ${
                selectedItem === item.id ? 'border-amber-500 scale-105 ring-4 ring-amber-200' : 'border-amber-200 hover:border-amber-300 hover:-translate-y-0.5'
              }`}
            >
              {renderChip(item)}
            </div>
          ))}
          {unplacedItems.length === 0 && !result && (
            <span className="text-sm text-slate-400 italic py-4">Đã hết thẻ trong khay — kiểm tra lại các ô bên dưới nhé!</span>
          )}
        </div>
      </div>

      {/* Các ô đích */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cotPhai.map((box: any) => {
          const placedTraiId = placements[box.id];
          const placedItem = placedTraiId ? cotTrai.find((t: any) => t.id === placedTraiId) : null;
          const correctness = result && placedTraiId
            ? (activeDapAnChuan?.capDung?.some((c: any) => c.traiId === placedTraiId && c.phaiId === box.id) ?? false)
            : null;

          return (
            <div key={box.id} className="flex flex-col gap-2">
              <div className="px-3 py-2 rounded-xl bg-sky-100 border-2 border-sky-300 text-center">
                {renderChip(box)}
              </div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, box.id)}
                onClick={() => {
                  if (!result && selectedItem) placeItem(selectedItem, box.id);
                  else if (!result && placedItem) removeFromBox(box.id);
                }}
                className={`min-h-[64px] rounded-xl border-4 border-dashed flex items-center justify-center p-2 transition-colors ${
                  placedItem
                    ? correctness === true
                      ? 'bg-emerald-50 border-emerald-400'
                      : correctness === false
                        ? 'bg-rose-50 border-rose-400'
                        : 'bg-white border-slate-300 cursor-pointer'
                    : selectedItem
                      ? 'bg-amber-100/60 border-amber-400 cursor-pointer'
                      : 'bg-white/60 border-slate-200'
                }`}
              >
                {placedItem ? renderChip(placedItem, { inBox: true, correctness }) : (
                  <span className="text-xs text-slate-400">Thả vào đây</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
