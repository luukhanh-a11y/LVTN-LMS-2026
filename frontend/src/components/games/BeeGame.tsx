import React, { useState, useEffect } from 'react';

export interface GameProps {
  cauHinh: any;
  result: any;
  activeDapAnChuan: any;
  onSubmit: (data: { dapAnTheoCho?: any; capDung?: any; dapAnDungId?: string }) => void;
}

export const BeeGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, {index: number, text: string}>>({});
  const [selectedBlank, setSelectedBlank] = useState<string | null>(null);

  // Parse sentence
  const sentenceParts = [];
  const regex = /\[(c\d+)\]/g;
  let lastIndex = 0;
  let match;
  
  const text = cauHinh?.noiDung || '';

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      sentenceParts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    sentenceParts.push({ type: 'blank', id: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    sentenceParts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  const choices = cauHinh?.danhSachCho?.map((c: any) => typeof c === 'string' ? c : (c.noiDung || c.text || c.value)) || [];

  const handleBlankClick = (id: string) => {
    if (result) return;
    if (answers[id]) {
      const newAns = { ...answers };
      delete newAns[id];
      setAnswers(newAns);
    }
    setSelectedBlank(id);
  };

  const handleChoiceClick = (choice: string, index: number) => {
    if (result) return;
    if (selectedBlank) {
      const newAns = { ...answers, [selectedBlank]: {index, text: choice} };
      setAnswers(newAns);
      setSelectedBlank(null);
      
      const blanks = sentenceParts.filter(p => p.type === 'blank');
      if (Object.keys(newAns).length === blanks.length) {
        // Convert back to Record<string, string> for submission
        const submitData: Record<string, string> = {};
        for (const [k, v] of Object.entries(newAns)) {
           submitData[k] = v.text;
        }
        setTimeout(() => onSubmit({ traLoiTheoCho: submitData }), 500);
      }
    }
  };

  const renderCorrectAnswers = () => {
    if (!result || Number(result.diem) === 10 || !activeDapAnChuan?.dapAnTheoCho) return null;
    return (
      <div className="mt-8 p-4 bg-emerald-100 rounded-xl border-2 border-emerald-400">
        <h4 className="font-bold text-emerald-800 mb-2">Đáp án đúng:</h4>
        <div className="flex flex-wrap gap-2 text-emerald-700">
          {Object.entries(activeDapAnChuan.dapAnTheoCho).map(([k, v]: [string, any]) => (
            <span key={k} className="px-3 py-1 bg-white rounded-lg font-bold shadow-sm">{v[0]}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-sky-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-500 flex flex-col justify-center items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-green-300 z-0 opacity-50" />
      
      {/* Lottie Assets */}
      <div className="absolute top-10 left-10 w-32 h-32 z-0 opacity-80 pointer-events-none drop-shadow-xl animate-pulse">
        {React.createElement('lottie-player', {
          src: "/custom-assets/ong-tim-mat/Flying Bee.json",
          autoplay: true,
          loop: true,
          style: { width: '100%', height: '100%', objectFit: 'contain' }
        })}
      </div>
      <div className="absolute bottom-10 right-10 w-48 h-48 z-0 opacity-60 pointer-events-none drop-shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
        {React.createElement('lottie-player', {
          src: "/custom-assets/ong-tim-mat/awkward bee.json",
          autoplay: true,
          loop: true,
          style: { width: '100%', height: '100%', objectFit: 'contain' }
        })}
      </div>

      <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center">
        {cauHinh?.cauHoi && (
          <div className="bg-amber-100/90 px-8 py-3 rounded-2xl shadow-xl border-4 border-amber-400 mb-12 text-center backdrop-blur-md">
            <span className="text-xl md:text-2xl font-black text-amber-900">{cauHinh.cauHoi}</span>
          </div>
        )}

        {/* Sentence */}
        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-wrap items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-slate-800 leading-loose">
          {sentenceParts.map((part, i) => {
            if (part.type === 'text') return <span key={i}>{part.content}</span>;
            
            const blankId = part.id!;
            const filled = answers[blankId]?.text;
            const isSelected = selectedBlank === blankId;
            
            // Check correctness if result exists
            let bgColor = 'bg-slate-100';
            let borderColor = isSelected ? 'border-amber-500' : 'border-slate-300';
            let textColor = 'text-amber-700';

            if (result) {
              const dapAnList = activeDapAnChuan?.dapAnTheoCho?.[blankId] || [];
              const isCorrect = dapAnList.includes(filled);
              if (isCorrect) {
                bgColor = 'bg-emerald-100';
                borderColor = 'border-emerald-500';
                textColor = 'text-emerald-700';
              } else {
                bgColor = 'bg-rose-100';
                borderColor = 'border-rose-500';
                textColor = 'text-rose-700';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleBlankClick(blankId)}
                disabled={!!result}
                className={`min-w-[80px] h-12 px-4 rounded-xl border-b-4 mx-1 transition-all flex items-center justify-center ${bgColor} ${borderColor} ${textColor} ${isSelected ? 'scale-110 shadow-lg' : 'hover:bg-amber-50'}`}
              >
                {filled || '?'}
              </button>
            );
          })}
        </div>
        
        {renderCorrectAnswers()}

        {/* Word Choices */}
        {!result && !selectedBlank && Object.keys(answers).length < sentenceParts.filter(p => p.type === 'blank').length && (
           <div className="mt-8 text-amber-800 font-bold bg-amber-100/80 px-6 py-2 rounded-full border-2 border-amber-300 animate-pulse">
             Bấm vào một ô trống để điền từ
           </div>
        )}
        <div className="mt-12 flex flex-wrap justify-center gap-4 bg-white/40 p-6 rounded-3xl border-2 border-white/50 backdrop-blur-sm">
          {choices.map((choice: string, i: number) => {
            const isUsed = Object.values(answers).some(a => a.index === i);
            return (
              <button
                key={i}
                onClick={() => handleChoiceClick(choice, i)}
                disabled={!!result || (isUsed && selectedBlank === null)}
                className={`px-6 py-3 rounded-2xl font-black text-xl transition-all shadow-xl border-4 ${
                  isUsed ? 'bg-slate-200 border-slate-300 text-slate-400 scale-95 opacity-60' :
                  'bg-amber-400 border-amber-500 text-amber-900 hover:bg-amber-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(251,191,36,0.5)]'
                }`}
                style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)' }}
              >
                <span className="drop-shadow-sm">{choice}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
