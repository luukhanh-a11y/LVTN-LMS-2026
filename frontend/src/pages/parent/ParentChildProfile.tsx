import { useState, useEffect } from 'react';
import { User, Cake, School, GraduationCap, Star, Phone } from 'lucide-react';
import { useParentContextStore } from '../../stores/useParentContextStore';
import { parentService } from '../../services/parent.service';

const GIOI_TINH_LABEL: Record<string, string> = {
  NAM: 'Nam',
  NU: 'Nữ',
  KHAC: 'Khác',
};

export default function ParentChildProfile() {
  const { selectedChild } = useParentContextStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild?.id) {
      setLoading(true);
      parentService.getChildProfile(selectedChild.id)
        .then(setProfile)
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    }
  }, [selectedChild?.id]);

  const activeChild = selectedChild || { name: 'Học sinh' };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Hồ Sơ Con</h2>
        <p className="text-sm text-slate-500 mt-1">
          Thông tin học tập của <strong className="text-slate-700">{activeChild.name}</strong>.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !profile ? (
        <div className="flex flex-col items-center justify-center text-slate-500 bg-white border border-slate-200 border-dashed rounded-2xl p-12">
          <User className="w-16 h-16 text-slate-200 mb-4" />
          <p className="font-bold text-lg text-slate-700">Chưa có dữ liệu hồ sơ</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm border-4 border-white uppercase">
              {profile.hoTen?.charAt(0) || 'H'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{profile.hoTen}</h3>
              <p className="text-sm font-medium text-emerald-600 mt-1">Mã học sinh: {profile.maHocSinh}</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Cake className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500">Ngày sinh</p>
                <p className="font-bold text-slate-800">
                  {profile.ngaySinh ? new Date(profile.ngaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500">Giới tính</p>
                <p className="font-bold text-slate-800">{GIOI_TINH_LABEL[profile.gioiTinh] || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <School className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500">Lớp</p>
                <p className="font-bold text-slate-800">{profile.className || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500">Tổng điểm XP</p>
                <p className="font-bold text-slate-800">{profile.tongXp ?? 0} XP</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500">Giáo viên chủ nhiệm</p>
                <p className="font-bold text-slate-800">{profile.tenGiaoVienChuNhiem || 'Chưa cập nhật'}</p>
              </div>
            </div>

            {profile.sdtGiaoVienChuNhiem && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500">SĐT giáo viên chủ nhiệm</p>
                  <p className="font-bold text-slate-800">{profile.sdtGiaoVienChuNhiem}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
