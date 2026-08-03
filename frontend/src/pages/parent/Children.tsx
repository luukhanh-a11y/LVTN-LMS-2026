import { useState, useEffect } from 'react';
import { Users, Loader2, KeyRound, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { parentService } from '../../services/parent.service';
import toast from 'react-hot-toast';

export default function ParentChildren() {
  const [children, setChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [resetTarget, setResetTarget] = useState<{ id: number; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await parentService.getChildren();
        setChildren(data);
      } catch (err) {
        console.error('Failed to fetch children', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const closeResetModal = () => {
    setResetTarget(null);
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    if (newPassword !== confirmPassword) {
      setResetError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    setResetLoading(true);
    setResetError('');
    try {
      await parentService.resetChildPassword(resetTarget.id, newPassword);
      toast.success(`Đã cấp lại mật khẩu cho ${resetTarget.name}.`);
      closeResetModal();
    } catch (err: any) {
      setResetError(err.response?.data?.message || 'Lỗi cấp lại mật khẩu');
    } finally {
      setResetLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Quản lý Hồ sơ con</h1>
      <p className="text-sm text-slate-500 mb-6">
        *Phụ huynh có thể tự cấp lại mật khẩu mới cho con ngay tại đây. Con sẽ bị bắt buộc đổi mật khẩu ở lần đăng nhập tiếp theo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => (
          <Card key={child.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{child.name}</h3>
                    <p className="text-sm text-slate-500">{child.grade} • {child.school}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tên đăng nhập:</span>
                  <span className="font-medium text-slate-800">{child.username}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tổng điểm XP:</span>
                  <span className="font-bold text-amber-500">{child.totalXp} XP</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full justify-center mt-4"
                onClick={() => setResetTarget({ id: child.id, name: child.name })}
              >
                <KeyRound className="w-4 h-4 mr-2" /> Cấp lại mật khẩu
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center">
                <KeyRound className="w-5 h-5 mr-2 text-pro-primary" /> Cấp lại mật khẩu — {resetTarget.name}
              </h3>
              <button onClick={closeResetModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              {resetError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
                  {resetError}
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
              <Button type="submit" className="w-full mt-2" disabled={resetLoading}>
                {resetLoading ? 'Đang xử lý...' : 'Xác nhận cấp lại mật khẩu'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
