import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const TRANSFER_REASONS = [
  { value: 'DOI_LOP', label: 'Đổi lớp' },
  { value: 'LEN_LOP', label: 'Lên lớp' },
  { value: 'O_LAI', label: 'Ở lại' },
  { value: 'CHUYEN_TRUONG', label: 'Chuyển trường đến' },
  { value: 'NHAP_HOC_MOI', label: 'Nhập học mới' },
];

interface TransferClassModalProps {
  user: any;
  classes: any[];
  transferClassId: string;
  setTransferClassId: (id: string) => void;
  transferReason: string;
  setTransferReason: (reason: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  isTransferring: boolean;
}

export function TransferClassModal({
  user,
  classes,
  transferClassId,
  setTransferClassId,
  transferReason,
  setTransferReason,
  onConfirm,
  onClose,
  isTransferring
}: TransferClassModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[400px] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-pro-primary/10">
          <h3 className="font-bold text-pro-fg text-lg">Chuyển Lớp Học Sinh</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Học sinh:</p>
            <p className="font-bold text-slate-800 text-lg">{user.fullName || user.name} ({user.username})</p>
            <p className="text-sm text-slate-600 mt-1">Lớp hiện tại: <span className="font-bold text-pro-primary">{user.className || 'Chưa phân lớp'}</span></p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Chọn lớp mới</label>
            <select 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-pro-primary focus:ring-2 focus:ring-pro-primary/10 transition-all font-medium text-slate-800"
              value={transferClassId}
              onChange={(e) => setTransferClassId(e.target.value)}
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map(c => (
                <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop} (Khối {c.khoiLop})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Lý do chuyển lớp</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-pro-primary focus:ring-2 focus:ring-pro-primary/10 transition-all font-medium text-slate-800"
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
            >
              {TRANSFER_REASONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
            <Button 
              onClick={onConfirm}
              isLoading={isTransferring}
              disabled={!transferClassId}
            >
              Xác nhận chuyển
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
