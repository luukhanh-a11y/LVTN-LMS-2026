import React from 'react';
import { Lightbulb } from 'lucide-react';
import LessonVisual from './LessonVisual';

export interface LyThuyetFormProps {
  cauHinh: any;
}

export default function LyThuyetForm({ cauHinh }: LyThuyetFormProps) {
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-8 rounded-[2.5rem] custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto space-y-8 pb-16">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/80 relative overflow-hidden flex flex-col items-center text-center">
          {/* Decorative Corner */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-student-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <Lightbulb className="w-16 h-16 mb-4 text-student-primary" strokeWidth={1.5} />
          <h3 className="text-2xl font-black text-slate-800 mb-8">Lý thuyết</h3>
          
          {cauHinh?.trucQuan && <LessonVisual data={cauHinh.trucQuan} />}
          
          {cauHinh?.noiDung && (
            <div className="text-slate-700 max-w-3xl leading-[2.2] whitespace-pre-wrap bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8 text-left w-full shadow-sm text-lg font-medium">
              {cauHinh.noiDung}
            </div>
          )}

          {cauHinh?.thanhPhanCauHoi && Array.isArray(cauHinh.thanhPhanCauHoi) && cauHinh.thanhPhanCauHoi.length > 0 && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-3xl">
              {cauHinh.thanhPhanCauHoi.map((tp: any, index: number) => {
                if (tp.type === 'image') {
                  return <img key={index} src={tp.url || tp.content} alt="Content" className="max-h-96 rounded-2xl shadow-md border border-slate-200" />;
                }
                if (tp.type === 'audio') {
                  return <audio key={index} src={tp.url || tp.content} controls className="w-full max-w-md" />;
                }
                return <p key={index} className="text-xl font-medium text-slate-700 leading-relaxed text-left w-full">{tp.content}</p>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
