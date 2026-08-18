import { useRef, useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { cn } from '../../lib/utils';

interface FileUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  kind?: 'image' | 'audio' | 'video';
  className?: string;
}

// Backend trả về đường dẫn tương đối (/uploads/xxx) — phải ghép domain backend thật
// vào vì frontend (5173) và backend (8080) khác cổng, không tự phục vụ được.
function toAbsoluteUrl(url: string) {
  return url.startsWith('http') || url.startsWith('blob') ? url : `http://localhost:8080${url.startsWith('/') ? '' : '/'}${url}`;
}

export function FileUploadInput({ value, onChange, accept, kind = 'image', className }: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      if (typeof data === 'string' && data) {
        onChange(toAbsoluteUrl(data));
      } else {
        toast.error('Lỗi khi tải file lên');
      }
    } catch (err) {
      toast.error('Lỗi khi tải file lên');
    } finally {
      setUploading(false);
    }
  };

  const resolvedAccept = accept || (kind === 'image' ? 'image/*' : kind === 'audio' ? 'audio/*' : kind === 'video' ? 'video/*' : undefined);

  return (
    <div className={cn('space-y-2', className)}>
      <input ref={inputRef} type="file" accept={resolvedAccept} className="hidden" onChange={handleFileChange} />

      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors text-slate-500 text-sm font-medium disabled:opacity-60 cursor-pointer"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Đang tải lên...' : 'Chọn tệp từ máy'}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          {kind === 'image' && (
            <img src={value} alt="" className="h-10 w-10 object-cover rounded border border-slate-200" />
          )}
          {kind === 'audio' && <audio src={value} controls className="h-10 flex-1 min-w-0" />}
          {kind === 'video' && <video src={value} controls className="h-16 rounded border border-slate-200" />}
          <button
            type="button"
            onClick={() => onChange('')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 shrink-0 cursor-pointer"
            title="Xóa tệp"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-xs font-semibold text-blue-600 hover:underline shrink-0 cursor-pointer disabled:opacity-60"
          >
            {uploading ? 'Đang tải...' : 'Đổi tệp'}
          </button>
        </div>
      )}
    </div>
  );
}
