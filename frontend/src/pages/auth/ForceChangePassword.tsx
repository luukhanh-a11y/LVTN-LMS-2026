import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/useAuthStore';
import { ShieldAlert } from 'lucide-react';

export default function ForceChangePassword() {
  const navigate = useNavigate();
  const { user, token, setAuth, logout } = useAuthStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Nếu truy cập trang này mà chưa login, hoặc không có cờ bắt buộc đổi MK thì đá về login
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    } else if (!user.requirePasswordChange) {
      navigate('/');
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: '', // Không cần check mật khẩu cũ trong API nếu cờ requirePasswordChange đang true (Đã xử lý ở Backend)
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi đổi mật khẩu');

      toast.success('Đổi mật khẩu thành công! Chào mừng bạn đến với Titkul LMS.');

      // Cập nhật lại AuthStore để tắt cờ
      if (user && token) {
        const refreshToken = useAuthStore.getState().refreshToken || '';
        setAuth(token, refreshToken, { ...user, requirePasswordChange: false });

        // Chuyển hướng theo Role
        switch (user.role) {
          case 'ADMIN': navigate('/admin'); break;
          case 'GIAO_VIEN': navigate('/teacher'); break;
          case 'HOC_SINH': navigate('/student'); break;
          case 'PHU_HUYNH': navigate('/parent'); break;
          default: navigate('/');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="animate-in fade-in zoom-in duration-300 w-full mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-800">Bảo mật tài khoản</h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          Xin chào <span className="font-bold text-primary">{user.username}</span>! Đây là lần đầu bạn đăng nhập.
          Vui lòng đổi mật khẩu mới để bảo vệ tài khoản nhé.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <Input
          label="Mật khẩu mới"
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" className="w-full h-12 text-[16px] font-bold mt-4" isLoading={isLoading}>
          Cập nhật mật khẩu
        </Button>

        <Button type="button" variant="ghost" className="w-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 mt-2" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </form>
    </div>
  );
}
