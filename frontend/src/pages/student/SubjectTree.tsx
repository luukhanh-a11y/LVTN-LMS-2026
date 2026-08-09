import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Calculator, PlayCircle, Puzzle, FileQuestion, CheckCircle2, Map } from 'lucide-react';
import { studentService } from '../../services/student.service';

export default function SubjectTree() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState('');
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;
    const fetchTree = async () => {
      setIsLoading(true);
      try {
        const data = await studentService.getSubjectTree(Number(subjectId));
        setChapters(data.chapters ?? []);
        setSubjectName(data.subjectName ?? '');
        setTotalLessons(data.totalLessons ?? 0);
        setCompletedLessons(data.completedLessons ?? 0);
      } catch (err) {
        console.error('Failed to fetch subject tree', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTree();
  }, [subjectId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-student-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <Link to="/student" className="inline-flex items-center text-student-primary font-bold hover:text-student-accent bg-student-primary/10 px-4 py-2 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại Trang Chủ
        </Link>
        <Link to={`/student/subject/${subjectId}/map`} className="inline-flex items-center text-student-primary font-bold hover:text-student-accent bg-student-primary/10 px-4 py-2 rounded-full transition-colors">
          <Map className="w-5 h-5 mr-2" />
          Xem dạng bản đồ phiêu lưu
        </Link>
      </div>

      <div className="flex items-center mb-10">
        <div className="w-16 h-16 bg-student-primary/10 rounded-2xl flex items-center justify-center mr-4 border-2 border-student-primary/20">
           <Calculator className="w-10 h-10 text-student-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">{subjectName || 'Môn học'}</h1>
          <p className="text-slate-500 font-medium">Bạn đã hoàn thành {completedLessons}/{totalLessons} bài học</p>
        </div>
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          Môn học này chưa có bài giảng nào cho lớp của em.
        </div>
      )}

      <div className="space-y-12 mt-12 relative pb-20">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="relative z-10">
            {/* Tiêu đề Chương */}
            <div className="flex flex-col items-center mb-8">
               <div className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-3 shadow-sm inline-flex items-center">
                 {chapter.icon ? (
                   <img src={chapter.icon} alt={chapter.title} className="w-10 h-10 mr-3 object-contain" />
                 ) : (
                   <div className="w-10 h-10 bg-student-primary/10 rounded-xl flex items-center justify-center mr-3">
                     <Puzzle className="w-6 h-6 text-student-primary" />
                   </div>
                 )}
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
                        lesson.status === 'completed' ? 'bg-student-success border-student-success/20' :
                        lesson.status === 'current' ? 'bg-student-primary border-student-primary/20 ring-4 ring-student-primary/10' :
                        'bg-slate-200 border-white'
                      }`}></div>

                      {/* Card Bài Học (Flat UI) */}
                      <div className={`w-full md:w-[45%] flex flex-col p-4 rounded-2xl border transition-all z-10 bg-white ${
                        lesson.status === 'completed' ? 'border-student-success/30 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-1' :
                        'border-student-primary/40 shadow-md ring-2 ring-student-primary/10 cursor-pointer hover:-translate-y-1'
                      }`}>
                         <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                              lesson.status === 'completed' ? 'bg-student-success/10 text-student-success' :
                              'bg-student-primary/10 text-student-primary'
                            }`}>
                              {lesson.type === 'video' && <PlayCircle className="w-6 h-6" />}
                              {lesson.type === 'h5p' && <Puzzle className="w-6 h-6" />}
                              {lesson.type === 'quiz' && <FileQuestion className="w-6 h-6" />}
                            </div>
                            <div>
                              <h3 className={`text-lg font-bold leading-tight mb-1 ${lesson.status === 'completed' ? 'text-student-success' : 'text-slate-700'}`}>
                                {lesson.title}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500">
                                {lesson.type === 'video' ? 'Video bài giảng' : lesson.type === 'h5p' ? 'Bài tập tương tác' : 'Bài kiểm tra'}
                              </p>
                            </div>
                         </div>

                         {/* Nút Trạng thái dạng Flat */}
                         <div className="mt-auto">
                            {lesson.status === 'completed' ? (
                               <Link to={`/student/lesson/${lesson.id}?subjectId=${subjectId}`} className="block">
                                 <button className="w-full bg-student-success/10 text-student-success hover:bg-student-success hover:text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center text-sm">
                                   <CheckCircle2 className="w-5 h-5 mr-1.5" />
                                   Đã hoàn thành (Học lại)
                                 </button>
                               </Link>
                            ) : (
                               <Link to={`/student/lesson/${lesson.id}?subjectId=${subjectId}`} className="block">
                                 <button className="w-full bg-student-primary text-white font-semibold py-2.5 rounded-lg hover:bg-[#3A82DF] transition-colors flex items-center justify-center text-sm">
                                   Học ngay
                                   <PlayCircle className="w-5 h-5 ml-1.5" />
                                 </button>
                               </Link>
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
    </div>
  );
}
