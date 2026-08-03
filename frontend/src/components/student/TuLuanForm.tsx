import React, { useState } from 'react';
import { PenTool, CheckCircle2, Loader2 } from 'lucide-react';
import LessonVisual from './LessonVisual';

export interface TuLuanFormProps {
  cauHinh: any;
  result: any;
  onSubmit: (baiLam: any) => void;
  submitting: boolean;
}

export default function TuLuanForm({ cauHinh, result, onSubmit, submitting }: TuLuanFormProps) {
  const [traLoi, setTraLoi] = useState('');
  
  const hasResult = result != null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasResult || submitting || !traLoi.trim()) return;
    onSubmit({ traLoi: traLoi.trim() });
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-8 rounded-[2.5rem] custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto space-y-8 pb-16">
        
        {/* De bai (Prompt) Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/80 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-student-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-student-primary/10 flex items-center justify-center text-student-primary">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Tự luận</h3>
          </div>
          
          {cauHinh?.trucQuan && <LessonVisual data={cauHinh.trucQuan} />}
          
          {cauHinh?.noiDung && (
            <div className="text-slate-700 max-w-3xl leading-[2.2] whitespace-pre-wrap bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8 text-left w-full shadow-sm text-lg font-medium">
              {cauHinh.noiDung}
            </div>
          )}

          {cauHinh?.thanhPhanCauHoi && Array.isArray(cauHinh.thanhPhanCauHoi) && cauHinh.thanhPhanCauHoi.length > 0 && (
            <div className="flex flex-col items-start space-y-4 w-full mb-8">
              {cauHinh.thanhPhanCauHoi.map((tp: any, index: number) => {
                if (tp.type === 'image') {
                  return <img key={index} src={tp.url || tp.content} alt="Content" className="max-h-64 rounded-2xl shadow-md border border-slate-200" />;
                }
                if (tp.type === 'audio') {
                  return <audio key={index} src={tp.url || tp.content} controls className="w-full max-w-md" />;
                }
                return <p key={index} className="text-xl font-bold text-slate-800">{tp.content}</p>;
              })}
            </div>
          )}

          {/* Answer Textarea */}
          <div className="mt-8">
            <h4 className="text-lg font-bold text-slate-700 mb-4">Câu trả lời của em:</h4>
            <textarea
              value={hasResult ? (result.chiTietBaiLam?.traLoi || traLoi) : traLoi}
              onChange={(e) => setTraLoi(e.target.value)}
              disabled={hasResult || submitting}
              placeholder="Nhập câu trả lời của em vào đây..."
              className="w-full min-h-[200px] p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 focus:border-student-primary focus:ring-4 focus:ring-student-primary/10 outline-none transition-all text-lg font-medium text-slate-700 resize-y custom-scrollbar disabled:opacity-70 disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* Submit Action */}
        {!hasResult && (
          <div className="flex justify-center">
             <button
                onClick={handleSubmit}
                disabled={submitting || !traLoi.trim()}
                className="group relative px-10 py-4 bg-student-primary hover:bg-student-primary/90 text-white font-bold text-lg rounded-2xl transition-all shadow-[0_8px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
              >
                <div className="flex items-center justify-center space-x-3">
                  {submitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  )}
                  <span>{submitting ? 'Đang nộp bài...' : 'Nộp bài'}</span>
                </div>
              </button>
          </div>
        )}
      </div>
    </div>
  );
}
