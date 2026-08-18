import React from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';
import LessonVisual from './LessonVisual';
import { cleanMediaUrl, hasRealAudio, playRealAudio } from '../../lib/utils';

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
          <h3 className="text-2xl font-black text-slate-800 mb-4">Lý thuyết</h3>

          {hasRealAudio(cauHinh?.amThanh) && (
            <button
              type="button"
              onClick={() => playRealAudio(cauHinh?.amThanh)}
              className="flex items-center gap-2 mb-8 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white font-black rounded-full shadow-[0_6px_0_0_#b45309] hover:shadow-[0_4px_0_0_#b45309] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all cursor-pointer"
            >
              <Volume2 className="w-6 h-6" /> Nghe đọc
            </button>
          )}

          {cauHinh?.trucQuan && <LessonVisual data={cauHinh.trucQuan} />}
          
          {cauHinh?.noiDung && (
            <div
              className="text-slate-700 max-w-3xl leading-[2.2] bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8 text-left w-full shadow-sm text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: cauHinh.noiDung }}
            />
          )}

          {cauHinh?.amThanh && (
            <div className="w-full max-w-3xl mb-8 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
              <audio controls className="w-full rounded-xl" src={cleanMediaUrl(cauHinh.amThanh)} />
            </div>
          )}

          {cauHinh?.hinhAnh && (
            <div className="w-full mb-8">
              <img src={cleanMediaUrl(cauHinh.hinhAnh)} alt="Nội dung bài học" className="max-w-full md:max-w-3xl max-h-[75vh] object-contain rounded-3xl border-[6px] border-white shadow-2xl mx-auto" />
            </div>
          )}

          {cauHinh?.video && (
            <div className="w-full max-w-3xl mb-8 bg-slate-50 p-2 rounded-3xl border-2 border-slate-100 shadow-lg overflow-hidden">
              <video src={cleanMediaUrl(cauHinh.video)} controls className="w-full rounded-2xl max-h-[70vh] object-contain bg-black" />
            </div>
          )}

          {cauHinh?.thanhPhanCauHoi && Array.isArray(cauHinh.thanhPhanCauHoi) && cauHinh.thanhPhanCauHoi.length > 0 && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-3xl">
              {cauHinh.thanhPhanCauHoi.map((tp: any, index: number) => {
                if (tp.type === 'image') {
                  return <img key={index} src={cleanMediaUrl(tp.url || tp.content)} alt="Content" className="max-h-96 rounded-2xl shadow-md border border-slate-200" />;
                }
                if (tp.type === 'audio') {
                  return <audio key={index} src={cleanMediaUrl(tp.url || tp.content)} controls className="w-full max-w-md" />;
                }
                return <p key={index} className="text-xl font-medium text-slate-700 leading-relaxed text-left w-full">{tp.noiDung || tp.content}</p>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
