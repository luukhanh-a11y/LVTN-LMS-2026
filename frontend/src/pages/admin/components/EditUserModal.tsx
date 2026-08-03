import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface EditUserModalProps {
  user: any;
  activeTab: string;
  formData: { soDienThoai: string; trangThai: string };
  setFormData: (data: any) => void;
  onConfirm: () => void;
  onClose: () => void;
  isUpdating: boolean;
}

export function EditUserModal({
  user,
  activeTab,
  formData,
  setFormData,
  onConfirm,
  onClose,
  isUpdating
}: EditUserModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">Cập nhật Tài khoản</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input label="Họ và tên" defaultValue={user.fullName || user.name} disabled className="bg-slate-50 text-slate-500" />
            <Input label="Tên đăng nhập" defaultValue={user.username} disabled className="bg-slate-50 text-slate-500" />
          </div>
          
          {(activeTab === 'teacher' || activeTab === 'parent') && (
            <Input
              label="Số điện thoại"
              value={formData.soDienThoai}
              onChange={(e) => setFormData({...formData, soDienThoai: e.target.value})}
            />
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.trangThai}
              onChange={(e) => setFormData({...formData, trangThai: e.target.value})}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Bị khóa</option>
            </select>
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-slate-100 mt-4">
            <Button variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-none border border-red-200">
              Khôi phục Mật khẩu
            </Button>
            <div className="space-x-3 flex">
              <Button variant="secondary" onClick={onClose}>Hủy</Button>
              <Button onClick={onConfirm} isLoading={isUpdating}>Lưu thay đổi</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
