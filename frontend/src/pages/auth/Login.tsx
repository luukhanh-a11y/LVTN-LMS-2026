import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PageTitle } from '../../components/ui/PageTitle';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/auth.service';
import { User, Lock, Sparkles, Volume2, Loader2, Star, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Chào buổi sáng! ☀️");
    else if (hour >= 12 && hour < 18) setGreeting("Buổi chiều vui vẻ! 🌤️");
    else if (hour >= 18 && hour < 23) setGreeting("Học buổi tối nào! 🌙");
    else setGreeting("Khuya rồi, đi ngủ sớm nhé! 🦉");
  }, []);

  const playAudioHint = () => {
    window.speechSynthesis.cancel();
    const text = "Chào mừng bạn đến với Titkul L M S! Hãy nhập tên đăng nhập và mật mã bí mật để bắt đầu nhé!";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const authData = await authService.login({ username, password });
      setAuth(authData.accessToken, authData.refreshToken, authData.user);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
      });

      setTimeout(() => {
        if (authData.user.requirePasswordChange) {
          navigate('/force-change-password');
        } else {
          switch (authData.user.role) {
            case 'ADMIN': navigate('/admin'); break;
            case 'GIAO_VIEN': navigate('/teacher'); break;
            case 'HOC_SINH': navigate('/student'); break;
            case 'PHU_HUYNH': navigate('/select-child'); break;
            default: navigate('/');
          }
        }
      }, 1000);

    } catch (err: any) {
      const details = err.response?.data?.details;
      let errorMessage = 'Ôi, tên đăng nhập hoặc mật mã chưa đúng rồi! Thử lại nhé 🐢';

      if (details && details.length > 0) {
        errorMessage = `Ôi, ${details[0].issue} chưa đúng rồi! Thử lại nhé 🐢`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="mb-10 text-center lg:text-left">
          <PageTitle as="h2" className="text-3xl font-black text-slate-800 tracking-tight mb-2">
            {greeting}
          </PageTitle>
          <p className="text-slate-500 font-medium text-base">
            Vui lòng nhập thông tin để truy cập vào hệ thống
          </p>
        </div>

        <form onSubmit={handleLogin} className={`space-y-6 ${isShaking ? 'animate-shake' : ''}`} autoComplete="off">
          {error && (
            <div className="px-4 py-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-[14px] font-bold flex items-center gap-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-bold text-slate-700 flex items-center ml-1">
                Tên đăng nhập
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-student-primary transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Biệt danh / Mã số"
                  className="w-full pl-11 pr-4 h-14 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-student-primary focus:ring-4 focus:ring-student-primary/10 rounded-2xl text-base font-medium text-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-bold text-slate-700 flex items-center justify-between ml-1">
                <span>Mật mã bí mật</span>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-student-primary hover:text-student-accent transition-colors text-sm font-bold"
                >
                  Quên mật mã?
                </button>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-student-primary transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 h-14 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-student-primary focus:ring-4 focus:ring-student-primary/10 rounded-2xl text-lg tracking-[0.2em] font-medium text-slate-900 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-student-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-2">
            <label className="flex items-center gap-3 cursor-pointer group w-fit py-1">
              <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-200 peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-all shadow-sm flex items-center justify-center group-hover:border-slate-300">
                  <Star className="w-3.5 h-3.5 text-white fill-white opacity-0 peer-checked:opacity-100 transition-opacity drop-shadow-sm" />
                </div>
              </div>
              <span className="text-[15px] text-slate-600 font-bold group-hover:text-slate-900 transition-colors">
                Ghi nhớ tớ nha!
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="student-primary"
            size="lg"
            disabled={isLoading}
            className="w-full text-lg mt-8 group overflow-hidden relative"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {isLoading ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 relative z-10">
                Bắt đầu ngay <Sparkles className="w-5 h-5 text-indigo-200" />
              </span>
            )}
          </Button>
          
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={playAudioHint}
              className="flex items-center gap-2 text-student-primary bg-student-primary/10 hover:bg-student-primary/20 border border-student-primary/20 px-5 py-2.5 rounded-full font-bold transition-all text-sm shadow-sm active:scale-95 w-fit"
            >
              <Volume2 size={18} className="text-student-primary" /> Nghe hướng dẫn
            </button>
          </div>
        </form>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
    </>
  );
}
