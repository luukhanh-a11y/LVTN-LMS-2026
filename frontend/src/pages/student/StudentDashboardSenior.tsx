import { ArrowRight, Book, CheckCircle2, Clock, PenTool } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { studentService } from '../../services/student.service';
import GradedResultModal, { type GradedEssayResult } from '../../components/student/GradedResultModal';

export default function StudentDashboardSenior() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>({ upcomingTasks: [], gradedEssays: [], fullName: '' });
  const [loading, setLoading] = useState(true);
  const [viewingResult, setViewingResult] = useState<GradedEssayResult | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await studentService.getDashboard();
        setData(dashboardData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  const tasks = data.upcomingTasks || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-pro text-slate-900 flex justify-center">
      
      {/* Giới hạn độ rộng tối đa để ánh mắt bé luôn tập trung ở giữa */}
      <div className="w-full max-w-3xl p-6 sm:p-10 space-y-12">
        
        {/* HEADER: Chào hỏi siêu tối giản */}
        <header className="text-center sm:text-left mt-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-2">
            Chào buổi sáng, {data.studentName?.split(' ').pop() || 'Em'}.
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Hôm nay em có <strong className="text-blue-600">{tasks.length} nhiệm vụ</strong> cần hoàn thành nhé!
          </p>
        </header>

        {/* PHẦN 1: BÀI TẬP CẦN LÀM (Focus State) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Nhiệm vụ hôm nay</h2>
          </div>
          
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-slate-500">Tuyệt vời, em đã hoàn thành hết bài tập!</p>
            ) : (
              tasks.map((task: any, index: number) => {
                const isPriority = index === 0;
                
                const handleStartTask = () => {
                  if (task.loaiBaiTap === 'TRAC_NGHIEM' || task.loaiBaiTap === 'NOI_CAP' || task.loaiBaiTap === 'DIEN_KHUYET' || task.loaiBaiTap === 'NHIEU_CAU') {
                    navigate(`/student/tasks/${task.id}/quiz`);
                  } else if (task.loaiBaiTap === 'H5P') {
                    navigate(`/student/tasks/${task.id}/play`);
                  } else if (task.loaiBaiTap === 'GAME') {
                    navigate(`/student/game?id=${task.id}`);
                  } else {
                    navigate(`/student/essay?id=${task.id}`);
                  }
                };

                return (
                  <div key={task.id} className={`bg-white rounded-[2rem] border-2 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors ${isPriority ? 'p-6 sm:p-8 border-blue-100 hover:border-blue-300' : 'p-6 border-slate-100 hover:border-slate-200'}`}>
                    <div className="flex gap-5 items-start">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mt-1 ${isPriority ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                        {isPriority ? <PenTool className="w-7 h-7" /> : <span className="text-2xl font-black">🔢</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${isPriority ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {task.subject || task.subjectName || 'Bài tập'}
                          </span>
                          <span className={`flex items-center gap-1 text-sm font-bold ${task.dueDate && new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                            {isPriority && <Clock className="w-4 h-4" />} {task.time || 'Không thời hạn'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {task.title}
                        </h3>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleStartTask}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl font-bold text-lg transition-all cursor-pointer shrink-0 ${isPriority ? 'px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md' : 'px-8 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {isPriority ? (
                        <>Làm ngay <ArrowRight className="w-5 h-5" /></>
                      ) : (
                        'Bắt đầu'
                      )}
                    </button>
                  </div>
                );
              })
            )}
            </div>
        </section>

        {/* PHẦN 2: BÀI TỰ LUẬN ĐÃ ĐƯỢC CÔ CHẤM (Làm mờ để giảm tải nhận thức) */}
        {(data.gradedEssays || []).length > 0 && (
          <section>
            <div className="flex items-center gap-3 opacity-60">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-bold text-slate-600">Bài đã được cô nhận xét</h3>
            </div>
            <div className="mt-4 space-y-3">
              {(data.gradedEssays || []).map((r: GradedEssayResult) => (
                <button
                  key={r.baiTapId}
                  onClick={() => setViewingResult(r)}
                  className="w-full bg-white/50 p-5 rounded-[1.5rem] border border-slate-200/50 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <Book className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-600">{r.title}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                    {r.diem != null ? `${Number(r.diem).toFixed(1)} Điểm` : 'Xem nhận xét'}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

      </div>

      {viewingResult && (
        <GradedResultModal result={viewingResult} onClose={() => setViewingResult(null)} />
      )}
    </div>
  );
}
