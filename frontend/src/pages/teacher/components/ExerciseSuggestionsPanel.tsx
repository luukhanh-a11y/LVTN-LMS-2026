import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { teacherService } from '../../../services/teacher.service';

interface Props {
  grade?: number;
  subjectId?: number;
}

export function ExerciseSuggestionsPanel({ grade, subjectId }: Props) {
  const [topicHint, setTopicHint] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const data = await teacherService.generateExerciseSuggestions({ grade, subjectId, topicHint });
      setSuggestions(data.suggestions);
      if (data.suggestions.length === 0) {
        toast.error('Không tạo được gợi ý lúc này, vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Failed to generate exercise suggestions', err);
      toast.error('Không tạo được gợi ý bài tập.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex((cur) => (cur === idx ? null : cur)), 1500);
    } catch {
      toast.error('Không sao chép được, vui lòng chọn và sao chép thủ công.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-center text-slate-800 font-bold">
        <Sparkles className="w-5 h-5 mr-2 text-pro-primary" />
        AI gợi ý bài tập bổ sung
      </div>
      <p className="text-xs text-slate-500">
        Nhập ngắn gọn chủ đề bài giảng đang soạn để AI gợi ý thêm bài tập. GV có thể sao chép gợi ý và tự thêm khối H5P tương ứng vào bài.
      </p>
      <textarea
        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary resize-none"
        rows={2}
        placeholder="Ví dụ: Phép cộng trong phạm vi 10"
        value={topicHint}
        onChange={(e) => setTopicHint(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 bg-pro-primary text-white font-semibold rounded-lg hover:brightness-95 transition disabled:opacity-60"
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
        {isLoading ? 'Đang tạo gợi ý...' : 'Tạo gợi ý'}
      </button>

      {suggestions.length > 0 && (
        <div className="space-y-2 pt-2">
          {suggestions.map((s, idx) => (
            <div key={idx} className="p-3 bg-pro-primary/5 border border-pro-primary/20 rounded-lg text-sm text-slate-700 flex justify-between items-start gap-2">
              <span className="flex-1">{s}</span>
              <button
                onClick={() => handleCopy(s, idx)}
                className="shrink-0 text-pro-primary/70 hover:text-pro-primary"
                title="Sao chép"
              >
                {copiedIndex === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
