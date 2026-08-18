import { X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface GradedEssayResult {
  baiTapId: number;
  danhGiaId?: number;
  title: string;
  diem?: number | null;
  xepLoai?: 'HOAN_THANH_TOT' | 'HOAN_THANH' | 'CHUA_HOAN_THANH' | string | null;
  nhanXet?: string | null;
  hanhDong?: 'DUYET' | 'YC_LAM_LAI' | string | null;
}

const XEP_LOAI_INFO: Record<string, { emoji: string; label: string; color: string }> = {
  HOAN_THANH_TOT: { emoji: '⭐', label: 'Hoàn thành tốt!', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  HOAN_THANH: { emoji: '👍', label: 'Hoàn thành', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  CHUA_HOAN_THANH: { emoji: '💪', label: 'Cần cố gắng thêm', color: 'text-amber-600 bg-amber-50 border-amber-200' },
};

// Dùng chung cho cả 2 giao diện (Junior lớp 1 / Senior khối 2+) — khác nhau ở mức độ chi
// tiết hiển thị (simple=true bỏ bớt chữ, phóng to icon) chứ không tách hẳn 2 component,
// vì cùng 1 nguồn dữ liệu và cùng 1 hành vi (đóng modal, làm lại nếu bị yêu cầu).
export default function GradedResultModal({
  result,
  onClose,
  simple = false,
}: {
  result: GradedEssayResult;
  onClose: () => void;
  simple?: boolean;
}) {
  const info = XEP_LOAI_INFO[result.xepLoai || ''] || XEP_LOAI_INFO.HOAN_THANH;
  const needsRedo = result.hanhDong === 'YC_LAM_LAI';

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 text-center relative animate-in zoom-in-95 duration-300"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Cô giáo đã xem bài của em</p>
        {!simple && <h3 className="text-lg font-black text-slate-800 mb-4">{result.title}</h3>}

        <div className={`text-6xl ${simple ? 'mb-4' : 'mb-3'}`}>{info.emoji}</div>

        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-black text-lg mb-5 ${info.color}`}>
          {info.label}
        </div>

        {!simple && result.diem != null && (
          <p className="text-slate-500 font-medium mb-4">
            Điểm: <span className="font-black text-slate-800 text-xl">{Number(result.diem).toFixed(1)}</span>
          </p>
        )}

        {result.nhanXet && (
          <div className={`bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left relative mb-5 ${simple ? 'text-base' : 'text-sm'}`}>
            <span className="absolute -top-3 left-4 text-3xl text-slate-300 select-none">"</span>
            <p className="text-slate-700 font-medium leading-relaxed">{result.nhanXet}</p>
          </div>
        )}

        {needsRedo ? (
          <Link
            to={`/student/essay?id=${result.baiTapId}`}
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" /> Làm lại bài
          </Link>
        ) : (
          <button
            onClick={onClose}
            className="w-full bg-student-primary hover:bg-[#3A82DF] text-white font-bold py-3.5 rounded-2xl transition-colors cursor-pointer"
          >
            Tuyệt vời!
          </button>
        )}
      </div>
    </div>
  );
}
