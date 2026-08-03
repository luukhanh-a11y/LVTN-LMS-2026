import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import LessonVisual from './LessonVisual';

export interface QuizFormProps {
  loai: string;
  cauHinh: any;
  dapAnChuan: any;
  result: any;
  onSubmit: (baiLam: any) => void;
  onReset?: () => void;
  submitting: boolean;
  nextLessonId?: number | null;
  subjectId?: string | null;
}

export default function QuizForm({
  loai,
  cauHinh,
  result,
  onSubmit,
  submitting
}: QuizFormProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dienKhuyetValues, setDienKhuyetValues] = useState<Record<string, string>>({});

  // If there's a result, we block further interactions
  const hasResult = result != null;
  const isPassed = hasResult && Number(result.diem) === 10;

  useEffect(() => {
    // Reset selection if result is cleared (e.g. going to next lesson)
    if (!hasResult) {
      setSelectedId(null);
      setDienKhuyetValues({});
    }
  }, [hasResult, cauHinh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasResult || submitting) return;

    if (loai === 'TRAC_NGHIEM' && selectedId) {
      onSubmit({ dapAnDungId: selectedId });
    } else if (loai === 'DIEN_KHUYET' && Object.keys(dienKhuyetValues).length > 0) {
      onSubmit({ traLoiTheoCho: dienKhuyetValues });
    }
  };

  const renderThanhPhan = (tp: any, index: number) => {
    if (tp.type === 'text') {
      return <span key={index}>{tp.content}</span>;
    }
    if (tp.type === 'image') {
      return <img key={index} src={tp.url || tp.content} alt="Content" className="max-h-48 rounded-lg inline-block" />;
    }
    return <span key={index}>{tp.content}</span>;
  };

  const renderInlineBlanks = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[[a-zA-Z0-9_]+\])/g);
    
    return (
      <div className="leading-[3.5rem] text-xl text-slate-700 font-medium whitespace-pre-wrap bg-amber-50/60 p-8 rounded-[2rem] border-2 border-amber-200/50 shadow-inner">
        {parts.map((part, index) => {
          const match = part.match(/^\[([a-zA-Z0-9_]+)\]$/);
          if (match) {
            const blankId = match[1];
            
            let isCorrect = null;
            if (hasResult) {
               const correctAnswers = result.dapAnChuan?.dapAnTheoCho?.[blankId] || result.dapAnChuan?.danhSachDapAn?.[blankId];
               const studentAnswer = dienKhuyetValues[blankId]?.trim().toLowerCase() || '';
               if (correctAnswers) {
                 if (Array.isArray(correctAnswers)) {
                   isCorrect = correctAnswers.some((ans: string) => ans.trim().toLowerCase() === studentAnswer);
                 } else {
                   isCorrect = correctAnswers.trim().toLowerCase() === studentAnswer;
                 }
               }
            }

            return (
              <span key={index} className="inline-block mx-2 relative group">
                <input
                  type="text"
                  value={dienKhuyetValues[blankId] || ''}
                  onChange={(e) => setDienKhuyetValues({ ...dienKhuyetValues, [blankId]: e.target.value })}
                  disabled={hasResult || submitting}
                  className={`inline-input min-w-[120px] max-w-[200px] px-4 py-2 text-center border-b-4 outline-none transition-all font-bold text-xl rounded-t-xl ${
                    hasResult
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-900 shadow-sm'
                        : 'border-rose-500 bg-rose-100 text-rose-900 shadow-sm'
                      : 'border-student-primary/40 focus:border-student-primary focus:bg-white bg-white/60 hover:bg-white'
                  }`}
                  placeholder="..."
                  style={{ width: `${Math.max(120, (dienKhuyetValues[blankId]?.length || 0) * 15 + 40)}px` }}
                />
                {hasResult && isCorrect === false && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border-2 border-rose-200 text-rose-600 text-sm px-4 py-2 rounded-xl shadow-xl whitespace-nowrap z-10 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center pointer-events-none">
                    <span className="text-[10px] uppercase tracking-wider text-rose-400 mb-1">Đáp án đúng</span>
                    {(() => {
                      const ans = result.dapAnChuan?.dapAnTheoCho?.[blankId] || result.dapAnChuan?.danhSachDapAn?.[blankId];
                      return Array.isArray(ans) ? ans[0] : ans;
                    })()}
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-white"></div>
                  </div>
                )}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  const renderDanhSachCho = (danhSach: any[]) => {
    return (
      <div className="flex flex-col space-y-6 bg-amber-50/60 p-8 rounded-[2rem] border-2 border-amber-200/50 shadow-inner">
        {danhSach.map((cho) => {
          const blankId = cho.id;
          let isCorrect = null;
          if (hasResult) {
             const correctAnswers = result.dapAnChuan?.dapAnTheoCho?.[blankId] || result.dapAnChuan?.danhSachDapAn?.[blankId];
             const studentAnswer = dienKhuyetValues[blankId]?.trim().toLowerCase() || '';
             if (correctAnswers) {
               if (Array.isArray(correctAnswers)) {
                 isCorrect = correctAnswers.some((ans: string) => ans.trim().toLowerCase() === studentAnswer);
               } else {
                 isCorrect = correctAnswers.trim().toLowerCase() === studentAnswer;
               }
             }
          }

          return (
            <div key={blankId} className="leading-[3.5rem] text-xl text-slate-700 font-medium whitespace-pre-wrap flex items-center flex-wrap">
              {cho.vanBanTruoc && <span className="mr-2">{cho.vanBanTruoc}</span>}
              <span className="inline-block mx-2 relative group">
                <input
                  type="text"
                  value={dienKhuyetValues[blankId] || ''}
                  onChange={(e) => setDienKhuyetValues({ ...dienKhuyetValues, [blankId]: e.target.value })}
                  disabled={hasResult || submitting}
                  className={`inline-input min-w-[120px] max-w-[200px] px-4 py-2 text-center border-b-4 outline-none transition-all font-bold text-xl rounded-t-xl ${
                    hasResult
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-900 shadow-sm'
                        : 'border-rose-500 bg-rose-100 text-rose-900 shadow-sm'
                      : 'border-student-primary/40 focus:border-student-primary focus:bg-white bg-white/60 hover:bg-white'
                  }`}
                  placeholder="..."
                  style={{ width: `${Math.max(120, (dienKhuyetValues[blankId]?.length || 0) * 15 + 40)}px` }}
                />
                {hasResult && isCorrect === false && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border-2 border-rose-200 text-rose-600 text-sm px-4 py-2 rounded-xl shadow-xl whitespace-nowrap z-10 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center pointer-events-none">
                    <span className="text-[10px] uppercase tracking-wider text-rose-400 mb-1">Đáp án đúng</span>
                    {(() => {
                      const ans = result.dapAnChuan?.dapAnTheoCho?.[blankId] || result.dapAnChuan?.danhSachDapAn?.[blankId];
                      return Array.isArray(ans) ? ans[0] : ans;
                    })()}
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-white"></div>
                  </div>
                )}
              </span>
              {cho.vanBanSau && <span className="ml-2">{cho.vanBanSau}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const isInteractiveSupported = loai === 'TRAC_NGHIEM' || loai === 'DIEN_KHUYET';

  if (!isInteractiveSupported && !cauHinh?.thanhPhanCauHoi && !cauHinh?.noiDung) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
        Dạng bài {loai} chưa được hỗ trợ giao diện mặc định và không có dữ liệu để hiển thị.
      </div>
    );
  }

  const cauHoi = cauHinh?.thanhPhanCauHoi || [];
  const luaChon = cauHinh?.luaChon || cauHinh?.danhSachLuaChon || [];
  const hasReadingPassage = !!cauHinh?.noiDung;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-8 rounded-[2.5rem] custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto space-y-8 pb-16">
        
        {/* Question & Reading Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/80 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-student-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          {hasReadingPassage && loai === 'TRAC_NGHIEM' && (
            <div className="mb-12 bg-slate-50/80 rounded-3xl p-8 md:p-10 border-2 border-slate-100 relative">
              <div className="absolute -top-5 left-10 bg-white px-5 py-2 rounded-2xl shadow-sm border-2 border-slate-100 flex items-center space-x-3 text-student-primary font-black text-sm tracking-wide">
                <BookOpen className="w-5 h-5" />
                <span>BÀI ĐỌC</span>
              </div>
              <div className="text-xl text-slate-700 leading-[2.2] font-medium whitespace-pre-wrap mt-4">
                {cauHinh.noiDung}
              </div>
            </div>
          )}

          <div className="flex items-start space-x-5 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#4da2ff] to-[#3070d6] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 shrink-0 mt-1 relative">
              ?
              <div className="absolute -bottom-1 w-10 h-1 bg-black/20 rounded-full blur-sm"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Câu hỏi</h3>
              <div className="text-2xl md:text-[1.75rem] text-slate-800 leading-[1.6] font-bold">
                {typeof cauHinh?.cauHoi === 'string' ? (
                  <span>{cauHinh.cauHoi}</span>
                ) : (
                  cauHoi.map((tp: any, i: number) => renderThanhPhan(tp, i))
                )}
              </div>
            </div>
          </div>
          
          {cauHinh?.amThanh && (
            <div className="mt-10 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
              <audio controls className="w-full rounded-xl" src={cauHinh.amThanh} />
            </div>
          )}

          {cauHinh?.hinhAnh && (
            <div className="mt-10">
              <img src={cauHinh.hinhAnh} alt="Câu hỏi" className="max-w-full md:max-w-xl max-h-96 object-contain rounded-3xl border-[6px] border-white shadow-2xl mx-auto" />
            </div>
          )}

          {cauHinh?.video && (
            <div className="mt-10 bg-slate-50 p-2 rounded-3xl border-2 border-slate-100 shadow-lg mx-auto max-w-3xl overflow-hidden">
              <video src={cauHinh.video} controls className="w-full rounded-2xl max-h-[400px] object-cover bg-black" />
            </div>
          )}

          {cauHinh?.trucQuan && (
            <div className="mt-10">
              <LessonVisual data={cauHinh.trucQuan} />
            </div>
          )}

          {loai === 'DIEN_KHUYET' && (cauHinh?.danhSachCho || hasReadingPassage) && (
            <div className="mt-12">
              {cauHinh?.danhSachCho ? renderDanhSachCho(cauHinh.danhSachCho) : renderInlineBlanks(cauHinh.noiDung)}
            </div>
          )}
        </div>

        {/* Options Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-5">
            {loai === 'TRAC_NGHIEM' && luaChon.map((lc: any) => {
              const isSelected = selectedId === lc.id;
              
              // Highlight correct/incorrect if has result
              let optionClasses = 'border-slate-200 hover:border-student-primary/50 hover:bg-white text-slate-700 bg-white shadow-sm';
              let icon = null;

              if (hasResult) {
                const isCorrectOption = result.dapAnChuan === lc.id || result.dapAnChuan?.dapAnDungId === lc.id;
                
                if (isCorrectOption) {
                  optionClasses = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-lg ring-4 ring-emerald-500/20 scale-[1.02] z-10';
                  icon = <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
                } else if (isSelected && !isPassed) {
                  optionClasses = 'border-rose-400 bg-rose-50/80 text-rose-900 shadow-md opacity-80';
                  icon = <XCircle className="w-8 h-8 text-rose-400" />;
                } else {
                  optionClasses = 'border-slate-200 bg-slate-50/30 opacity-40';
                }
              } else if (isSelected) {
                optionClasses = 'border-student-primary bg-student-primary/5 text-student-primary shadow-lg ring-4 ring-student-primary/20 scale-[1.02] z-10';
              }

              return (
                <button
                  key={lc.id}
                  type="button"
                  disabled={hasResult || submitting}
                  onClick={() => setSelectedId(lc.id)}
                  className={`w-full text-left p-6 md:p-7 rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between group ${optionClasses}`}
                >
                  <div className="flex items-center space-x-6 flex-1">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 relative ${
                      hasResult ? 'border-transparent' :
                      isSelected ? 'border-student-primary bg-student-primary text-white shadow-inner' : 'border-slate-300 group-hover:border-student-primary/50'
                    }`}>
                      {hasResult ? icon : (
                        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${isSelected ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />
                      )}
                      {!hasResult && isSelected && (
                        <div className="absolute inset-0 rounded-full border border-white/30 m-[2px]"></div>
                      )}
                    </div>
                    <div className={`text-xl md:text-[1.35rem] leading-relaxed w-full flex flex-col items-start ${isSelected && !hasResult ? 'font-black' : 'font-semibold'}`}>
                      {lc.hinhAnh && (
                        <img src={lc.hinhAnh} alt="Lựa chọn" className="max-h-32 rounded-xl mb-3 object-contain mx-auto border-2 border-slate-100" />
                      )}
                      {lc.amThanh && (
                        <audio src={lc.amThanh} controls className="w-full max-w-[200px] mb-3" onClick={e => e.stopPropagation()} />
                      )}
                      <span className="w-full text-center">
                        {lc.elements ? lc.elements.map((tp: any, i: number) => renderThanhPhan(tp, i)) : (lc.noiDung || lc.text || lc.content || lc.value || (typeof lc === 'string' ? lc : JSON.stringify(lc)))}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="pt-8 flex justify-center">
            <button
              type="submit"
              disabled={(!selectedId && Object.keys(dienKhuyetValues).length === 0) || hasResult || submitting}
              className="px-12 py-5 bg-gradient-to-b from-[#4da2ff] to-[#3070d6] hover:from-[#5eb0ff] hover:to-[#387de8] disabled:from-slate-300 disabled:to-slate-400 disabled:opacity-90 text-white text-[1.35rem] font-black rounded-3xl shadow-[0_6px_0_0_#2159b3,0_15px_30px_rgba(48,112,214,0.3)] hover:shadow-[0_4px_0_0_#2159b3,0_10px_20px_rgba(48,112,214,0.2)] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] disabled:shadow-[0_6px_0_0_#94a3b8] disabled:translate-y-0 transition-all flex items-center justify-center min-w-[280px] tracking-wide"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                  ĐANG KIỂM TRA...
                </>
              ) : hasResult ? (
                <div className="flex items-center text-white/90">
                  <CheckCircle2 className="w-8 h-8 mr-3" />
                  ĐÃ NỘP BÀI
                </div>
              ) : (
                'KIỂM TRA ĐÁP ÁN'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
