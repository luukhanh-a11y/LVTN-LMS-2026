import React, { useState, useEffect } from 'react';

export interface GameProps {
  cauHinh: any;
  result: any;
  activeDapAnChuan: any;
  onSubmit: (data: { dapAnTheoCho?: any; capDung?: any; dapAnDungId?: string }) => void;
}

export const MatchingGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [connections, setConnections] = useState<Array<{ traiId: string; phaiId: string }>>([]);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    if (result && activeDapAnChuan?.capDung) {
      setConnections(activeDapAnChuan.capDung);
    }
  }, [result, activeDapAnChuan]);

  const handleLeftClick = (id: string) => {
    if (result) return;
    if (connections.some(c => c.traiId === id)) return;
    setSelectedLeft(id);
    if (selectedRight) {
      makeConnection(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (result) return;
    if (connections.some(c => c.phaiId === id)) return;
    setSelectedRight(id);
    if (selectedLeft) {
      makeConnection(selectedLeft, id);
    }
  };

  const makeConnection = (traiId: string, phaiId: string) => {
    const newConns = [...connections, { traiId, phaiId }];
    setConnections(newConns);
    setSelectedLeft(null);
    setSelectedRight(null);
    setForceUpdate(k => k + 1);

    if (newConns.length === cauHinh.cotTrai?.length) {
      setTimeout(() => {
        onSubmit({ capChon: newConns });
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-slate-900 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.2)] border-4 border-slate-700 flex flex-col justify-center items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0" />
      
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen">
        {React.createElement('lottie-player', {
          src: "/custom-assets/noi-cap-tau-vu-tru/MOVING STAR.json",
          autoplay: true,
          loop: true,
          style: { width: '100%', height: '100%', objectFit: 'cover' }
        })}
      </div>
      <div className="absolute top-10 left-10 w-48 h-48 z-0 opacity-60 pointer-events-none mix-blend-screen animate-pulse">
        {React.createElement('lottie-player', {
          src: "/custom-assets/noi-cap-tau-vu-tru/solar planets.json",
          autoplay: true,
          loop: true,
          style: { width: '100%', height: '100%', objectFit: 'contain' }
        })}
      </div>
      <div className="absolute bottom-10 right-10 w-48 h-48 z-0 opacity-80 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-bounce" style={{ animationDuration: '4s' }}>
        {React.createElement('lottie-player', {
          src: "/custom-assets/noi-cap-tau-vu-tru/Rocket.json",
          autoplay: true,
          loop: true,
          style: { width: '100%', height: '100%', objectFit: 'contain' }
        })}
      </div>

      {cauHinh?.cauHoi && (
        <div className="absolute top-24 bg-slate-800/80 px-8 py-3 rounded-2xl shadow-xl border-2 border-slate-500 z-50 text-center max-w-[80%] backdrop-blur-md">
          <span className="text-xl md:text-2xl font-black text-sky-100 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">{cauHinh.cauHoi}</span>
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl px-8 flex justify-between mt-32 h-[300px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {connections.map((c, i) => {
            const leftEl = document.getElementById(`left-${c.traiId}`);
            const rightEl = document.getElementById(`right-${c.phaiId}`);
            if (!leftEl || !rightEl) return null;
            
            const containerEl = leftEl.parentElement?.parentElement;
            if (!containerEl) return null;
            
            const leftRect = leftEl.getBoundingClientRect();
            const rightRect = rightEl.getBoundingClientRect();
            const containerRect = containerEl.getBoundingClientRect();

            const x1 = leftRect.right - containerRect.left;
            const y1 = leftRect.top - containerRect.top + leftRect.height / 2;
            const x2 = rightRect.left - containerRect.left;
            const y2 = rightRect.top - containerRect.top + rightRect.height / 2;

            const strokeColor = result ? '#34d399' : '#38bdf8'; // brighter green or blue

            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="8" filter={result ? "url(#glow)" : ""} className="animate-in fade-in duration-300" strokeDasharray={result ? "0" : "10,5"} />
            );
          })}
        </svg>

        <div className="flex flex-col gap-6 z-10 w-1/3 justify-center">
          {cauHinh.cotTrai?.map((item: any) => {
            const isConnected = connections.some(c => c.traiId === item.id);
            const isSelected = selectedLeft === item.id;
            return (
              <button id={`left-${item.id}`} key={item.id} onClick={() => handleLeftClick(item.id)} disabled={!!result || isConnected} className={`p-4 rounded-xl font-bold text-lg md:text-xl text-center transition-all border-4 shadow-lg ${
                result && isConnected ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.8)] scale-105' :
                isConnected ? 'bg-slate-700 border-slate-600 text-slate-300 opacity-80' : 
                isSelected ? 'bg-sky-500 border-sky-300 text-white shadow-[0_0_20px_rgba(56,189,248,0.8)] scale-105' : 
                'bg-slate-800 border-sky-600 text-sky-100 hover:bg-slate-700 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]'
              }`}>
                {item.noiDung || item.text || item.value}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-6 z-10 w-1/3 justify-center">
          {cauHinh.cotPhai?.map((item: any) => {
            const isConnected = connections.some(c => c.phaiId === item.id);
            const isSelected = selectedRight === item.id;
            return (
              <button id={`right-${item.id}`} key={item.id} onClick={() => handleRightClick(item.id)} disabled={!!result || isConnected} className={`p-4 rounded-xl font-bold text-lg md:text-xl text-center transition-all border-4 shadow-lg ${
                result && isConnected ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.8)] scale-105' :
                isConnected ? 'bg-slate-700 border-slate-600 text-slate-300 opacity-80' : 
                isSelected ? 'bg-purple-500 border-purple-300 text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] scale-105' : 
                'bg-slate-800 border-purple-600 text-purple-100 hover:bg-slate-700 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
              }`}>
                {item.noiDung || item.text || item.value}
              </button>
            );
          })}
        </div>
      </div>
      
      {!result && connections.length > 0 && (
        <button onClick={() => setConnections([])} className="absolute bottom-8 z-50 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full border-2 border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all">
          Kết nối lại từ đầu
        </button>
      )}
    </div>
  );
};
