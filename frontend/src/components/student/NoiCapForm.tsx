import React, { useState, useEffect } from 'react';

export interface NoiCapFormProps {
  loai: string;
  cauHinh: any;
  dapAnChuan: any;
  result: any;
  onSubmit: (baiLam: any) => void;
  submitting: boolean;
}

export default function NoiCapForm({
  cauHinh,
  result,
  onSubmit,
  submitting
}: NoiCapFormProps) {
  const [capChon, setCapChon] = useState<Record<string, string>>({});

  const hasResult = result != null;

  useEffect(() => {
    if (!hasResult) {
      setCapChon({});
    }
  }, [hasResult, cauHinh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasResult || submitting) return;

    if (Object.keys(capChon).length > 0) {
      onSubmit({ danhSachCapDung: Object.entries(capChon).map(([traiId, phaiId]) => ({ traiId, phaiId })) });
    }
  };

  const cotTrai = cauHinh?.cotTrai || [];
  const cotPhai = cauHinh?.cotPhai || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      <div className="p-5 md:p-8 space-y-6">
        
        {/* Câu hỏi / Yêu cầu */}
        {(cauHinh?.cauHoi || cauHinh?.noiDung) && (
          <div className="mb-6">
            {cauHinh.cauHoi && (
              <div className="text-lg font-bold text-slate-800 mb-2" dangerouslySetInnerHTML={{ __html: cauHinh.cauHoi }} />
            )}
            {cauHinh.noiDung && (
              <div className="prose max-w-none text-slate-600 mb-4" dangerouslySetInnerHTML={{ __html: cauHinh.noiDung }} />
            )}
            {cauHinh.hinhAnh && (
              <img src={cauHinh.hinhAnh} alt="Minh họa" className="max-w-full h-auto rounded-xl object-contain max-h-64" />
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {cotTrai.map((t: any, idx: number) => (
              <div key={t.id || idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex-1 w-full flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {t.hinhAnh && (
                    <img src={t.hinhAnh} alt="Hình" className="w-12 h-12 rounded object-cover border border-slate-200" />
                  )}
                  <span className="font-medium text-slate-700">{t.noiDung || '...'}</span>
                </div>
                
                <div className="w-full sm:w-1/2 shrink-0">
                  <select
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm bg-white font-medium text-slate-700 transition-colors"
                    value={capChon[t.id] || ''}
                    onChange={(e) => setCapChon((prev) => ({ ...prev, [t.id]: e.target.value }))}
                    disabled={hasResult}
                  >
                    <option value="">-- Chọn đáp án ghép nối --</option>
                    {cotPhai.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.noiDung || 'Hình ảnh / Âm thanh'}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {!hasResult && (
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting || Object.keys(capChon).length === 0}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-colors"
              >
                {submitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
