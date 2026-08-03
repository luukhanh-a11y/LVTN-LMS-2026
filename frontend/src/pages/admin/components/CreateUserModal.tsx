import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface CreateUserModalProps {
  formData: any;
  setFormData: (data: any) => void;
  classes: any[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isCreating: boolean;
}

export function CreateUserModal({
  formData,
  setFormData,
  classes,
  onSubmit,
  onClose,
  isCreating
}: CreateUserModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[540px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">Thêm mới Tài khoản</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Loại tài khoản</label>
            <select 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="HOC_SINH">Học sinh</option>
              <option value="GIAO_VIEN">Giáo viên</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {formData.role === 'HOC_SINH' && (
              <Input
                label="Mã Học sinh"
                required
                placeholder="VD: HS2026001"
                value={formData.studentCode}
                onChange={(e) => setFormData({...formData, studentCode: e.target.value})}
                className="bg-slate-50"
              />
            )}
            <Input
              label="Họ và tên"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="bg-slate-50"
            />
          </div>
          {formData.role === 'HOC_SINH' && (
            <p className="text-xs text-slate-500 -mt-3">
              Tên đăng nhập sẽ tự động là <span className="font-semibold">HS{formData.studentCode || '...'}</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ngày sinh</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-slate-50 focus:bg-white text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>
            {formData.role === 'GIAO_VIEN' && (
              <div>
                <Input
                  label="Số điện thoại"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-slate-50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Tên đăng nhập sẽ tự động là <span className="font-semibold">GV{formData.phone || '...'}</span>
                </p>
              </div>
            )}
            {formData.role === 'HOC_SINH' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lớp học</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-slate-50 focus:bg-white text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  required
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map(c => (
                    <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {formData.role === 'GIAO_VIEN' && (
            <Input 
              label="Bộ môn giảng dạy" 
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="bg-slate-50"
            />
          )}

          {formData.role === 'HOC_SINH' && (
            <div className="border-t border-slate-100 pt-5 mt-2">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-1.5 h-4 bg-pro-primary rounded-full mr-2"></span>
                Thông tin Phụ huynh (Tùy chọn)
              </h4>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Số ĐT Phụ huynh" 
                  placeholder="Dùng làm tài khoản"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                  className="bg-slate-50"
                />
                <Input 
                  label="Tên Phụ huynh" 
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  className="bg-slate-50"
                />
              </div>
              <p className="text-sm text-slate-500 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Hệ thống sẽ tự động tạo tài khoản Phụ huynh nếu SĐT này chưa tồn tại.
              </p>
            </div>
          )}

          <div className="pt-5 mt-2 border-t border-slate-100 flex justify-end space-x-3 sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={onClose}>Hủy bỏ</Button>
            <Button type="submit" isLoading={isCreating}>Khởi tạo Tài khoản</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
