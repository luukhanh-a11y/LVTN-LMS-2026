import React, { useState } from 'react';
import type { GameProps } from './HarvestGame';

export const MillionaireGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (result) return;
    setSelectedId(id);
    onSubmit({ dapAnDungId: id });
  };

  const getOptionClass = (id: string) => {
    if (result) {
      const isCorrect = (activeDapAnChuan?.dapAnDungId || activeDapAnChuan) === id;
      if (isCorrect) return 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.8)]';
      if (selectedId === id) return 'bg-rose-600 border-rose-400 text-white shadow-[0_0_20px_rgba(225,29,72,0.8)]';
      return 'bg-slate-800 border-slate-600 text-slate-400 opacity-60';
    }
    if (selectedId === id) {
      return 'bg-amber-500 border-amber-300 text-white shadow-[0_0_20px_rgba(245,158,11,0.8)] scale-105';
    }
    return 'bg-[#0f172a] border-[#38bdf8] text-white hover:bg-[#1e293b] hover:border-[#7dd3fc] hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]';
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="relative w-full h-full min-h-[450px] bg-[#020617] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1e3a8a] flex flex-col justify-center items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900 via-[#020617] to-black z-0" />
      
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {cauHinh?.cauHoi && (
        <div className="relative z-10 w-full max-w-4xl px-4 mt-8 mb-16">
          <div className="relative py-6 px-12 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent text-center border-y-4 border-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.5)]">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rotate-45 bg-[#020617] border-r-4 border-t-4 border-[#3b82f6]"></div>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rotate-45 bg-[#020617] border-l-4 border-b-4 border-[#3b82f6]"></div>
             <span className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{cauHinh.cauHoi}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl px-8 grid grid-cols-2 gap-x-12 gap-y-6">
        {cauHinh?.luaChon?.map((opt: any, idx: number) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            disabled={!!result}
            className={`relative py-4 px-8 text-left transition-all border-y-4 shadow-lg group ${getOptionClass(opt.id)}`}
            style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)', borderLeft: 'none', borderRight: 'none' }}
          >
            <span className="font-black text-amber-500 mr-4 text-xl drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]">{letters[idx]}:</span>
            <span className="font-bold text-lg">{opt.noiDung || opt.text || opt.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
