import { useCallback, useEffect, useRef, useState } from 'react';
import { defineElements } from '@lumieducation/h5p-webcomponents';
import type { H5PPlayerComponent as H5PPlayerElement } from '@lumieducation/h5p-webcomponents';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { h5pService } from '../../services/h5p.service';

defineElements();

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'h5p-player': React.DetailedHTMLProps<React.HTMLAttributes<H5PPlayerElement>, H5PPlayerElement> & {
        'content-id'?: string;
      };
    }
  }
}

interface H5PPlayerProps {
  contentId: string;
  onXAPIStatement?: (statement: any) => void;
}

export default function H5PPlayer({ contentId, onXAPIStatement }: H5PPlayerProps) {
  const elementRef = useRef<H5PPlayerElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // useCallback giữ tham chiếu ổn định qua StrictMode double-mount (xem H5PEditor.tsx).
  const loadContent = useCallback(async (id: string) => {
    try {
      return await h5pService.getPlayerModel(id);
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? err?.message ?? 'Không tải được nội dung H5P.');
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    el.loadContentCallback = loadContent;

    const handleInitialized = () => setLoading(false);
    el.addEventListener('initialized', handleInitialized);

    const handleXAPI = (event: Event) => {
      const statement = (event as CustomEvent<{ statement: any }>).detail?.statement;
      if (statement && onXAPIStatement) onXAPIStatement(statement);
    };
    if (onXAPIStatement) el.addEventListener('xAPI', handleXAPI);

    return () => {
      el.removeEventListener('initialized', handleInitialized);
      if (onXAPIStatement) el.removeEventListener('xAPI', handleXAPI);
    };
  }, [contentId, loadContent, onXAPIStatement]);

  if (loadError) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
        <p className="text-slate-600 text-sm">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80">
          <Loader2 className="w-7 h-7 text-slate-500 animate-spin mb-2" />
          <p className="text-slate-500 text-sm">Đang tải nội dung...</p>
        </div>
      )}
      <h5p-player ref={elementRef} content-id={contentId} style={{ display: 'block', height: '100%' }} />
    </div>
  );
}
