import { useEffect, useState, useMemo } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/admin.service';

export function AddStudentModal({ isOpen, onClose, onSuccess, lopHocMoiId }: any) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIds([]);
      fetchUnassignedStudents();
    }
  }, [isOpen]);

  const fetchUnassignedStudents = async () => {
    setLoading(true);
    try {
      const result = await adminService.searchUsers({ role: 'HOC_SINH', size: 1000 });
      // Lọc ra các học sinh chưa có lớp (lopHocId là null hoặc undefined)
      const unassigned = result.content.filter((s: any) => !s.lopHocId);
      setStudents(unassigned);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách học sinh chưa có lớp');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.maHocSinh && s.maHocSinh.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, searchTerm]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      return toast.error('Vui lòng chọn ít nhất một học sinh');
    }
    
    setSubmitting(true);
    try {
      await adminService.bulkThucHienChuyenLop({
        hocSinhIds: selectedIds,
        lopHocMoiId,
        lyDo: 'PHAN_CONG_MOI',
        ghiChu: 'Phân công học sinh mới vào lớp'
      });
      toast.success(`Đã thêm ${selectedIds.length} học sinh vào lớp`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm học sinh');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm Học Sinh Vào Lớp">
      <div className="flex flex-col h-[70vh] max-h-[600px] w-full sm:min-w-[500px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm học sinh theo tên, mã HS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.length > 0 ? (
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-100 rounded-lg cursor-pointer mb-2" onClick={toggleSelectAll}>
                  <input type="checkbox" checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0} onChange={() => {}} className="w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm font-bold text-slate-700">Chọn tất cả ({filteredStudents.length})</span>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Không có học sinh nào chưa được phân lớp (hoặc không khớp tìm kiếm).
                </div>
              )}
              
              {filteredStudents.map(student => (
                <div key={student.id} 
                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                  onClick={() => toggleSelect(student.id)}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(student.id)} 
                    onChange={() => {}}
                    className="w-4 h-4 text-indigo-600 rounded" 
                  />
                  <div>
                    <div className="font-bold text-slate-900">{student.fullName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Mã HS: {student.maHocSinh || 'N/A'} - {student.gender === 'FEMALE' ? 'Nữ' : (student.gender === 'MALE' ? 'Nam' : 'Khác')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="button" variant="primary" onClick={handleSubmit} isLoading={submitting}>
            Thêm {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} học sinh
          </Button>
        </div>
      </div>
    </Modal>
  );
}
