import { useState } from 'react';
import { X, UserPlus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface EditUserModalProps {
  user: any;
  activeTab: string;
  formData: { soDienThoai: string; trangThai: string; hoTen?: string; email?: string; ngaySinh?: string; gioiTinh?: string; };
  setFormData: (data: any) => void;
  onConfirm: () => void;
  onClose: () => void;
  isUpdating: boolean;
  parentChildren?: any[];
  onAddChild?: (maHocSinh: string, quanHe: string) => Promise<void>;
  onRemoveChild?: (idMoiQuanHe: number) => Promise<void>;
}

export function EditUserModal({
  user,
  activeTab,
  formData,
  setFormData,
  onConfirm,
  onClose,
  isUpdating,
  parentChildren = [],
  onAddChild,
  onRemoveChild
}: EditUserModalProps) {
  const [newChildCode, setNewChildCode] = useState('');
  const [newChildRelation, setNewChildRelation] = useState('Phụ huynh');
  
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
            <Input 
              label="Họ và tên" 
              value={formData.hoTen || ''} 
              onChange={(e) => setFormData({...formData, hoTen: e.target.value})} 
            />
            <Input 
              label="Tên đăng nhập" 
              defaultValue={user.username} 
              disabled 
              className="bg-slate-50 text-slate-500" 
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input 
              label="Email" 
              value={formData.email || ''} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            {activeTab !== 'student' ? (
              <Input
                label="Số điện thoại"
                value={formData.soDienThoai || ''}
                onChange={(e) => setFormData({...formData, soDienThoai: e.target.value})}
              />
            ) : <div />}
          </div>

          {activeTab === 'teacher' && (
            <>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Mã giáo viên" 
                  defaultValue={user.maGiaoVien} 
                  disabled 
                  className="bg-slate-50 text-slate-500" 
                />
                <Input 
                  label="Bộ môn" 
                  defaultValue={user.boMon} 
                  disabled 
                  className="bg-slate-50 text-slate-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Ngày sinh (YYYY-MM-DD)" 
                  type="date"
                  value={formData.ngaySinh || ''} 
                  onChange={(e) => setFormData({...formData, ngaySinh: e.target.value})} 
                />
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giới tính</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.gioiTinh}
                    onChange={(e) => setFormData({...formData, gioiTinh: e.target.value})}
                  >
                    <option value="NAM">Nam</option>
                    <option value="NU">Nữ</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'student' && (
            <>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Mã học sinh" 
                  defaultValue={user.maHocSinh} 
                  disabled 
                  className="bg-slate-50 text-slate-500" 
                />
                <Input 
                  label="Lớp học" 
                  defaultValue={user.tenLop} 
                  disabled 
                  className="bg-slate-50 text-slate-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Ngày sinh (YYYY-MM-DD)" 
                  type="date"
                  value={formData.ngaySinh || ''} 
                  onChange={(e) => setFormData({...formData, ngaySinh: e.target.value})} 
                />
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giới tính</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.gioiTinh}
                    onChange={(e) => setFormData({...formData, gioiTinh: e.target.value})}
                  >
                    <option value="NAM">Nam</option>
                    <option value="NU">Nữ</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'parent' && (
            <div className="border-t border-slate-100 pt-5 mt-2">
              <h4 className="font-bold text-slate-800 mb-4">Quản lý Con (Học sinh)</h4>
              
              <div className="bg-slate-50 p-4 rounded-xl mb-4 space-y-3 border border-slate-200/60">
                <div className="flex gap-3">
                  <Input 
                    label="Nhập Mã học sinh" 
                    value={newChildCode} 
                    onChange={(e) => setNewChildCode(e.target.value)} 
                  />
                  <div className="w-1/3">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quan hệ</label>
                    <select
                      className="w-full px-3 py-3 border border-slate-200 rounded-xl outline-none bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      value={newChildRelation}
                      onChange={(e) => setNewChildRelation(e.target.value)}
                    >
                      <option value="Phụ huynh">Phụ huynh</option>
                      <option value="Cha">Cha</option>
                      <option value="Mẹ">Mẹ</option>
                      <option value="Người giám hộ">Người giám hộ</option>
                    </select>
                  </div>
                </div>
                <Button 
                  onClick={async () => {
                    if (onAddChild && newChildCode.trim()) {
                      await onAddChild(newChildCode.trim(), newChildRelation);
                      setNewChildCode('');
                    }
                  }} 
                  disabled={!newChildCode.trim()}
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Thêm liên kết Học sinh
                </Button>
              </div>

              {parentChildren.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {parentChildren.map((child: any) => (
                    <div key={child.idMoiQuanHe} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {child.hocSinh?.hoTen} <span className="text-slate-500 font-normal">({child.hocSinh?.maHocSinh})</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Quan hệ: <span className="font-medium text-indigo-600">{child.quanHe}</span></p>
                      </div>
                      <button 
                        onClick={() => onRemoveChild && onRemoveChild(child.idMoiQuanHe)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Xóa liên kết"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Phụ huynh này chưa liên kết với học sinh nào.
                </p>
              )}
            </div>
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

          <div className="pt-6 flex justify-end items-center border-t border-slate-100 mt-4 space-x-3">
              <Button variant="secondary" onClick={onClose}>Hủy</Button>
              <Button onClick={onConfirm} isLoading={isUpdating}>Lưu thay đổi</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
