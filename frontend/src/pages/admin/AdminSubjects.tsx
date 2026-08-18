import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';
import Button from '../../components/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export default function AdminSubjects({ isInsideTab = false }: { isInsideTab?: boolean }) {
  const [monHocList, setMonHocList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    tenMon: '',
    maMon: '',
    moTa: '',
    trangThai: 'ACTIVE'
  });
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const generateMaMon = (name: string) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, '_').toUpperCase();
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getMonHocList();
      setMonHocList(data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách môn học');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setEditingSubject(null);
    setFormData({ tenMon: '', maMon: '', moTa: '', trangThai: 'ACTIVE' });
    setShowModal(true);
  };

  const handleOpenEdit = (subject: any) => {
    setEditingId(subject.monHocId);
    setEditingSubject(subject);
    setFormData({
      tenMon: subject.tenMonHoc || subject.tenMon || '',
      maMon: subject.maMon || '',
      moTa: subject.moTa || '',
      trangThai: subject.trangThai || 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.tenMon.trim()) {
      toast.error('Vui lòng nhập tên môn học');
      return;
    }
    
    try {
      if (editingId) {
        await adminService.updateMonHoc(editingId, formData);
        toast.success('Cập nhật môn học thành công');
      } else {
        await adminService.createMonHoc(formData);
        toast.success('Thêm môn học thành công');
      }
      setShowModal(false);
      fetchSubjects();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu môn học');
    }
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await adminService.deleteMonHoc(deletingId);
      toast.success('Đã xóa môn học');
      setShowDeleteModal(false);
      fetchSubjects();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể xóa môn học này');
    }
  };

  return (
    <div className={isInsideTab ? "space-y-6" : "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"}>
      {!isInsideTab && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Môn học</h1>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 pb-0 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Danh mục môn học</h3>
          <Button 
            type="button" 
            variant="primary" 
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd} 
          >
            Thêm môn
          </Button>
        </div>
        
        <div className="p-6 md:p-8 pt-4">
          {isLoading ? (
            <div className="flex justify-center p-8 text-slate-400">Đang tải dữ liệu...</div>
          ) : monHocList.length === 0 ? (
            <div className="text-center p-8 text-slate-500 border border-dashed border-slate-200 rounded-xl">
              Chưa có môn học nào. Hãy thêm môn học đầu tiên.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {monHocList.map(sub => (
                <div key={sub.monHocId} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition group bg-white">
                  <div>
                    <h4 className="font-semibold text-slate-800">{sub.tenMonHoc || sub.tenMon}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Mã môn: {sub.maMon || '---'}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.trangThai === 'AN' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'}`}>
                        {sub.trangThai === 'AN' ? 'ĐÃ ẨN' : 'HOẠT ĐỘNG'}
                      </span>
                    </div>
                    {sub.moTa && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{sub.moTa}</p>}
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleOpenEdit(sub)}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors" onClick={() => confirmDelete(sub.monHocId)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Thêm/Sửa Môn học */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={editingId ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
        widthClass="sm:max-w-[425px]"
      >
        <div className="p-4 sm:p-6 grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tên môn học <span className="text-red-500">*</span></label>
            <Input 
              placeholder="VD: Toán học" 
              value={formData.tenMon}
              onChange={(e) => {
                const val = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  tenMon: val,
                  maMon: !editingId ? generateMaMon(val) : prev.maMon
                }));
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mã môn</label>
            <Input 
              placeholder="VD: TOAN" 
              value={formData.maMon}
              onChange={(e) => setFormData({...formData, maMon: e.target.value.toUpperCase()})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mô tả</label>
            <textarea 
              placeholder="Nhập mô tả ngắn gọn..." 
              value={formData.moTa}
              onChange={(e) => setFormData({...formData, moTa: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <label className="text-sm font-medium text-slate-700">Trạng thái môn học</label>
            <button 
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.trangThai === 'ACTIVE' ? 'bg-blue-600' : 'bg-slate-200'}`}
              onClick={() => setFormData(prev => ({ ...prev, trangThai: prev.trangThai === 'ACTIVE' ? 'AN' : 'ACTIVE' }))}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.trangThai === 'ACTIVE' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {editingId && editingSubject && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">ID Hệ thống:</span>
                <span className="font-mono">{editingSubject.monHocId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">Ngày tạo:</span>
                <span>{editingSubject.ngayTao ? new Date(editingSubject.ngayTao).toLocaleDateString('vi-VN') : '---'}</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
          <Button variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSave}>Lưu thông tin</Button>
        </div>
      </Modal>

      {/* Modal Xóa */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title={<span className="text-red-600">Xác nhận xóa</span>}
        widthClass="sm:max-w-[400px]"
      >
        <div className="p-4 sm:p-6">
          <p className="text-slate-600">
            Bạn có chắc chắn muốn xóa môn học này không? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các lớp học đang gắn với môn này.
          </p>
        </div>
        <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleDelete}>Xóa vĩnh viễn</Button>
        </div>
      </Modal>
    </div>
  );
}
