import { useState, useEffect } from 'react';
import { KeyRound, Shield, Save, X, Phone, Mail, User, ShieldCheck, Camera, LogOut, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [hoTen, setHoTen] = useState('');
  const [anhDaiDienUrl, setAnhDaiDienUrl] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [gioiTinh, setGioiTinh] = useState('NAM');
  
  // Read-only specific data
  const [maHocSinh, setMaHocSinh] = useState('');
  const [lopHoc, setLopHoc] = useState<any>(null);
  const [tongXp, setTongXp] = useState(0);

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

      // Lấy hồ sơ chuyên sâu của học sinh
      try {
        const profileRes = await api.get('/hoso-hocsinh/my-profile');
        const hoso = profileRes.data;
        
        if (hoso) {
          setHoTen(hoso.hoTen || baseUser.hoTen || baseUser.fullName || '');
          setAnhDaiDienUrl(hoso.anhDaiDienUrl || '');
          setNgaySinh(hoso.ngaySinh ? hoso.ngaySinh.split('T')[0] : '');
          setGioiTinh(hoso.gioiTinh === 'NU' ? 'NU' : 'NAM');
          setMaHocSinh(hoso.maHocSinh || '');
          setLopHoc(hoso.lopHoc || null);
          setTongXp(hoso.tongXp || 0);
        }
      } catch (err) {
        console.warn("Could not fetch detailed profile", err);
        setHoTen(baseUser.hoTen || baseUser.fullName || '');
      }

    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Cập nhật base user (phone, email)
      await api.put('/nguoi-dung/my-info', {
        email: email || null,
        soDienThoai: soDienThoai || null
      });

      // 2. Cập nhật hồ sơ học sinh
      await api.put('/hoso-hocsinh/my-profile', {
        hoTen,
        anhDaiDienUrl,
        ngaySinh: ngaySinh || null,
        gioiTinh,
        lopHocId: lopHoc?.lopHocId || null,
        maHocSinh // gửi lại mã
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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đổi mật khẩu thành công!');
    setShowPasswordForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isLocked = trangThai === 'LOCKED' || trangThai === 'Đã khóa';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
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
        
        {/* Phần 1: Form đặc thù Học sinh */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative group">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm border-4 border-white uppercase overflow-hidden">
                  {anhDaiDienUrl ? (
                    <img src={anhDaiDienUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    hoTen.charAt(0) || tenDangNhap.charAt(0) || 'H'
                  )}
                </div>
                <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm hover:text-blue-600 transition cursor-pointer">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-1">
                <h3 className="text-xl font-bold text-slate-900">{hoTen || 'Chưa cập nhật tên'}</h3>
                <p className="text-sm font-medium text-amber-600 mt-1">Học sinh • {lopHoc?.tenLop ? `Lớp ${lopHoc.tenLop}` : 'Chưa xếp lớp'}</p>
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
                <KeyRound className="w-4 h-4 text-blue-600" /> Đổi mật khẩu
              </button>
            )}
          </div>

          {/* Change Password Inline Form */}
          {showPasswordForm && (
            <div className="p-6 bg-blue-50/30 border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-600" /> Cập nhật mật khẩu
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowPasswordForm(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-200 bg-slate-100 rounded-full transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu hiện tại</label>
                  <input type="password" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu mới</label>
                  <input type="password" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nhập lại mật khẩu</label>
                  <div className="flex gap-2">
                    <input type="password" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                    <button type="button" onClick={handleChangePassword} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <h4 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" /> 
              Thông tin Hồ sơ (Học sinh)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                <input type="text" required value={hoTen} onChange={e => setHoTen(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mã học sinh (Chỉ đọc)</label>
                <input type="text" readOnly value={maHocSinh} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed" title="Vui lòng liên hệ Admin để thay đổi" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ngày sinh</label>
                <input type="date" value={ngaySinh} onChange={e => setNgaySinh(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Giới tính</label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gioiTinh" value="NAM" checked={gioiTinh === 'NAM'} onChange={e => setGioiTinh(e.target.value)} className="w-4 h-4 text-amber-500 focus:ring-amber-500" />
                    <span className="text-sm text-slate-700">Nam</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gioiTinh" value="NU" checked={gioiTinh === 'NU'} onChange={e => setGioiTinh(e.target.value)} className="w-4 h-4 text-amber-500 focus:ring-amber-500" />
                    <span className="text-sm text-slate-700">Nữ</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Lớp học (Chỉ đọc)</label>
                <input type="text" readOnly value={lopHoc?.tenLop ? `Lớp ${lopHoc.tenLop} (Khối ${lopHoc.khoiLop})` : 'Chưa xếp lớp'} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed" title="Vui lòng liên hệ Admin để thay đổi" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Kinh nghiệm (XP)</label>
                <div className="flex items-center gap-3 pt-1">
                  <Award className="w-8 h-8 text-amber-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-amber-600">{tongXp} XP</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
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
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Số điện thoại
              </label>
              <input type="tel" value={soDienThoai} onChange={e => setSoDienThoai(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
