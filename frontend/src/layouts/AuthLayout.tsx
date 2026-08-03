import { Outlet } from 'react-router-dom';
import { Rocket, Sparkles, Quote } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-[100dvh] flex bg-slate-50 font-body selection:bg-indigo-200">
      
      {/* Nửa trái: Visual Area (Ẩn trên Mobile) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-indigo-950 flex-col justify-between p-12 lg:p-16">
        
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-screen animate-breathe"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/20 blur-[100px] mix-blend-screen animate-breathe" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-breathe" style={{ animationDelay: '4s' }}></div>
          {/* Lưới chấm bi mờ tạo độ sâu */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Branding Header */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center shadow-2xl shadow-white/10">
            <Rocket className="text-indigo-600 w-8 h-8" />
          </div>
          <span className="font-black text-3xl tracking-[0.1em] text-white drop-shadow-md">
            TITKUL LMS
          </span>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-sm font-bold tracking-widest uppercase mb-8 shadow-inner">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            Nền tảng học tập thế hệ mới
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-10 drop-shadow-xl">
            Học vui hơn,<br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-indigo-300 animate-[shimmer_3s_infinite]">
              hiệu quả hơn.
            </span>
          </h1>
          
          {/* Glassmorphic Testimonial/Quote */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-400 to-fuchsia-400"></div>
            <Quote className="w-12 h-12 text-white/10 absolute right-6 top-6 -rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out" />
            <p className="text-indigo-50 font-medium text-[17px] leading-relaxed relative z-10">
              "Tri thức là bệ phóng vững chắc nhất cho những ước mơ bay cao. Hãy bắt đầu hành trình của bạn ngay hôm nay cùng Titkul LMS!"
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="relative z-10 text-indigo-200/60 font-medium text-sm">
          © 2026 Titkul Education. All rights reserved.
        </div>
      </div>

      {/* Nửa phải: Form Area */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative bg-white lg:rounded-l-[48px] shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-10">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobile Branding (Visible only on small screens) */}
          <div className="flex lg:hidden flex-col items-center mb-10">
             <div className="w-16 h-16 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-600/30 mb-4">
               <Rocket className="text-white w-8 h-8" />
             </div>
             <h1 className="font-black text-3xl tracking-tight text-slate-800">
               TITKUL LMS
             </h1>
          </div>

          {/* Nơi Render các trang như Login, ForgotPassword... */}
          <Outlet />

        </div>
      </div>
      
    </div>
  );
}
