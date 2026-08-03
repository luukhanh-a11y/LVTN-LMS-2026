import { useState } from 'react';
import toast from 'react-hot-toast';
import { GraduationCap, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { teacherService } from '../../../services/teacher.service';

interface Props {
  classId: number;
  studentId: number;
  studentName: string;
  goiYKetQuaHocTap: string | null;
  existing?: {
    ketQuaHocTap: string;
    ketQuaRenLuyen: string;
    quyetDinh: string;
    duocXetDacCach: boolean;
    lyDoDacCach: string | null;
    ghiChu: string | null;
  };
  onClose: () => void;
  onSaved: () => void;
}

const NHAN_HOC_TAP: Record<string, string> = {
  HOAN_THANH_TOT: 'Hoàn thành Tốt',
  HOAN_THANH: 'Hoàn thành',
  CHUA_HOAN_THANH: 'Chưa hoàn thành',
};

export function KetQuaCuoiNamModal({ classId, studentId, studentName, goiYKetQuaHocTap, existing, onClose, onSaved }: Props) {
  const [ketQuaHocTap, setKetQuaHocTap] = useState(existing?.ketQuaHocTap ?? goiYKetQuaHocTap ?? 'HOAN_THANH');
  const [ketQuaRenLuyen, setKetQuaRenLuyen] = useState(existing?.ketQuaRenLuyen ?? 'TOT');
  const [quyetDinh, setQuyetDinh] = useState(existing?.quyetDinh ?? 'LEN_LOP');
  const [duocXetDacCach, setDuocXetDacCach] = useState(existing?.duocXetDacCach ?? false);
  const [lyDoDacCach, setLyDoDacCach] = useState(existing?.lyDoDacCach ?? '');
  const [ghiChu, setGhiChu] = useState(existing?.ghiChu ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await teacherService.luuKetQuaCuoiNam(classId, studentId, {
        ketQuaHocTap,
        ketQuaRenLuyen,
        quyetDinh,
        duocXetDacCach,
        lyDoDacCach: duocXetDacCach ? lyDoDacCach : undefined,
        ghiChu,
      });
      toast.success(`Đã lưu kết quả cuối năm cho ${studentName}!`);
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Lưu kết quả thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[520px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-pro-primary/10">
          <h3 className="font-bold text-pro-fg flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-pro-primary" /> Xét kết quả cuối năm
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Học sinh: <span className="font-bold text-slate-800">{studentName}</span>
          </p>
          {goiYKetQuaHocTap && (
            <p className="text-xs text-slate-500 italic">
              Gợi ý dựa trên điểm cả năm: <span className="font-medium">{NHAN_HOC_TAP[goiYKetQuaHocTap] ?? goiYKetQuaHocTap}</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kết quả học tập</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" value={ketQuaHocTap} onChange={(e) => setKetQuaHocTap(e.target.value)}>
                <option value="HOAN_THANH_TOT">Hoàn thành Tốt</option>
                <option value="HOAN_THANH">Hoàn thành</option>
                <option value="CHUA_HOAN_THANH">Chưa hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kết quả rèn luyện</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" value={ketQuaRenLuyen} onChange={(e) => setKetQuaRenLuyen(e.target.value)}>
                <option value="TOT">Tốt</option>
                <option value="DAT">Đạt</option>
                <option value="CAN_CO_GANG">Cần cố gắng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Quyết định</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" value={quyetDinh} onChange={(e) => setQuyetDinh(e.target.value)}>
              <option value="LEN_LOP">Lên lớp</option>
              <option value="O_LAI">Ở lại</option>
              <option value="CHUYEN_CUP">Chuyển cấp</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" checked={duocXetDacCach} onChange={(e) => setDuocXetDacCach(e.target.checked)} />
              Được xét đặc cách
            </label>
            {duocXetDacCach && (
              <textarea
                className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-16 resize-none"
                placeholder="Lý do đặc cách..."
                value={lyDoDacCach}
                onChange={(e) => setLyDoDacCach(e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ghi chú</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-16 resize-none"
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
            <Button variant="pro-primary" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu kết quả'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
