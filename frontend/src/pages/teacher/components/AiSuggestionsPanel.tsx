import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    teacherService
      .generateCommentSuggestions(submissionId)
      .then((data) => {
        setSuggestionSetId(data.id);
        setSuggestions(data.suggestions);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setIsLoading(false));
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
        <span className="text-sm font-bold text-pro-fg">Chọn 1 phương án (Human-in-the-loop):</span>
        <button onClick={onClose} className="text-pro-primary/60 hover:text-pro-primary">
          <X className="w-4 h-4" />
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-pro-primary" />
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-sm text-slate-500 italic">Không tạo được gợi ý cho bài nộp này.</p>
      ) : (
        suggestions.map((suggestion) => (
          <button
            key={suggestion}
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
