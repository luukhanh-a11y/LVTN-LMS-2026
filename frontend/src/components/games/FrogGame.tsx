import React, { useState, useEffect } from 'react';
export interface GameProps {
  cauHinh: any;
  result: any;
  activeDapAnChuan: any;
  onSubmit: (data: { dapAnDungId: string }) => void;
}

export const FrogGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const [echStep, setEchStep] = useState(0);
  const [echWrong, setEchWrong] = useState(false);
  const [echOnRightBank, setEchOnRightBank] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    if (result) {
      const isPassed = Number(result.diem) === 10;
      if (isPassed) {
        setEchStep(1);
        setTimeout(() => setEchOnRightBank(true), 800);
      } else {
        setEchWrong(true);
      }
    }
  }, [result]);

  const handleEchJump = (lc: any) => {
    if (result) return;
    setSelectedId(lc.id);
    onSubmit({ dapAnDungId: lc.id });
  };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-sky-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-600">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
      >
        <source src="/custom-assets/ech-qua-song/water_bg.mp4" type="video/mp4" />
      </video>

      {/* Question Display */}
      {cauHinh?.cauHoi && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white/95 px-8 py-3 rounded-2xl shadow-xl border-4 border-emerald-400 z-50 text-center max-w-[80%] backdrop-blur-sm">
          <span className="text-xl md:text-2xl font-black text-emerald-900 drop-shadow-sm">{cauHinh.cauHoi}</span>
        </div>
      )}

      {/* LEFT BANK (Bờ Xuất Phát) */}
      <div className="absolute top-0 bottom-0 left-0 w-[20%] bg-green-600 z-10 border-r-4 border-green-800 shadow-[10px_0_15px_rgba(0,0,0,0.3)] rounded-r-3xl flex flex-col items-center">
        {/* Tree at top */}
        <div className="absolute -top-2 left-0 w-32 h-40 pointer-events-none origin-bottom animate-pulse">
          {React.createElement('lottie-player', {
            src: "/custom-assets/ech-qua-song/Tree in the wind.json",
            autoplay: true,
            loop: true,
            style: { width: '100%', height: '100%', transform: 'scale(1.2)' }
          })}
        </div>
        
        {/* Grass at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none">
          {React.createElement('lottie-player', {
            src: "/custom-assets/ech-qua-song/grass.json",
            autoplay: true,
            loop: true,
            style: { width: '100%', height: '100%' }
          })}
        </div>

        <span className="text-xs text-green-100 font-bold mb-2 z-10 mt-10">BỜ SÔNG</span>
        
        {/* Frog (140px size, centered) */}
        <div className={`transition-all duration-700 absolute top-1/2 -translate-y-1/2 z-20 w-[140px] h-[140px] ${
          echStep === 1 || echOnRightBank ? 'opacity-0 scale-50 translate-x-10 -translate-y-20' : 'opacity-100 scale-100'
        } ${echWrong ? 'animate-bounce drop-shadow-[0_10px_10px_rgba(255,0,0,0.5)]' : 'drop-shadow-xl'}`}>
          {React.createElement('lottie-player', {
            src: "/custom-assets/ech-qua-song/frog_jump.json",
            autoplay: true,
            loop: true,
            style: { width: '100%', height: '100%' }
          })}
        </div>
      </div>

      {/* RIGHT BANK (Đích Đến - Một Ngôi Nhà Duy Nhất) */}
      <div className="absolute top-0 bottom-0 right-0 w-[20%] bg-emerald-600 z-10 border-l-4 border-emerald-800 shadow-[-10px_0_15px_rgba(0,0,0,0.3)] rounded-l-3xl flex flex-col items-center justify-center">
        <span className="text-xs text-emerald-100 font-bold mt-2 z-10 absolute top-10">ĐÍCH</span>
        
        <div className="absolute top-1/2 -translate-y-1/2 w-48 h-48 drop-shadow-2xl z-0">
          {React.createElement('lottie-player', {
            src: "/custom-assets/ech-qua-song/House.json",
            autoplay: true,
            loop: true,
            style: { width: '100%', height: '100%' }
          })}
        </div>

        {/* Tree at bottom right for decor */}
        <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-10">
          {React.createElement('lottie-player', {
            src: "/custom-assets/ech-qua-song/Tree in the wind.json",
            autoplay: true,
            loop: true,
            style: { width: '100%', height: '100%', transform: 'scale(1)' }
          })}
        </div>

        {echOnRightBank && (
          <div className="absolute top-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] animate-in zoom-in spin-in-12 drop-shadow-2xl">
            {React.createElement('lottie-player', {
              src: "/custom-assets/ech-qua-song/frog_jump.json",
              autoplay: true,
              loop: true,
              style: { width: '100%', height: '100%' }
            })}
          </div>
        )}
      </div>

      {/* RIVER & LILY PADS (Đáp Án) */}
      <div className="absolute inset-0 left-[20%] right-[20%] z-0 flex flex-wrap items-center justify-center gap-6 p-4">
        {cauHinh.luaChon.map((lc: any) => {
          const isSelected = selectedId === lc.id;
          const isCorrectAnswer = result && (activeDapAnChuan?.dapAnDungId || activeDapAnChuan) === lc.id;
          const isWrongSelection = result && isSelected && Number(result.diem) < 10;
          return (
            <button
              key={lc.id}
              onClick={() => handleEchJump(lc)}
              disabled={!!result}
              className={`relative flex items-center justify-center w-36 h-36 transition-all duration-300 group focus:outline-none ${
                isWrongSelection ? 'hue-rotate-180 brightness-75 scale-90' : 'hover:scale-110'
              }`}
            >
              {/* Ripple effect */}
              <div className="absolute inset-4 bg-white/20 rounded-full blur-md animate-ping opacity-0 group-hover:opacity-100" />
              {/* Lily pad Lottie from add.json */}
              <div className={`absolute inset-0 drop-shadow-lg transition-transform ${isWrongSelection ? 'animate-shake' : 'group-hover:-translate-y-2'}`}>
                {React.createElement('lottie-player', {
                  src: "/custom-assets/ech-qua-song/add.json",
                  autoplay: true,
                  loop: true,
                  style: { width: '100%', height: '100%' }
                })}
              </div>

              {/* Text absolute overlay with Correct/Wrong Glow Effects */}
              <div className={`absolute -bottom-2 px-5 py-2 rounded-xl border-2 shadow-lg z-20 transition-all duration-500 ${
                isCorrectAnswer ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-[0_0_25px_rgba(16,185,129,1)] scale-125 -translate-y-6' :
                isWrongSelection ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-[0_0_15px_rgba(244,63,94,0.8)]' :
                'bg-white/95 border-emerald-300 text-emerald-900 group-hover:-translate-y-2'
              }`}>
                <span className="font-black text-base md:text-lg whitespace-nowrap">{lc.noiDung}</span>
              </div>

              {isWrongSelection && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl animate-bounce z-20 drop-shadow-md">
                  💦
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
