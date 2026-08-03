import React, { useState } from 'react';

export interface GameProps {
  cauHinh: any;
  result: any;
  activeDapAnChuan: any;
  onSubmit: (data: { dapAnDungId: string }) => void;
}

export const HarvestGame: React.FC<GameProps> = ({ cauHinh, result, onSubmit }) => {
  const [spawnSeed] = useState(Math.random());
  const [harvestedIds, setHarvestedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [showSeedAnim, setShowSeedAnim] = useState<{x: number, y: number} | null>(null);

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const harvestSlots = [
    { top: '15%', left: '10%' }, { top: '15%', left: '35%' }, { top: '15%', left: '60%' }, { top: '15%', left: '80%' },
    { top: '35%', left: '15%' }, { top: '35%', left: '45%' }, { top: '35%', left: '75%' },
    { top: '55%', left: '10%' }, { top: '55%', left: '35%' }, { top: '55%', left: '60%' }, { top: '55%', left: '80%' },
    { top: '75%', left: '20%' }, { top: '75%', left: '50%' }, { top: '75%', left: '75%' },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (result || harvestedIds.includes(id)) {
      e.preventDefault();
      return;
    }
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData('text/plain');
    if (droppedId) {
      setHarvestedIds([...harvestedIds, droppedId]);
      onSubmit({ dapAnDungId: droppedId });
    }
    setDraggingId(null);
  };

  const handleHarvestClick = (e: React.MouseEvent, lc: any) => {
    if (result || harvestedIds.includes(lc.id)) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const parentRect = (e.target as HTMLElement).closest('.harvest-area')?.getBoundingClientRect();
    if (parentRect) {
      setShowSeedAnim({ x: rect.left - parentRect.left + rect.width/2, y: rect.top - parentRect.top + rect.height/2 });
      setTimeout(() => setShowSeedAnim(null), 1000);
    }
    setHarvestedIds([...harvestedIds, lc.id]);
    onSubmit({ dapAnDungId: lc.id });
  };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-green-500 rounded-2xl overflow-hidden shadow-2xl border-4 border-green-800 harvest-area flex justify-center">
      
      {/* Question Display */}
      {cauHinh?.cauHoi && (
        <div className="absolute top-24 bg-white/95 px-8 py-3 rounded-2xl shadow-xl border-4 border-amber-500 z-50 text-center max-w-[80%] backdrop-blur-sm">
          <span className="text-xl md:text-2xl font-black text-amber-900 drop-shadow-sm">{cauHinh.cauHoi}</span>
        </div>
      )}

      <div className="absolute inset-0 top-0 bottom-1/3 bg-gradient-to-b from-sky-300 to-sky-100 z-0" />
      <div className="absolute inset-0 top-1/2 bottom-0 bg-green-600 z-0 border-t-2 border-green-700 overflow-hidden flex flex-wrap content-start p-2 gap-4 opacity-70">
        {[...Array(6)].map((_, i) => (
          <div key={`bg-wheat-${i}`} className="w-1/3 h-24 mt-2">
            {React.createElement('lottie-player', {
              src: "/custom-assets/thu-hoach-nong-san/wheat.json",
              autoplay: true,
              loop: true,
              style: { width: '100%', height: '100%', objectFit: 'cover' }
            })}
          </div>
        ))}
      </div>
      <div className="absolute top-4 left-10 w-24 h-12 bg-white/80 rounded-full blur-md animate-pulse z-0" />
      <div className="absolute top-8 right-20 w-32 h-16 bg-white/60 rounded-full blur-md animate-pulse delay-700 z-0" />
      {showSeedAnim && (
        <div 
          className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: showSeedAnim.x, top: showSeedAnim.y, width: '72px', height: '72px' }}
        >
          {React.createElement('lottie-player', {
            src: "/custom-assets/thu-hoach-nong-san/seeds.json",
            autoplay: true,
            loop: false,
            style: { width: '100%', height: '100%' }
          })}
        </div>
      )}
      <div 
        className="absolute left-8 bottom-4 w-44 h-44 z-20 flex flex-col items-center justify-end pb-4 transition-all"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-amber-700/90 border-4 border-amber-900 rounded-b-3xl rounded-t-lg shadow-xl overflow-hidden shadow-inner flex flex-wrap items-end justify-center p-2 z-0">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />
        </div>
        <span className="text-white font-black drop-shadow-md z-10 text-lg">Bỏ vào giỏ</span>
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-2 z-10 overflow-hidden pointer-events-none">
          {harvestedIds.map((id, idx) => {
            const opt = cauHinh?.luaChon?.find((l: any) => l.id === id);
            if (!opt) return null;
            return (
              <div key={`harvested-${id}-${idx}`} className="w-10 h-10 bg-white/90 rounded border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-800 shadow-sm animate-in zoom-in-50">
                {opt.noiDung.substring(0,2)}
              </div>
            );
          })}
        </div>
      </div>
      {(() => {
        const opts = [...(cauHinh?.luaChon || [])];
        opts.sort((a, b) => seededRandom(spawnSeed + a.id.charCodeAt(0)) - 0.5);
        return opts.map((lc: any, i: number) => {
          if (harvestedIds.includes(lc.id)) return null;
          const slot = harvestSlots[i % harvestSlots.length];
          return (
            <div
              key={lc.id}
              className="absolute z-10 flex items-center justify-center"
              style={{ top: slot.top, left: slot.left, transform: 'translate(-50%, -50%)' }}
            >
              {[...Array(6)].map((_, idx) => (
                <div 
                  key={`wheat-${lc.id}-${idx}`} 
                  className="absolute w-24 h-24 pointer-events-none -z-10"
                  style={{ transform: `scale(${1 + idx*0.1}) rotate(${idx*15 - 30}deg) translateY(10px)`, opacity: 0.8 }}
                >
                  {React.createElement('lottie-player', {
                    src: "/custom-assets/thu-hoach-nong-san/wheat.json",
                    autoplay: true,
                    loop: true,
                    style: { width: '100%', height: '100%' }
                  })}
                </div>
              ))}
              <button
                draggable={!result}
                onDragStart={(e) => handleDragStart(e, lc.id)}
                onClick={(e) => handleHarvestClick(e, lc)}
                className={`relative px-4 py-2 bg-white/95 rounded-xl border-2 border-slate-300 font-bold text-slate-700 shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${draggingId === lc.id ? 'opacity-50' : 'opacity-100'}`}
              >
                {lc.noiDung}
              </button>
            </div>
          );
        });
      })()}
    </div>
  );
};
