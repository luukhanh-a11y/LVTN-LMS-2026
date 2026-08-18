import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { classService } from '../../../services/class.service';
import { adminService } from '../../../services/admin.service';

export function ChangeTeacherModal({ isOpen, onClose, onSuccess, classId, currentTeacherId }: any) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [classData, setClassData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedTeacherId(currentTeacherId ? String(currentTeacherId) : '');
      fetchData();
    }
  }, [isOpen, currentTeacherId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teachersRes, classRes] = await Promise.all([
        adminService.getTeachers(),
        classService.getClassById(classId)
      ]);
      setTeachers(teachersRes);
      setClassData(classRes);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải dữ liệu giáo viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTeacherId) {
      return toast.error('Vui lòng chọn giáo viên chủ nhiệm mới');
    }
    
    if (!classData) {
      return toast.error('Không tìm thấy thông tin lớp');
    }

    setSubmitting(true);
    try {
      // Need to send the full required payload for updateClass
      await classService.updateClass(classId, {
        tenLop: classData.tenLop,
        khoiLop: classData.khoiLop,
        siSoToiDa: classData.siSoToiDa,
        trangThai: classData.trangThai,
        namHocId: classData.namHocId || 1,
        giaoVienChuNhiemId: Number(selectedTeacherId)
      });
      toast.success('Đã cập nhật Giáo viên chủ nhiệm');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Phân Công Giáo Viên Chủ Nhiệm">
      <div className="p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Giáo viên chủ nhiệm</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
              value={selectedTeacherId}
              onChange={e => setSelectedTeacherId(e.target.value)}
            >
              <option value="">-- Chọn Giáo Viên --</option>
              {teachers.map((t: any) => (
                <option key={t.id || t.giaoVienId} value={t.id || t.giaoVienId}>
                  {t.hoTen} ({t.maGiaoVien || 'MGV'})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button type="button" variant="primary" onClick={handleSubmit} isLoading={submitting}>Lưu thay đổi</Button>
        </div>
      </div>
    </Modal>
  );
}
