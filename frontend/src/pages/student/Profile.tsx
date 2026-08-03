import { useState, useEffect } from 'react';
import { LogOut, KeyRound, ShieldCheck, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { userService, type StudentDashboardDto } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/useAuthStore';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [dashboard, setDashboard] = useState<StudentDashboardDto | null>(null);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getStudentDashboard()
      .then(data => setDashboard(data))
      .catch(err => console.error("Lỗi lấy dashboard", err));
  }, []);

  const handleLogout = () => {
    // Xóa token và đăng xuất
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setOtpStep(false);
    setOldPassword('');
    setNewPassword('');
    setOtp('');
    setError('');
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.requestChangePasswordOtp(oldPassword);
      toast.success('Mã OTP đã được gửi đến email của bạn.');
      setOtpStep(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mật khẩu hiện tại không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.confirmChangePassword(otp, newPassword);
      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      closePasswordModal();
      handleLogout();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <h1 className="text-3xl font-black text-slate-800">Hồ sơ của em</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Khối thông tin chung */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-student-primary/10 mb-4" />
            <h2 className="text-xl font-bold text-slate-800">{dashboard?.fullName || user?.fullName || 'Đang tải...'}</h2>
            <p className="text-slate-500 font-medium">{dashboard?.className || 'Đang tải...'}</p>
            <div className="w-full mt-6 space-y-3">
              <Button variant="outline" className="w-full justify-center" onClick={() => setShowPasswordModal(true)}>
                <KeyRound className="w-4 h-4 mr-2" /> Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Khối thông tin học tập */}
        <Card className="md:col-span-2">
          <CardHeader>
             <CardTitle>Tiến trình học tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                   <p className="text-sm text-slate-500 font-semibold">Niên khóa</p>
                   <p className="text-lg font-bold text-slate-800">{dashboard?.academicYear || '----'}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 font-semibold">Điểm kinh nghiệm</p>
                   <p className="text-lg font-bold text-amber-500">{dashboard?.totalXp?.toLocaleString() || '0'} XP</p>
                </div>
             </div>

             <h3 className="font-bold text-slate-700 mt-6 mb-2">Lịch sử điểm số (Gần đây)</h3>
             <div className="space-y-3">
               {!dashboard ? (
                 <p className="text-sm text-slate-500 italic">Đang tải lịch sử điểm số...</p>
               ) : dashboard.recentEvaluations.length === 0 ? (
                 <p className="text-sm text-slate-500 italic border border-dashed border-slate-200 p-4 rounded-lg text-center">Chưa có bài tập nào được chấm điểm.</p>
               ) : (
                 dashboard.recentEvaluations.map((evalItem, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                      <div>
                         <p className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-[300px]" title={evalItem.assignmentTitle}>{evalItem.assignmentTitle}</p>
                         <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-[300px]" title={evalItem.comment}>Nhận xét: {evalItem.comment || 'Không có'}</p>
                      </div>
                      <div className="text-right whitespace-nowrap ml-2">
                         <p className={`font-bold text-lg ${evalItem.score ? 'text-student-success' : 'text-student-primary'}`}>
                           {evalItem.score || (evalItem.grade === 'GIOI' ? 'Tốt' : evalItem.grade === 'KHA' ? 'Khá' : evalItem.grade === 'DAT' ? 'Đạt' : 'Chưa đạt')}
                         </p>
                         <p className="text-xs text-slate-400">{evalItem.evaluatedAt}</p>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-student-primary" /> Đổi mật khẩu
              </h3>
              <button onClick={closePasswordModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!otpStep ? (
              <form onSubmit={handleRequestOtp} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
                    {error}
                  </div>
                )}
                <Input
                  label="Mật khẩu cũ"
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? 'Đang gửi mã...' : 'Gửi mã xác nhận OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleConfirmOtp} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
                    {error}
                  </div>
                )}
                <p className="text-sm text-slate-500">
                  Mã OTP đã được gửi đến email của bạn, hiệu lực trong 5 phút.
                </p>
                <Input
                  label="Mã OTP"
                  type="text"
                  placeholder="Nhập mã 6 số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
