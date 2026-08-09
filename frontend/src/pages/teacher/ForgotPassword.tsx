import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ChevronLeft, Send, CheckCircle2, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  // step 1: Nhập Email | step 2: Nhập OTP | step 3: Thành công
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập địa chỉ email!');
      return;
    }
    // Giả lập gọi API POST /api/auth/forgot-password
    toast.success('Mã OTP đã được gửi đến email của bạn!');
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập gọi API POST /api/auth/verify-otp-reset
    toast.success('Xác nhận thành công!');
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">EduTeacher</h1>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          
          {/* BƯỚC 1: NHẬP EMAIL */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Quên mật khẩu?</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Đừng lo lắng! Hãy nhập email liên kết với tài khoản của bạn, chúng tôi sẽ gửi mã xác nhận (OTP) để cấp lại mật khẩu.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email của bạn</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ví dụ: gv.tranlea@truong.edu.vn" 
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-sm cursor-pointer">
                  <Send className="w-4 h-4" /> Gửi mã OTP
                </button>
              </form>
            </div>
          )}

          {/* BƯỚC 2: NHẬP MÃ OTP */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Nhập mã xác nhận</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Chúng tôi đã gửi một mã OTP gồm 6 số tới email <br/>
                  <strong className="text-slate-700">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2 text-center">
                  <label className="text-sm font-semibold text-slate-700">Mã OTP</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    placeholder="• • • • • •" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-center text-2xl tracking-[0.5em] font-bold text-slate-700"
                  />
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-sm cursor-pointer">
                  Xác nhận & Cấp lại mật khẩu
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                Chưa nhận được mã? <button type="button" onClick={() => toast.success('Đã gửi lại mã!')} className="text-blue-600 font-semibold hover:underline cursor-pointer">Gửi lại</button>
              </div>
            </div>
          )}

          {/* BƯỚC 3: THÀNH CÔNG */}
          {step === 3 && (
            <div className="animate-in fade-in duration-300 text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Đã cấp lại mật khẩu!</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Hệ thống đã tạo một mật khẩu mới ngẫu nhiên và gửi thẳng vào email của bạn. Vui lòng kiểm tra hộp thư đến.
              </p>
              <Link to="/" className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-medium cursor-pointer">
                Quay lại trang Đăng nhập
              </Link>
            </div>
          )}

        </div>

        {/* Nút Quay lại chung */}
        {step !== 3 && (
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition">
              <ChevronLeft className="w-4 h-4" /> Quay lại đăng nhập
            </Link>
          </div>
        )}
        
      </div>
    </div>
  );
}
