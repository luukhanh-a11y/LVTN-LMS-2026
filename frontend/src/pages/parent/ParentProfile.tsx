import { useState, useEffect } from 'react';
import { KeyRound, Shield, Save, X, Phone, Mail, User, ShieldCheck, LogOut, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { authService } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

export default function ParentProfile() {
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form State
  const [hoTen, setHoTen] = useState('');
  const [emailNhanThongBao, setEmailNhanThongBao] = useState('');
  const [childrenInfo, setChildrenInfo] = useState<any[]>([]);

  // Account Data
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [trangThai, setTrangThai] = useState('ACTIVE');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin tài khoản chung
      const userInfoRes = await api.get('/nguoi-dung/my-info');
      const baseUser = userInfoRes.data;
      
      setTenDangNhap(baseUser.tenDangNhap || baseUser.username || '');
      setEmail(baseUser.email || '');
      setSoDienThoai(baseUser.soDienThoai || baseUser.phone || '');
      setTrangThai(baseUser.trangThai || baseUser.status || 'ACTIVE');

      // Lấy hồ sơ chuyên sâu của phụ huynh
      try {
        const profileRes = await api.get('/hoso-phuhuynh/my-profile');
        const hoso = profileRes.data;
        
        if (hoso) {
          setHoTen(hoso.hoTen || baseUser.hoTen || baseUser.fullName || '');
          setEmailNhanThongBao(hoso.emailNhanThongBao || '');
        }
      } catch (err) {
        console.warn("Could not fetch detailed profile", err);
        setHoTen(baseUser.hoTen || baseUser.fullName || '');
      }

      // Lấy danh sách con — endpoint thật (PhuHuynhPortalController.getChildren, ChildItemDTO:
      // id/name/className/avatar), trả mảng thô không bọc ApiResponse. /phu-huynh/children (cũ)
      // không tồn tại, khiến danh sách con luôn rỗng dù có liên kết thật.
      try {
        const childrenRes = await api.get('/parents/me/children');
        if (Array.isArray(childrenRes.data)) {
          setChildrenInfo(childrenRes.data);
        }
      } catch (err) {
        console.warn("Could not fetch children list", err);
      }

    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^0\d{9,10}$/;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && !EMAIL_REGEX.test(email)) {
      toast.error('Email liên hệ không đúng định dạng');
      return;
    }
    if (emailNhanThongBao && !EMAIL_REGEX.test(emailNhanThongBao)) {
      toast.error('Email nhận thông báo không đúng định dạng');
      return;
    }
    if (soDienThoai && !PHONE_REGEX.test(soDienThoai)) {
      toast.error('Số điện thoại không đúng định dạng (bắt đầu bằng 0, 10-11 số)');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Cập nhật base user (phone, email)
      await api.put('/nguoi-dung/my-info', {
        email: email || null,
        soDienThoai: soDienThoai || null
      });

      // 2. Cập nhật hồ sơ phụ huynh
      await api.put('/hoso-phuhuynh/my-profile', {
        hoTen,
        emailNhanThongBao
      });

      toast.success('Đã cập nhật thông tin hồ sơ thành công!');
      fetchProfileData();
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi lưu hồ sơ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ các trường');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Mật khẩu hiện tại không đúng');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isLocked = trangThai === 'LOCKED' || trangThai === 'Đã khóa';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hồ sơ cá nhân</h2>
          <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin chi tiết và cài đặt tài khoản của bạn.</p>
        </div>
        <button 
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        
        {/* Phần 1: Form đặc thù Phụ huynh */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm border-4 border-white uppercase overflow-hidden">
                {hoTen.charAt(0) || tenDangNhap.charAt(0) || 'P'}
              </div>
              
              <div className="mt-1">
                <h3 className="text-xl font-bold text-slate-900">{hoTen || 'Chưa cập nhật tên'}</h3>
                <p className="text-sm font-medium text-emerald-600 mt-1">Phụ huynh học sinh</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full mt-3 border border-green-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Tài khoản đã xác thực
                </span>
              </div>
            </div>

            {!showPasswordForm && (
              <button 
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-sm border border-slate-200 shrink-0"
              >
                <KeyRound className="w-4 h-4 text-emerald-600" /> Đổi mật khẩu
              </button>
            )}
          </div>

          {/* Change Password Inline Form */}
          {showPasswordForm && (
            <div className="p-6 bg-emerald-50/30 border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" /> Cập nhật mật khẩu
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="p-1.5 text-slate-400 hover:bg-slate-200 bg-slate-100 rounded-full transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nhập lại mật khẩu</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                    <button
                      type="button"
                      disabled={isChangingPassword}
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <h4 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" /> 
              Thông tin Hồ sơ (Phụ huynh)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                <input type="text" required value={hoTen} onChange={e => setHoTen(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Email nhận thông báo
                </label>
                <input type="email" value={emailNhanThongBao} onChange={e => setEmailNhanThongBao(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> Thông tin con cái (Chỉ đọc)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {childrenInfo.length > 0 ? childrenInfo.map((child: any) => (
                    <div key={child.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex flex-col">
                      <span className="font-semibold text-slate-800">{child.name || child.hoTen || child.fullName || 'Tên học sinh'}</span>
                      <span className="text-xs text-slate-500 mt-1">Lớp: {child.className || child.tenLop || 'Chưa cập nhật'}</span>
                    </div>
                  )) : (
                    <div className="p-4 text-center text-slate-500 text-sm border border-dashed rounded-xl w-full col-span-2 bg-slate-50">
                      Chưa liên kết học sinh nào hoặc đang tải dữ liệu...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phần 2: Thông tin tài khoản chung */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-400" /> 
            Cài đặt Tài khoản
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tên đăng nhập (Chỉ đọc)</label>
              <input type="text" readOnly value={tenDangNhap} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <label className="text-sm font-medium text-slate-700 mb-2">Trạng thái hệ thống</label>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${!isLocked ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {!isLocked ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Email liên hệ
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Số điện thoại
              </label>
              <input type="tel" value={soDienThoai} onChange={e => setSoDienThoai(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</>
            ) : (
              <><Save className="w-5 h-5" /> Lưu tất cả thay đổi</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
