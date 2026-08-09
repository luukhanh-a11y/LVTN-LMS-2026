import { useState } from 'react';
import { Library, Search, BookOpen, Layers, LayoutTemplate, HelpCircle, PlusCircle } from 'lucide-react';
import { materialsData } from '../mockData';
import { cn } from '../lib/utils';

export default function Materials() {
  const [selectedGrade, setSelectedGrade] = useState(materialsData.grades[0].id);
  const [selectedBook, setSelectedBook] = useState(materialsData.books[0].id);
  const [selectedTopic, setSelectedTopic] = useState(materialsData.topics[1].id);
  const [selectedLesson, setSelectedLesson] = useState(materialsData.lessons[1].id);

  const getQuestionIcon = (type: string) => {
    switch(type) {
      case 'TRAC_NGHIEM': return <HelpCircle className="w-5 h-5 text-blue-500" />;
      case 'NOI_CAP': return <Layers className="w-5 h-5 text-purple-500" />;
      case 'TU_LUAN': return <BookOpen className="w-5 h-5 text-orange-500" />;
      default: return <HelpCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Library className="w-6 h-6 text-blue-600" /> Quản lý Học liệu
          </h2>
          <p className="text-sm text-slate-500 mt-1">Tra cứu ngân hàng câu hỏi, bài giảng và thư viện nội dung hệ thống.</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm cursor-pointer">
          <PlusCircle className="w-5 h-5" /> Tạo bài giảng H5P
        </button>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex overflow-hidden">
        
        {/* Sidebar Bộ lọc */}
        <div className="w-80 border-r border-slate-200 bg-slate-50 p-6 flex flex-col gap-6 overflow-y-auto">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">1. Khối lớp</label>
            <select 
              value={selectedGrade} 
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {materialsData.grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">2. Sách bài tập</label>
            <select 
              value={selectedBook} 
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {materialsData.books.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">3. Chủ đề</label>
            <div className="flex flex-col gap-2">
              {materialsData.topics.map(t => (
                <button 
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.id)}
                  className={cn("px-3 py-2.5 text-sm font-medium rounded-lg text-left transition cursor-pointer",
                    selectedTopic === t.id ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">4. Bài học</label>
            <div className="flex flex-col gap-2">
              {materialsData.lessons.filter(l => l.topicId === selectedTopic).map(l => (
                <button 
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLesson(l.id)}
                  className={cn("px-3 py-2.5 text-sm font-medium rounded-lg text-left transition cursor-pointer",
                    selectedLesson === l.id ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Khung nội dung */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Danh sách Câu hỏi</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Tìm kiếm câu hỏi..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {materialsData.questions.filter(q => q.lessonId === selectedLesson).map((q, idx) => (
              <div key={q.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-white shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getQuestionIcon(q.type)}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-slate-700 text-sm">Câu {idx + 1}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded">{q.type}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">{q.level}</span>
                      </div>
                      <p className="text-slate-900 font-medium">{q.content}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">Chế độ giao diện hỗ trợ:</span>
                  <div className="flex gap-1.5 ml-1">
                    {q.uiMode.map((mode, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded">
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {materialsData.questions.filter(q => q.lessonId === selectedLesson).length === 0 && (
              <div className="text-center py-12 text-slate-500">
                Không tìm thấy dữ liệu học liệu cho bài học này.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
