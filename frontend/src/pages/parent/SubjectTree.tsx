import { useState, useEffect } from 'react';
import { Loader2, Calculator, PlayCircle, Puzzle, FileQuestion, CheckCircle2, Lock } from 'lucide-react';
import { parentService } from '../../services/parent.service';

export default function ParentSubjectTree() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [childrenData, subjectsData] = await Promise.all([
          parentService.getChildren(),
          parentService.getSubjects(),
        ]);
        setChildren(childrenData);
        setSubjects(subjectsData);
        if (childrenData && childrenData.length > 0) {
          setSelectedChildId(childrenData[0].id);
        }
        if (subjectsData && subjectsData.length > 0) {
          setSelectedSubjectId(subjectsData[0].monHocId);
        }
        if (!childrenData?.length) setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch children/subjects', err);
        setIsLoading(false);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    const fetchTree = async () => {
      if (!selectedChildId || !selectedSubjectId) return;
      setIsLoading(true);
      try {
        const data = await parentService.getSubjectTree(selectedChildId, selectedSubjectId);
        setChapters(data.chapters ?? []);
      } catch (err) {
        console.error('Failed to fetch subject tree', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTree();
  }, [selectedChildId, selectedSubjectId]);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-pro-primary/10 rounded-2xl flex items-center justify-center mr-4 border-2 border-pro-primary/20">
             <Calculator className="w-10 h-10 text-pro-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Tiến trình học tập</h1>
            <p className="text-slate-500 font-medium">Theo dõi bài học của con</p>
          </div>
        </div>

        {children.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
              <span className="text-sm font-medium text-slate-500 pl-2">Chọn học sinh:</span>
              <select
                className="bg-slate-50 border-none text-sm font-semibold rounded-lg focus:ring-0 py-2 pl-3 pr-8"
                value={selectedChildId || ''}
                onChange={(e) => setSelectedChildId(Number(e.target.value))}
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>{child.name} - {child.className}</option>
                ))}
              </select>
            </div>
            {subjects.length > 0 && (
              <div className="flex items-center space-x-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                <span className="text-sm font-medium text-slate-500 pl-2">Môn học:</span>
                <select
                  className="bg-slate-50 border-none text-sm font-semibold rounded-lg focus:ring-0 py-2 pl-3 pr-8"
                  value={selectedSubjectId || ''}
                  onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                >
                  {subjects.map((subject: any) => (
                    <option key={subject.monHocId} value={subject.monHocId}>{subject.tenMon}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
        </div>
      ) : children.length === 0 ? (
        <div className="bg-slate-50 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center h-64 text-slate-500">
          <p>Bạn chưa có học sinh nào được liên kết.</p>
        </div>
      ) : (
        <div className="space-y-12 mt-12 relative pb-20">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="relative z-10">
              {/* Tiêu đề Chương */}
              <div className="flex flex-col items-center mb-8">
                 <div className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-3 shadow-sm inline-flex items-center">
                   <img src={chapter.icon} alt={chapter.title} className="w-10 h-10 mr-3" />
                   <h2 className="text-2xl font-bold text-slate-800">
                     {chapter.title}
                   </h2>
                 </div>
              </div>

              {/* Các nhánh (Bài học) xếp thẳng hàng */}
              <div className="relative max-w-xl mx-auto">
                 {/* Đường nối dọc ở giữa */}
                 <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 -z-10"></div>

                 {chapter.lessons.map((lesson: any, idx: number) => {
                   const isLeft = idx % 2 === 0;
                   return (
                     <div key={lesson.id} className={`relative flex items-center justify-between mb-8 ${isLeft ? 'flex-row-reverse' : ''}`}>
                        
                        {/* Khoảng trống đối diện */}
                        <div className="w-[45%] hidden md:block"></div>

                        {/* Node Giữa (Flat UI) */}
                        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 z-20 ${
                          lesson.status === 'completed' ? 'bg-pro-success border-pro-success/20' :
                          lesson.status === 'current' ? 'bg-pro-primary border-pro-primary/20 ring-4 ring-pro-primary/10' :
                          'bg-slate-200 border-white'
                        }`}></div>

                        {/* Card Bài Học (Flat UI) */}
                        <div className={`w-full md:w-[45%] flex flex-col p-4 rounded-2xl border transition-all z-10 bg-white ${
                          lesson.status === 'completed' ? 'border-pro-success/30 shadow-sm' :
                          lesson.status === 'current' ? 'border-pro-primary/40 shadow-md ring-2 ring-pro-primary/10' :
                          'border-slate-200 opacity-60 grayscale'
                        }`}>
                           <div className="flex items-center mb-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                                lesson.status === 'completed' ? 'bg-pro-success/10 text-pro-success' :
                                lesson.status === 'current' ? 'bg-pro-primary/10 text-pro-primary' :
                                'bg-slate-100 text-slate-400'
                              }`}>
                                {lesson.type === 'FILE' && <PlayCircle className="w-6 h-6" />}
                                {lesson.type === 'H5P' && <Puzzle className="w-6 h-6" />}
                                {(lesson.type === 'NATIVE' || lesson.type === 'JSON_TEXT') && <FileQuestion className="w-6 h-6" />}
                              </div>
                              <div>
                                <h3 className={`text-lg font-bold leading-tight mb-1 ${lesson.status === 'current' ? 'text-pro-primary' : 'text-slate-700'}`}>
                                  {lesson.title}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500">
                                  {lesson.type === 'FILE' ? 'Tài liệu / Video' : lesson.type === 'H5P' ? 'Bài tập tương tác H5P' : 'Bài tập tự luận'}
                                </p>
                              </div>
                           </div>

                           <div className="mt-auto">
                              {lesson.status === 'completed' && (
                                 <div className="flex items-center justify-center w-full py-2 bg-pro-success/10 rounded-lg text-pro-success font-semibold text-sm">
                                   <CheckCircle2 className="w-5 h-5 mr-1.5" />
                                   Đã học
                                 </div>
                              )}
                              {lesson.status === 'current' && (
                                 <div className="flex items-center justify-center w-full py-2 bg-pro-primary/10 rounded-lg text-pro-primary font-semibold text-sm border border-pro-primary/20">
                                   <div className="w-2 h-2 rounded-full bg-pro-primary mr-2 animate-pulse"></div>
                                   Đang học
                                 </div>
                              )}
                              {lesson.status === 'locked' && (
                                 <div className="flex items-center justify-center w-full py-2 bg-slate-50 rounded-lg text-slate-500 font-semibold text-sm">
                                   <Lock className="w-5 h-5 mr-1.5" />
                                   Chưa mở khóa
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
