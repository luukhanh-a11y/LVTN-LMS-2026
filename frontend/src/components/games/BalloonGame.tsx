import React, { useState, useEffect } from 'react';

export interface GameProps {
  cauHinh: any;
  result: any;
  activeDapAnChuan: any;
  onSubmit: (data: { dapAnDungId: string }) => void;
}

export const BalloonGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const [poppedIds, setPoppedIds] = useState<string[]>([]);
  const [wrongBalloonId, setWrongBalloonId] = useState<string | null>(null);

  const handleBalloonPop = (lc: any) => {
    if (result || poppedIds.includes(lc.id)) return;
    const isCorrect = (activeDapAnChuan?.dapAnDungId || activeDapAnChuan) === lc.id;
    if (isCorrect) {
      setPoppedIds([...poppedIds, lc.id]);
      onSubmit({ dapAnDungId: lc.id });
    } else {
      setWrongBalloonId(lc.id);
      setTimeout(() => setWrongBalloonId(null), 1000);
    }
  };

  // Predefined balloon colors for variety
  const balloonColors = [
    { bg: 'bg-red-500', string: 'bg-red-300' },
    { bg: 'bg-blue-500', string: 'bg-blue-300' },
    { bg: 'bg-green-500', string: 'bg-green-300' },
    { bg: 'bg-yellow-400', string: 'bg-yellow-200' },
    { bg: 'bg-purple-500', string: 'bg-purple-300' },
    { bg: 'bg-pink-500', string: 'bg-pink-300' }
  ];

  return (
    <div className="relative w-full h-full min-h-[450px] bg-sky-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-sky-400 flex justify-center">
      <style>
        {`
          @keyframes floatUpContinuously {
            0% { transform: translateY(120vh) translateX(0); }
            50% { transform: translateY(10vh) translateX(20px); }
            100% { transform: translateY(-120vh) translateX(-20px); }
          }
          @keyframes floatWobble {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }
          .balloon-container {
            animation: floatUpContinuously linear infinite;
          }
          .balloon-wobble {
            animation: floatWobble 3s ease-in-out infinite;
          }
          .balloon-shape {
            border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
            box-shadow: inset -10px -10px 20px rgba(0,0,0,0.2), inset 10px 10px 20px rgba(255,255,255,0.4);
          }
        `}
      </style>

      {/* Background Lottie Animation */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none mix-blend-multiply flex items-center justify-center">
        {React.createElement('lottie-player', {
          src: "/custom-assets/ban-bong-bay/baloon.json",
          autoplay: true,
          loop: true,
          style: { width: '100%', height: '100%', objectFit: 'cover' }
        })}
      </div>
      
      {/* Question Display */}
      {cauHinh?.cauHoi && (
        <div className="absolute top-24 bg-white/95 px-8 py-3 rounded-2xl shadow-xl border-4 border-sky-300 z-50 text-center max-w-[80%] backdrop-blur-sm">
          <span className="text-xl md:text-2xl font-black text-sky-900 drop-shadow-sm">{cauHinh.cauHoi}</span>
        </div>
      )}

      {/* Cloud Decorations */}
      <div className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full blur-[2px] opacity-80" />
      <div className="absolute top-20 right-10 w-32 h-14 bg-white rounded-full blur-[2px] opacity-80" />
      <div className="absolute top-40 left-32 w-16 h-8 bg-white rounded-full blur-[2px] opacity-60" />

      {/* Interactive Balloons */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {cauHinh.luaChon.map((lc: any, idx: number) => {
          const isPopped = poppedIds.includes(lc.id);
          const isWrong = wrongBalloonId === lc.id;
          
          const color = balloonColors[idx % balloonColors.length];
          const animDuration = 8 + (idx % 3) * 2; // 8s, 10s, 12s to float up
          const animDelay = (idx % 4) * -2.5; // Staggered start times

          if (isPopped) {
            return (
              <div 
                key={lc.id} 
                className="absolute flex items-center justify-center animate-out fade-out zoom-out duration-1000"
                style={{
                   left: `${15 + (idx * (80 / Math.max(1, cauHinh.luaChon.length - 1))) - 10}%`,
                   bottom: '50%'
                }}
              >
                <span className="text-6xl drop-shadow-lg">💥</span>
              </div>
            );
          }

          return (
            <div 
              key={lc.id} 
              className="balloon-container absolute bottom-[-150px] pointer-events-auto"
              style={{
                left: `${15 + (idx * (80 / Math.max(1, cauHinh.luaChon.length - 1))) - 10}%`,
                animationDuration: `${animDuration}s`,
                animationDelay: `${animDelay}s`
              }}
            >
              <button
                onClick={() => handleBalloonPop(lc)}
                disabled={!!result}
                className={`relative flex flex-col items-center justify-center balloon-wobble transition-all hover:scale-110 group focus:outline-none ${isWrong ? 'animate-shake' : ''}`}
              >
                {/* Balloon Body */}
                <div className={`relative w-24 h-32 ${color.bg} balloon-shape flex items-center justify-center cursor-pointer transition-transform duration-200`}>
                  {/* Tie */}
                  <div className={`absolute -bottom-2 w-4 h-4 \${color.bg} rotate-45`}></div>
                  
                  {/* Text Label on Balloon */}
                  <span className="font-black text-white text-xl drop-shadow-md z-10 px-2 text-center leading-tight">
                    {lc.noiDung || lc.content || lc.text || (typeof lc === 'string' ? lc : lc.id)}
                  </span>
                  
                  {isWrong && (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl text-red-500 z-20 animate-in zoom-in">
                      ❌
                    </div>
                  )}
                </div>
                
                {/* Balloon String */}
                <div className="w-0.5 h-16 bg-white/50 mt-2 rounded-full relative">
                  <div className="absolute w-2 h-0.5 bg-white/50 top-4 -left-1 rotate-12"></div>
                  <div className="absolute w-2 h-0.5 bg-white/50 top-8 -right-1 -rotate-12"></div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
