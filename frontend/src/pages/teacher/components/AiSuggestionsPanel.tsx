import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { teacherService } from '../../../services/teacher.service';

interface Props {
  submissionId: number;
  onApply: (text: string) => void;
  onClose: () => void;
}

export function AiSuggestionsPanel({ submissionId, onApply, onClose }: Props) {
  const [suggestionSetId, setSuggestionSetId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadFailed(false);

    teacherService
      .generateCommentSuggestions(submissionId)
      .then((data) => {
        if (cancelled) return;
        setSuggestionSetId(data.id);
        setSuggestions(data.suggestions);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Không tạo được gợi ý AI:', err);
        toast.error(err.response?.data?.message || 'Không tạo được gợi ý AI, vui lòng thử lại.');
        setSuggestions([]);
        setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const handleApply = (text: string) => {
    onApply(text);
    if (suggestionSetId) {
      teacherService.chooseCommentSuggestion(suggestionSetId).catch(() => {});
    }
  };

  return (
    <div className="mb-4 p-4 bg-pro-primary/10 border border-pro-primary/20 rounded-lg space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-pro-fg">
          {suggestions.length > 0 ? `AI đã tạo ${suggestions.length} gợi ý, chọn 1 để dùng:` : 'Gợi ý nhận xét từ AI'}
        </span>
        <button onClick={onClose} className="text-pro-primary/60 hover:text-pro-primary">
          <X className="w-4 h-4" />
        </button>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <Loader2 className="w-5 h-5 animate-spin text-pro-primary" />
          <p className="text-xs text-slate-500">AI đang soạn gợi ý, có thể mất 15-30 giây...</p>
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-sm text-slate-500 italic">
          {loadFailed ? 'Không tạo được gợi ý do lỗi kết nối, vui lòng đóng và thử lại.' : 'Không tạo được gợi ý cho bài nộp này.'}
        </p>
      ) : (
        suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleApply(suggestion)}
            className="text-left w-full p-3 bg-white rounded border border-pro-primary/20 text-sm hover:border-pro-primary/50 text-slate-700 transition-colors shadow-sm"
          >
            "{suggestion}"
          </button>
        ))
      )}
    </div>
  );
}
