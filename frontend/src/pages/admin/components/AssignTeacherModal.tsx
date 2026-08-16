import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/admin.service';

export function AssignTeacherModal({ isOpen, onClose, onSuccess, lopHocId, teachers, monHocs, hocKys, namHocs, fixedNamHocId }: any) {
  const [giaoVienId, setGiaoVienId] = useState<string>('');
  const [monHocId, setMonHocId] = useState<string>('');
  const [namHocId, setNamHocId] = useState<string>('');
  const [hocKyId, setHocKyId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Lớp học được truyền vào (lopHocId) thuộc một năm học cố định — không cho chọn năm học khác,
  // nếu không phan_cong_giang_day sẽ bị lệch năm học so với lớp (gây lỗi hiển thị "dạy quá nhiều lớp").
  const isNamHocLocked = fixedNamHocId != null;
  const filteredHocKys = hocKys?.filter((h: any) => h.namHocId === Number(namHocId)) || [];

  useEffect(() => {
    if (isOpen) {
      setGiaoVienId('');
      setMonHocId('');

      if (isNamHocLocked) {
        setNamHocId(String(fixedNamHocId));
      } else if (namHocs && namHocs.length > 0) {
        // Auto-select the most recent NamHoc if available
        const defaultNamHocId = namHocs[namHocs.length - 1].namHocId;
        setNamHocId(String(defaultNamHocId));
      } else {
        setNamHocId('');
      }
      setHocKyId('');
    }
  }, [isOpen, namHocs, isNamHocLocked, fixedNamHocId]);

  useEffect(() => {
    // If the user selects a NamHoc, auto-select its first HocKy
    if (filteredHocKys.length > 0 && !hocKyId) {
      setHocKyId(String(filteredHocKys[0].hocKyId));
    }
  }, [filteredHocKys, hocKyId]);

  const handleSubmit = async () => {
    if (!giaoVienId || !monHocId || !hocKyId) {
      return toast.error('Vui lòng chọn đầy đủ Giáo viên, Môn học và Học kỳ');
    }
    
    setLoading(true);
    try {
      await adminService.createPhanCong({
        giaoVienId: Number(giaoVienId),
        lopHocId,
        monHocId: Number(monHocId),
        hocKyId: Number(hocKyId)
      } as any);
      toast.success('Phân công giáo viên thành công');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi phân công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Phân Công Giáo Viên">
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Giáo viên phụ trách</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
            value={giaoVienId}
            onChange={e => setGiaoVienId(e.target.value)}
          >
            <option value="">-- Chọn Giáo Viên --</option>
            {teachers.map((t: any) => (
              <option key={t.id || t.giaoVienId} value={t.id || t.giaoVienId}>
                {t.hoTen} ({t.maGiaoVien || 'MGV'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Môn học giảng dạy</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
            value={monHocId}
            onChange={e => setMonHocId(e.target.value)}
          >
            <option value="">-- Chọn Môn Học --</option>
            {monHocs.map((m: any) => (
              <option key={m.monHocId} value={m.monHocId}>
                {m.tenMon} ({m.maMon})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Năm học</label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white disabled:bg-slate-100 disabled:text-slate-500"
            value={namHocId}
            disabled={isNamHocLocked}
            onChange={e => {
              setNamHocId(e.target.value);
              setHocKyId(''); // Reset Hoc Ky when Nam Hoc changes
            }}
          >
            <option value="">-- Chọn Năm Học --</option>
            {namHocs?.map((n: any) => (
              <option key={n.namHocId} value={n.namHocId}>
                {n.tenNamHoc}
              </option>
            ))}
          </select>
          {isNamHocLocked && (
            <p className="text-xs text-slate-400 mt-1">Lớp học này thuộc năm học cố định, không thể đổi.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Học kỳ</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white disabled:bg-slate-100"
            value={hocKyId}
            onChange={e => setHocKyId(e.target.value)}
            disabled={!namHocId}
          >
            <option value="">-- Chọn Học Kỳ --</option>
            {filteredHocKys.map((h: any) => (
              <option key={h.hocKyId} value={h.hocKyId}>Học kỳ {h.soHocKy}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="button" variant="primary" onClick={handleSubmit} isLoading={loading}>Xác nhận</Button>
        </div>
      </div>
    </Modal>
  );
}
