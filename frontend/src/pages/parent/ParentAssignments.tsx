import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, Loader2, ClipboardList, Puzzle, ListChecks } from 'lucide-react';
import { parentService } from '../../services/parent.service';
import { useParentContextStore } from '../../stores/useParentContextStore';
import toast from 'react-hot-toast';

export default function ParentAssignments() {
  const { selectedChild } = useParentContextStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssignments = async (childId: number) => {
    setIsLoading(true);
    try {
      const data = await parentService.getAssignments(childId);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    if (selectedChild?.id) {
        fetchAssignments(selectedChild.id); 
    }
  }, [selectedChild?.id]);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Bài tập của bé</h1>
          <p className="text-slate-500 font-medium mt-1">
            Theo dõi các bài tập tương tác và bài tự luận của <strong className="text-blue-700">{selectedChild?.name || 'bé'}</strong>.
          </p>
        </div>
        <ClipboardList className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-blue-500">
             <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
             Chưa có bài tập nào.
          </div>
        ) : tasks.map((task) => (
          <div key={task.id} className={`bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between transition-shadow hover:shadow-md border-slate-200`}>
            <div className="flex items-start mb-4 md:mb-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 ${
                task.type === 'H5P' ? 'bg-blue-100 text-blue-600' : task.type === 'TRAC_NGHIEM' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {task.type === 'H5P' ? <Puzzle className="w-7 h-7" /> : task.type === 'TRAC_NGHIEM' ? <ListChecks className="w-7 h-7" /> : <FileText className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    task.subjectName === 'Toán Học' || task.subjectName === 'Toán' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}>{task.subjectName}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{task.title}</h3>
                
                <div className="flex items-center text-sm font-medium">
                  {task.completed || task.status === 'DA_NOP' ? (
                    <span className="text-emerald-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Đã hoàn thành</span>
                  ) : (
                    <span className="text-orange-500 flex items-center"><Clock className="w-4 h-4 mr-1"/> Chưa hoàn thành</span>
                  )}
                  {task.dueDate && (
                    <>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="text-slate-500">Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold border border-slate-200 text-sm">
                Thưởng: {task.xpReward || 0} XP
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
