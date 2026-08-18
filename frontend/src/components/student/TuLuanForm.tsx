import React, { useRef, useState } from 'react';
import { PenTool, CheckCircle2, Loader2, Volume2, Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';
import LessonVisual from './LessonVisual';
import { api } from '../../lib/axios';
import { cleanMediaUrl, hasRealAudio, playRealAudio } from '../../lib/utils';

export interface TuLuanFormProps {
  cauHinh: any;
  result: any;
  onSubmit: (baiLam: any) => void;
  submitting: boolean;
}

export default function TuLuanForm({ cauHinh, result, onSubmit, submitting }: TuLuanFormProps) {
  const [traLoi, setTraLoi] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasResult = result != null;
  const submittedFileUrl = result?.chiTietBaiLam?.fileUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // api instance mặc định Content-Type: application/json — phải bỏ header đó đi
      // (undefined) thì axios/trình duyệt mới tự set đúng multipart/form-data kèm
      // boundary, nếu không backend nhận request không phải multipart -> 400.
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': undefined } });
      const data = res.data?.data || res.data;
      // Backend trả về đường dẫn tương đối (/uploads/xxx) — phải ghép domain backend
      // thật vào vì frontend (5173) và backend (8080) khác cổng, không tự phục vụ được.
      if (typeof data === 'string' && data) {
        setFileUrl('http://localhost:8080' + data);
      } else {
        toast.error('Lỗi khi tải ảnh lên');
      }
    } catch (err) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasResult || submitting || (!traLoi.trim() && !fileUrl)) return;
    onSubmit({ traLoi: traLoi.trim(), fileUrl: fileUrl || undefined });
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
            {hasRealAudio(cauHinh?.amThanh) && (
              <button
                type="button"
                onClick={() => playRealAudio(cauHinh?.amThanh)}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-black rounded-full shadow-[0_5px_0_0_#b45309] hover:shadow-[0_3px_0_0_#b45309] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all cursor-pointer ml-auto"
              >
                <Volume2 className="w-5 h-5" /> Nghe đọc
              </button>
            )}
          </div>

          {cauHinh?.trucQuan && <LessonVisual data={cauHinh.trucQuan} />}
          
          {cauHinh?.noiDung && (
            <div
              className="text-slate-700 max-w-3xl leading-[2.2] bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8 text-left w-full shadow-sm text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: cauHinh.noiDung }}
            />
          )}

          {cauHinh?.amThanh && (
            <div className="w-full mb-8 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
              <audio controls className="w-full rounded-xl" src={cleanMediaUrl(cauHinh.amThanh)} />
            </div>
          )}

          {cauHinh?.hinhAnh && (
            <div className="w-full mb-8">
              <img src={cleanMediaUrl(cauHinh.hinhAnh)} alt="Nội dung câu hỏi" className="max-w-full md:max-w-3xl max-h-[75vh] object-contain rounded-3xl border-[6px] border-white shadow-2xl mx-auto" />
            </div>
          )}

          {cauHinh?.video && (
            <div className="w-full mb-8 bg-slate-50 p-2 rounded-3xl border-2 border-slate-100 shadow-lg overflow-hidden">
              <video src={cleanMediaUrl(cauHinh.video)} controls className="w-full rounded-2xl max-h-[70vh] object-contain bg-black" />
            </div>
          )}

          {cauHinh?.thanhPhanCauHoi && Array.isArray(cauHinh.thanhPhanCauHoi) && cauHinh.thanhPhanCauHoi.length > 0 && (
            <div className="flex flex-col items-start space-y-4 w-full mb-8">
              {cauHinh.thanhPhanCauHoi.map((tp: any, index: number) => {
                if (tp.type === 'image') {
                  return <img key={index} src={cleanMediaUrl(tp.url || tp.content)} alt="Content" className="max-h-64 rounded-2xl shadow-md border border-slate-200" />;
                }
                if (tp.type === 'audio') {
                  return <audio key={index} src={cleanMediaUrl(tp.url || tp.content)} controls className="w-full max-w-md" />;
                }
                return <p key={index} className="text-xl font-bold text-slate-800">{tp.noiDung || tp.content}</p>;
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
              placeholder="Nhập câu trả lời của em vào đây (nếu có)..."
              className="w-full min-h-[200px] p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 focus:border-student-primary focus:ring-4 focus:ring-student-primary/10 outline-none transition-all text-lg font-medium text-slate-700 resize-y custom-scrollbar disabled:opacity-70 disabled:bg-slate-100"
            />
          </div>

          {/* Nộp ảnh bài làm (chép/tập viết trên giấy, chụp lại nộp lên) */}
          <div className="mt-6">
            <h4 className="text-lg font-bold text-slate-700 mb-4">Hoặc chụp ảnh bài làm nộp lên:</h4>

            {!hasResult ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {!fileUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || submitting}
                    className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-student-primary transition-all text-slate-500 disabled:opacity-60 cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8" />
                    )}
                    <span className="font-bold">{uploading ? 'Đang tải ảnh lên...' : 'Bấm để chọn/chụp ảnh'}</span>
                  </button>
                ) : (
                  <div className="relative inline-block">
                    <img src={cleanMediaUrl(fileUrl)} alt="Ảnh bài làm" className="max-h-96 rounded-3xl border-[6px] border-white shadow-2xl" />
                    <button
                      type="button"
                      onClick={() => setFileUrl('')}
                      disabled={submitting}
                      className="absolute -top-3 -right-3 w-9 h-9 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : submittedFileUrl ? (
              <img src={cleanMediaUrl(submittedFileUrl)} alt="Ảnh bài làm đã nộp" className="max-h-96 rounded-3xl border-[6px] border-white shadow-2xl" />
            ) : (
              <p className="text-slate-400 italic">Em không nộp ảnh cho bài này.</p>
            )}
          </div>
        </div>

        {/* Submit Action */}
        {!hasResult && (
          <div className="flex justify-center">
             <button
                onClick={handleSubmit}
                disabled={submitting || uploading || (!traLoi.trim() && !fileUrl)}
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
