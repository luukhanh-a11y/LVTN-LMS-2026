import React, { useState, useEffect } from 'react';
import type { GameProps } from './MatchingGame';

export const SortingGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const [placements, setPlacements] = useState<Record<string, string>>({}); // phaiId -> traiId
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const animals = ['bear', 'cow', 'dog', 'elephant', 'frog', 'giraffe', 'hippo', 'monkey', 'panda', 'penguin', 'pig', 'rabbit', 'tiger', 'zebra', 'owl', 'lion', 'fox'];
  const [itemAnimals, setItemAnimals] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (cauHinh?.cotPhai) {
      const mapping: Record<string, string> = {};
      cauHinh.cotPhai.forEach((item: any, i: number) => {
        mapping[item.id] = animals[i % animals.length];
      });
      setItemAnimals(mapping);
    }
  }, [cauHinh]);


  const categories = cauHinh?.cotTrai || [];
  const items = cauHinh?.cotPhai || [];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (result) {
      e.preventDefault();
      return;
    }
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (result) return;
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) {
      const newPlacements = { ...placements, [itemId]: categoryId };
      setPlacements(newPlacements);
      setDraggingId(null);

      if (Object.keys(newPlacements).length === items.length) {
        setTimeout(() => {
          const capChon = Object.entries(newPlacements).map(([phaiId, traiId]) => ({ phaiId, traiId }));
          onSubmit({ capChon });
        }, 500);
      }
    }
  };

  // Click based fallback for mobile/non-drag
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const handleItemClick = (id: string) => {
    if (result) return;
    setSelectedItem(id === selectedItem ? null : id);
  };
  const handleCategoryClick = (categoryId: string) => {
    if (result || !selectedItem) return;
    const newPlacements = { ...placements, [selectedItem]: categoryId };
    setPlacements(newPlacements);
    setSelectedItem(null);
    if (Object.keys(newPlacements).length === items.length) {
      setTimeout(() => {
        const capChon = Object.entries(newPlacements).map(([phaiId, traiId]) => ({ phaiId, traiId }));
        onSubmit({ capChon });
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-indigo-50 rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-200 flex flex-col items-center pt-8">
      {cauHinh?.cauHoi && (
        <div className="bg-indigo-600 px-8 py-3 rounded-2xl shadow-xl border-4 border-indigo-400 mb-8 z-10">
          <span className="text-xl md:text-2xl font-black text-white">{cauHinh.cauHoi}</span>
        </div>
      )}

      {/* Unplaced Items */}
      {/* Unplaced Items */}
      <div className="w-full max-w-5xl px-8 flex flex-wrap justify-center gap-6 mb-12 min-h-[100px] z-10">
        {items.filter((item: any) => !placements[item.id]).map((item: any) => (
          <div
            key={item.id}
            draggable={!result}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onClick={() => handleItemClick(item.id)}
            className={`relative flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 ${
              selectedItem === item.id ? 'scale-125 z-20' : 'hover:-translate-y-2 hover:scale-110 z-10'
            }`}
          >
            <div className={`w-20 h-20 md:w-24 md:h-24 drop-shadow-xl ${selectedItem === item.id ? 'drop-shadow-[0_10px_20px_rgba(99,102,241,0.6)]' : ''}`}>
              <img src={`/custom-assets/data-character-backgroud-for-all-game/Round/${itemAnimals[item.id] || 'dog'}.png`} alt="animal" className="w-full h-full object-contain" />
            </div>
            <div className="mt-1 bg-white/95 px-3 py-1 rounded-lg border-2 border-slate-300 shadow-sm font-bold text-sm md:text-base text-slate-800 text-center whitespace-nowrap">
              {item.noiDung || item.text}
            </div>
            {selectedItem === item.id && (
               <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl -z-10" />
            )}
          </div>
        ))}
      </div>

      {/* Categories */}
      {/* Categories */}
      <div className="w-full max-w-6xl px-4 grid grid-cols-2 gap-8 z-10 flex-1 pb-12 mt-12">
        {categories.map((cat: any, index: number) => {
          const catItems = items.filter((item: any) => placements[item.id] === cat.id);
          const colorClass = index % 2 === 0 ? 'bg-amber-100/90 border-amber-400 text-amber-900' : 'bg-sky-100/90 border-sky-400 text-sky-900';
          const headerClass = index % 2 === 0 ? 'bg-amber-500 text-white border-b-4 border-amber-600' : 'bg-sky-500 text-white border-b-4 border-sky-600';

          return (
            <div
              key={cat.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, cat.id)}
              onClick={() => handleCategoryClick(cat.id)}
              className={`relative flex flex-col rounded-3xl border-4 shadow-2xl overflow-visible transition-all backdrop-blur-sm ${colorClass} ${
                selectedItem ? 'ring-4 ring-offset-4 ring-indigo-400 cursor-pointer hover:scale-105 hover:-translate-y-2' : ''
              }`}
            >
              {/* Wooden Sign Header */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 min-w-[200px] z-20">
                <div className={`w-full py-3 px-6 text-center font-black text-xl md:text-2xl shadow-lg rounded-xl border-4 ${headerClass}`}>
                  {cat.noiDung || cat.text}
                </div>
                {/* Sign ropes/chains */}
                <div className="absolute -top-4 left-6 w-2 h-14 bg-amber-800 -z-10 rounded-full"></div>
                <div className="absolute -top-4 right-6 w-2 h-14 bg-amber-800 -z-10 rounded-full"></div>
              </div>

              <div className="flex-1 p-8 pt-16 flex flex-wrap gap-4 content-start min-h-[250px]">
                {catItems.map((item: any) => {
                  let isCorrect = null;
                  
                  if (result) {
                    const correctMapping = activeDapAnChuan?.capDung?.find((c: any) => c.phaiId === item.id);
                    isCorrect = correctMapping?.traiId === cat.id;
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!result) {
                          const newP = { ...placements };
                          delete newP[item.id];
                          setPlacements(newP);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center animate-in zoom-in-75 duration-300 ${!result && 'cursor-pointer hover:scale-110'}`}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md">
                        <img src={`/custom-assets/data-character-backgroud-for-all-game/Round/${itemAnimals[item.id] || 'dog'}.png`} alt="animal" className="w-full h-full object-contain" />
                      </div>
                      <div className={`mt-1 px-3 py-1 bg-white rounded-lg border-2 font-bold text-sm text-slate-800 shadow-sm ${
                        isCorrect === true ? 'border-emerald-500 bg-emerald-50' : 
                        isCorrect === false ? 'border-rose-500 bg-rose-50 opacity-60' : 'border-slate-300'
                      }`}>
                        {item.noiDung || item.text}
                      </div>
                      
                      {isCorrect === true && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold text-xs">
                          ✓
                        </div>
                      )}
                      {isCorrect === false && (
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold text-xs">
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show correct answers if failed */}
      {result && Number(result.diem) < 10 && activeDapAnChuan?.capDung && (
        <div className="absolute inset-x-8 bottom-4 bg-white/95 p-4 rounded-xl border-2 border-emerald-500 shadow-2xl z-50 flex flex-wrap justify-center gap-4">
          <span className="font-bold text-emerald-700 w-full text-center">Đáp án đúng:</span>
          {activeDapAnChuan.capDung.map((c: any, i: number) => {
            const cat = categories.find((x: any) => x.id === c.traiId);
            const item = items.find((x: any) => x.id === c.phaiId);
            if (!cat || !item) return null;
            return (
              <div key={i} className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded text-sm font-bold text-emerald-800">
                {item.noiDung} ➔ {cat.noiDung}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
