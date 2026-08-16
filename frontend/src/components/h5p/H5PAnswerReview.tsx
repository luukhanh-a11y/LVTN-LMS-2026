import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface H5PAnswerReviewProps {
  chiTietBaiLam: any;
}

interface H5PQuestion {
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  success: boolean | null;
}

// Bóc thẻ HTML trong câu hỏi/đáp án (xAPI của H5P trả nội dung dạng HTML)
function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent?.trim() || '';
}

// Chuyển response index ("0" hoặc "0[,]2") của câu hỏi kiểu "choice" sang nội dung
// lựa chọn thật từ definition.choices mà chính statement mang theo — không cần đọc
// lại params của nội dung H5P, và đúng cả khi đáp án bị H5P xáo trộn ngẫu nhiên.
function resolveAnswer(type: string, value: string, choices: any[]): string {
  if (type === 'true-false') {
    return value === 'true' ? 'Đúng' : value === 'false' ? 'Sai' : value;
  }
  if (type === 'choice') {
    return value
      .split('[,]')
      .map((id: string) => {
        const choice = choices.find((c: any) => String(c.id) === id);
        return choice ? stripHtml(choice.description?.['en-US'] ?? '') : id;
      })
      .join(', ');
  }
  return value;
}

function extractQuestions(chiTietBaiLam: any): H5PQuestion[] {
  const raw = chiTietBaiLam?.interactionDetails;
  if (!raw) return [];

  let statements: any[] = [];
  try {
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw);
      statements = Array.isArray(parsed) ? parsed : [parsed];
    } else if (Array.isArray(raw)) {
      statements = raw;
    } else if (typeof raw === 'object') {
      statements = [raw];
    }
  } catch (e) {
    return [];
  }

  return statements
    .filter((s: any) => s?.object?.definition?.interactionType && s?.result?.response !== undefined)
    .map((s: any): H5PQuestion => {
      const def = s.object.definition;
      const type: string = def.interactionType;
      const choices: any[] = def.choices || [];
      const response = String(s.result.response ?? '');
      const patterns: string[] = Array.isArray(def.correctResponsesPattern)
        ? def.correctResponsesPattern
        : [];

      return {
        question: stripHtml(def.description?.['en-US'] || def.name?.['en-US'] || 'Câu hỏi'),
        studentAnswer: resolveAnswer(type, response, choices) || '(không trả lời)',
        correctAnswer: patterns.map((p) => resolveAnswer(type, p, choices)).join(', ') || 'Không có',
        success: s.result.success ?? null,
      };
    });
}

export default function H5PAnswerReview({ chiTietBaiLam }: H5PAnswerReviewProps) {
  const questions = extractQuestions(chiTietBaiLam);
  if (questions.length === 0) return null;

  const correctCount = questions.filter((q) => q.success === true).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h4 className="font-bold text-slate-800">Chi tiết câu trả lời của học sinh</h4>
        <span className={cn(
          "text-sm font-bold px-3 py-1 rounded-full",
          correctCount === questions.length ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
        )}>
          Đúng {correctCount}/{questions.length}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {questions.map((q, idx) => (
          <div key={idx} className="px-6 py-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-slate-900 font-medium leading-relaxed pt-0.5">{q.question}</p>
            </div>

            <div className="pl-9 space-y-2">
              <div className={cn(
                "flex items-start justify-between gap-4 p-3 rounded-xl border",
                q.success === true ? "bg-green-50 border-green-200" :
                q.success === false ? "bg-red-50 border-red-200" :
                "bg-slate-50 border-slate-200"
              )}>
                <div className="text-sm">
                  <span className={cn(
                    "font-bold",
                    q.success === true ? "text-green-800" :
                    q.success === false ? "text-red-800" :
                    "text-slate-700"
                  )}>
                    Trả lời của học sinh:
                  </span>
                  <span className={cn(
                    "ml-2 font-medium",
                    q.success === true ? "text-green-700" :
                    q.success === false ? "text-red-700" :
                    "text-slate-600"
                  )}>
                    {q.studentAnswer}
                  </span>
                </div>
                {q.success === true && (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" /> Đúng
                  </span>
                )}
                {q.success === false && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-700 shrink-0">
                    <XCircle className="w-4 h-4" /> Sai
                  </span>
                )}
                {q.success === null && (
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400 shrink-0">
                    <MinusCircle className="w-4 h-4" /> Không xác định
                  </span>
                )}
              </div>

              {q.success === false && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50/60 border border-green-100 text-sm">
                  <span className="font-bold text-green-800 shrink-0">Đáp án đúng:</span>
                  <span className="text-green-700">{q.correctAnswer}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}