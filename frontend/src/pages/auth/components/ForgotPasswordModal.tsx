import { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/auth.service';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const resetState = () => {
    setStep('email');
    setIsSuccess(false);
    setError('');
    setEmail('');
    setOtp('');
    setNewPassword('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword({ email });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.resetPassword({ email, otp, newPassword });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã OTP hoặc mật khẩu không hợp lệ. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border-4 border-student-primary/10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-student-primary/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
            <Lock className="w-10 h-10 text-student-primary -rotate-3" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Quên mật mã rồi sao?</h3>
          
          {isSuccess ? (
            <div className="animate-in fade-in zoom-in duration-300 mt-6">
              <p className="text-emerald-700 font-bold text-[15px] mb-6 leading-relaxed bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100">
                Đổi mật mã thành công! Giờ cậu có thể đăng nhập bằng mật mã mới rồi nhé! ✨
              </p>
              <Button onClick={handleClose} className="w-full h-12 rounded-full font-bold text-base">
                Tuyệt vời!
              </Button>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={handleSendEmail} className="text-left animate-in fade-in slide-in-from-right-4 duration-300 mt-4">
              <p className="text-slate-500 font-medium text-[15px] mb-6 text-center leading-relaxed">
                Đừng lo lắng nhé! Hãy nhập email của bạn vào đây, hệ thống sẽ gửi mã xác nhận (OTP) cho bạn!
              </p>
              
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 text-red-600 text-[14px] font-bold text-center border border-red-200">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <Input 
                  placeholder="Nhập email của bạn..." 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 h-14 text-base focus:bg-white focus:border-student-primary focus:ring-4 focus:ring-student-primary/20 rounded-2xl transition-all"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl font-bold text-lg"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Gửi mã xác nhận'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="text-left animate-in fade-in slide-in-from-right-4 duration-300 mt-4">
              <p className="text-slate-500 font-medium text-[14px] mb-6 text-center leading-relaxed bg-slate-50 p-3 rounded-xl">
                Mã xác nhận đã được gửi đến <b className="text-student-primary block mt-1">{email}</b>
              </p>
              
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 text-red-600 text-[14px] font-bold text-center border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <Input 
                  placeholder="Mã OTP (6 số)" 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="bg-slate-50 border-slate-200 h-14 focus:bg-white tracking-[0.5em] text-center text-xl font-black rounded-2xl"
                />
                <Input 
                  placeholder="Mật mã bí mật mới" 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 h-14 focus:bg-white rounded-2xl font-medium tracking-[0.2em]"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl font-bold text-lg"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Lưu mật mã mới'}
              </Button>
              
              <button 
                type="button" 
                onClick={() => {
                  setStep('email');
                  setError('');
                }}
                className="w-full mt-5 text-[14px] text-slate-400 hover:text-student-primary font-bold transition-colors underline decoration-2 underline-offset-4"
              >
                Sử dụng email khác
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
