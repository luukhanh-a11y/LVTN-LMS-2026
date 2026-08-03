import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { defineElements } from '@lumieducation/h5p-webcomponents';
import type { H5PEditorComponent as H5PEditorElement } from '@lumieducation/h5p-webcomponents';
import { RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { h5pService } from '../../services/h5p.service';

defineElements();

// Automatic JSX runtime resolve IntrinsicElements qua 'react/jsx-runtime', không phải namespace JSX toàn cục.
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'h5p-editor': React.DetailedHTMLProps<React.HTMLAttributes<H5PEditorElement>, H5PEditorElement> & {
        'content-id'?: string;
      };
    }
  }
}

export interface H5PEditorHandle {
  save: () => Promise<{ contentId: string; metadata: any }>;
}

interface H5PEditorProps {
  // contentId thật để sửa bài có sẵn; bỏ trống ("new") để soạn bài mới
  contentId?: string;
  // Gọi khi trình soạn thảo H5P đã tải xong và sẵn sàng thao tác
  onReady?: () => void;
  // Khối/Môn chọn sẵn ở trang cha (chỉ áp dụng lúc tạo mới) — gửi kèm lúc lưu để BE lưu luôn phân loại.
  grade?: number;
  subjectId?: number;
}

const H5PEditor = forwardRef<H5PEditorHandle, H5PEditorProps>(({ contentId, onReady, grade, subjectId }, ref) => {
  const elementRef = useRef<H5PEditorElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // useCallback giữ tham chiếu ổn định — StrictMode chạy effect 2 lần lúc mount,
  // hàm mới mỗi lần khiến h5p-webcomponents tự render() lại và nhân đôi DOM.
  const loadContent = useCallback(async (id?: string) => {
    try {
      const model = id ? await h5pService.getEditorModelById(id) : await h5pService.getNewEditorModel();
      // Tắt loading ngay khi có model, không chờ 'editorloaded' — event đó chỉ bắn
      // sau khi chọn xong content type, còn bài mới thì bước đầu là chọn type.
      setLoading(false);
      return model;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? 'Không tải được trình soạn thảo H5P.';
      setLoadError(message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Đọc grade/subjectId qua ref (không phải dependency của saveContent) để chọn
  // Khối/Môn không làm đổi tham chiếu saveContent — tránh useEffect bên dưới
  // chạy lại và set loading=true mãi mãi (web component không thực sự tải lại).
  const gradeRef = useRef(grade);
  const subjectIdRef = useRef(subjectId);
  useEffect(() => { gradeRef.current = grade; }, [grade]);
  useEffect(() => { subjectIdRef.current = subjectId; }, [subjectId]);

  const saveContent = useCallback(async (id: string, requestBody: { library: string; params: any }) => {
    if (!id) {
      return h5pService.saveNewContent(requestBody.library, requestBody.params, {
        grade: gradeRef.current,
        subjectId: subjectIdRef.current,
      });
    }
    return h5pService.updateContent(id, requestBody.library, requestBody.params);
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    const el = elementRef.current;
    if (!el) return;

    el.loadContentCallback = loadContent;
    el.saveContentCallback = saveContent;

    // Báo "đã có thao tác" khi form soạn thảo tải xong — dùng để cảnh báo rời trang chưa lưu.
    const handleEditorLoaded = () => {
      onReady?.();
    };
    el.addEventListener('editorloaded', handleEditorLoaded);
    return () => el.removeEventListener('editorloaded', handleEditorLoaded);
  }, [retryKey, loadContent, saveContent, onReady]);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!elementRef.current) {
        throw new Error('H5P Editor chưa sẵn sàng');
      }
      return elementRef.current.save();
    },
  }));

  const handleRetry = () => {
    setRetryKey((k) => k + 1);
  };

  if (loadError) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-red-50/50 rounded-lg">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
        <p className="text-slate-700 font-semibold mb-1">Không tải được trình soạn thảo H5P</p>
        <p className="text-slate-500 text-sm mb-6 max-w-md">{loadError}</p>
        <button
          onClick={handleRetry}
          className="flex items-center px-4 py-2 bg-pro-primary hover:brightness-95 text-white rounded-lg text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80">
          <Loader2 className="w-8 h-8 text-pro-primary animate-spin mb-3" />
          <p className="text-slate-500 text-sm">Đang tải trình soạn thảo H5P...</p>
        </div>
      )}
      {/* Không ép height:100% — iframe bên trong H5P tự resize theo nội dung thật. */}
      <h5p-editor key={retryKey} ref={elementRef} content-id={contentId ?? 'new'} style={{ display: 'block' }} />
    </div>
  );
});

H5PEditor.displayName = 'H5PEditor';

export default H5PEditor;
