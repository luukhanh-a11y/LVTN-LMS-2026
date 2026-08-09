import { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Save, X, Phone, Mail, Calendar, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { teacherService } from '../../services/teacher.service';

export default function TeacherProfile() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherService.getMyTeacherProfile().then(data => {
      setProfile(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã cập nhật thông tin hồ sơ thành công!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đổi mật khẩu thành công!');
    setShowPasswordForm(false);
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-500">Đang tải hồ sơ...</div>;
  }

  const fullName = profile?.hoTen || 'Giáo viên';
  const roleText = profile?.maGiaoVien ? 'Giáo viên' : 'Giáo viên';
  const department = profile?.boMon || 'Chưa cập nhật';
  const dob = profile?.ngaySinh ? profile.ngaySinh.split('T')[0] : '';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Hồ sơ cá nhân</h2>
        <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản và bảo mật</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Profile Header */}
        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative group">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm border-4 border-white uppercase">
                {fullName.charAt(0)}
              </div>
              <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm hover:text-blue-600 transition cursor-pointer">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-2">
              <h3 className="text-xl font-bold text-slate-900">{fullName}</h3>
              <p className="text-sm text-slate-500 mt-1">{roleText} • {department}</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full mt-3 border border-green-200">
                <ShieldCheck className="w-4 h-4" /> Tài khoản đã xác thực
              </span>
            </div>
          </div>
          
          {!showPasswordForm && (
            <button 
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-sm border border-slate-200 shrink-0"
            >
              <KeyRound className="w-4 h-4 text-blue-600" /> Đổi mật khẩu
            </button>
          )}
        </div>

        {/* Change Password Inline Form */}
        {showPasswordForm && (
          <div className="p-6 md:p-8 bg-blue-50/30 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" /> Cập nhật mật khẩu
              </h3>
              <button 
                type="button" 
                onClick={() => setShowPasswordForm(false)}
                className="p-2 text-slate-400 hover:bg-slate-200 bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Mật khẩu hiện tại</label>
                  <input type="password" required placeholder="Nhập mật khẩu cũ..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Mật khẩu mới</label>
                  <input type="password" required placeholder="Nhập mật khẩu mới..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Xác nhận mật khẩu</label>
                  <input type="password" required placeholder="Nhập lại mật khẩu..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm cursor-pointer">
                  <Save className="w-4 h-4" /> Lưu mật khẩu
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Personal Info Form */}
        <form onSubmit={handleUpdateProfile} className="p-6 md:p-8 space-y-6 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cột 1 */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Họ và tên</label>
                <input type="text" defaultValue={fullName} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Mã giáo viên (ID)</label>
                <input type="text" defaultValue={profile?.maGiaoVien || ''} disabled className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed font-medium" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Ngày sinh</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="date" defaultValue={dob} className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Giới tính</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 cursor-pointer">
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="tel" defaultValue="" placeholder="Chưa cập nhật" className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Email công việc</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" defaultValue="" placeholder="Chưa cập nhật" className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-sm cursor-pointer">
              <Save className="w-4 h-4" /> Lưu thông tin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
