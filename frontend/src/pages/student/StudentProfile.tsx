import { useState, useEffect } from 'react';
import { ChevronLeft, School, Hash, LogOut, Settings, Award, Sparkles, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userService } from '../../services/user.service';
import { useAuthStore } from '../../stores/useAuthStore';

export default function StudentProfile() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [profile, setProfile] = useState<any>({
    hoTen: 'Đang tải...',
    maHocSinh: '...',
    tenLop: '...',
    tenTruong: 'Tiểu học LMS',
    tongXP: 0,
    capDo: 1,
    xpToNextLevel: 100
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = (await userService.getMyProfile()) as any;
        const xp = data.totalXp || 0;
        setProfile({
          hoTen: data.fullName || 'Học sinh',
          maHocSinh: data.username || 'HS000',
          tenLop: data.className || data.lopHoc?.tenLop || 'Lớp ?',
          tenTruong: 'LMS 2026',
          tongXP: xp,
          capDo: Math.floor(xp / 100) + 1,
          xpToNextLevel: 100
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const progressPercent = Math.round(((profile.tongXP % profile.xpToNextLevel) / profile.xpToNextLevel) * 100);

  const handleAction = (action: string) => {
    toast(`Đang mở: ${action}`, { icon: '⚙️' });
  };

  const handleLogoutAction = () => {
    toast.success('Đã đăng xuất thành công!', { icon: '👋' });
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 relative">
      
      <div className="max-w-3xl mx-auto p-6 sm:p-8 space-y-8">
        
        {/* HEADER */}
        <header className="flex items-center gap-4">
          <Link to="/student" className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer shadow-sm">
            <ChevronLeft className="w-8 h-8" />
          </Link>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Thông tin</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Hồ Sơ Của Bé
            </h1>
          </div>
        </header>

        {/* THÔNG TIN CÁ NHÂN (Lớp Primary) */}
        <section className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center relative overflow-hidden">
          
          {/* Background trang trí góc trên */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 to-white -z-10"></div>

          {/* Avatar Khổng lồ */}
          <div className="w-32 h-32 mx-auto bg-white rounded-full p-2 border-4 border-blue-100 shadow-sm mb-6 relative">
            <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white">
              <UserCircle className="w-20 h-20" />
            </div>
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-400 border-4 border-white rounded-full flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2">{profile.hoTen}</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-slate-500 mb-8">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Hash className="w-4 h-4" /> {profile.maHocSinh}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <School className="w-4 h-4" /> Lớp {profile.tenLop} - {profile.tenTruong}
            </span>
          </div>

          {/* THANH TIẾN TRÌNH THĂNG CẤP (Gamification) */}
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 text-left">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Cấp độ hiện tại</p>
                <div className="flex items-center gap-2">
                  <Award className="w-8 h-8 text-orange-500" />
                  <span className="text-3xl font-black text-slate-800">LV. {profile.capDo}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-blue-600">{profile.tongXP}</span>
                <span className="text-sm font-bold text-slate-400"> / {profile.xpToNextLevel} XP</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full relative transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>

        </section>

        {/* MENU CÀI ĐẶT (Lớp Secondary) */}
        <section className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="divide-y divide-slate-100">
            
            <button 
              onClick={() => handleAction('Đổi mật khẩu')}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-700 text-lg">Đổi mật khẩu</span>
              </div>
              <ChevronLeft className="w-6 h-6 text-slate-300 rotate-180" />
            </button>

            <button 
              onClick={handleLogoutAction}
              className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                  <LogOut className="w-6 h-6" />
                </div>
                <span className="font-bold text-red-600 text-lg">Đăng xuất</span>
              </div>
              <ChevronLeft className="w-6 h-6 text-red-300 rotate-180" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}