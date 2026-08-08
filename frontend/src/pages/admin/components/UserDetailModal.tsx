import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface UserDetailModalProps {
  user: any;
  onClose: () => void;
  onEdit?: () => void;
}

export function UserDetailModal({ user, onClose, onEdit }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Chi tiết tài khoản</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4 text-[15px]">
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Tên đăng nhập</span>
            <span className="col-span-2 font-bold text-slate-800">{user.username}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Họ và tên</span>
            <span className="col-span-2 font-bold text-slate-800">{user.fullName || 'Chưa cập nhật'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Vai trò</span>
            <span className="col-span-2 font-medium">
              {user.role === 'HOC_SINH' ? 'Học sinh' : user.role === 'GIAO_VIEN' ? 'Giáo viên' : 'Phụ huynh'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Email</span>
            <span className="col-span-2 font-medium">{user.email || 'Chưa cập nhật'}</span>
          </div>
          {user.role !== 'HOC_SINH' && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Số điện thoại</span>
              <span className="col-span-2 font-medium">{user.phone || 'Chưa cập nhật'}</span>
            </div>
          )}
          {user.profile?.ngaySinh && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Ngày sinh</span>
              <span className="col-span-2 font-medium">{user.profile.ngaySinh}</span>
            </div>
          )}
          {user.profile?.gioiTinh && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Giới tính</span>
              <span className="col-span-2 font-medium">{user.profile.gioiTinh === 'NAM' ? 'Nam' : 'Nữ'}</span>
            </div>
          )}
          {user.profile?.maHocSinh && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Mã học sinh</span>
              <span className="col-span-2 font-medium">{user.profile.maHocSinh}</span>
            </div>
          )}
          {user.profile?.maGiaoVien && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Mã giáo viên</span>
              <span className="col-span-2 font-medium">{user.profile.maGiaoVien}</span>
            </div>
          )}
          {user.profile?.boMon && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Bộ môn</span>
              <span className="col-span-2 font-medium">{user.profile.boMon}</span>
            </div>
          )}
          {user.profile?.tongXp !== undefined && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Tổng XP</span>
              <span className="col-span-2 font-medium">{user.profile.tongXp}</span>
            </div>
          )}

          {user.role === 'PHU_HUYNH' && user.children && (
            <div className="pt-3">
              <span className="text-slate-500 font-medium mb-3 block">Danh sách Học sinh liên kết</span>
              {user.children.length > 0 ? (
                <div className="space-y-2">
                  {user.children.map((child: any) => (
                    <div key={child.idMoiQuanHe} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                      <p className="font-semibold text-slate-800 text-sm">
                        {child.hocSinh?.hoTen} <span className="text-slate-500 font-normal">({child.hocSinh?.maHocSinh})</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Quan hệ: <span className="font-medium text-indigo-600">{child.quanHe}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Chưa liên kết học sinh nào.</p>
              )}
            </div>
          )}

          {user.className && (
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-medium">Lớp học</span>
              <span className="col-span-2 font-bold text-pro-primary">{user.className}</span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Trạng thái</span>
            <span className="col-span-2">
              <Badge variant={user.status === 'ACTIVE' ? "success" : "danger"}>
                {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
              </Badge>
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {onEdit && (
            <Button variant="primary" onClick={onEdit}>Chỉnh sửa</Button>
          )}
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
}
