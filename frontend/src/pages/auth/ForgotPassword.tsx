import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword({ email });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi gửi OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.verifyOtpReset({ email, otp });
      toast.success('Xác nhận thành công! Mật khẩu mới đã được gửi về email của bạn.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/login" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đăng nhập
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Quên mật khẩu</h1>
        <p className="text-slate-500 mt-2">
          {step === 1 ? 'Nhập Email để nhận mã OTP' : 'Nhập mã OTP đã được gửi đến bạn'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <Input 
            label="Email" 
            type="email"
            placeholder="Ví dụ: phuhuynh@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi mã xác nhận (OTP)'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <Input
            label="Mã OTP (6 chữ số)"
            placeholder="123456"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <p className="text-sm text-slate-500">
            Xác nhận đúng mã OTP, hệ thống sẽ tự tạo mật khẩu mới và gửi về email của bạn. Bạn sẽ được yêu cầu đổi lại mật khẩu ngay lần đăng nhập kế tiếp.
          </p>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </form>
      )}
    </div>
  );
}
