import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, Loader2, ClipboardList, Puzzle, ListChecks, CalendarDays } from 'lucide-react';
import { parentService } from '../../services/parent.service';
import { useParentContextStore } from '../../stores/useParentContextStore';
import toast from 'react-hot-toast';

const formatTaskData = (task: any) => {
  const result = { ...task };
  result.subject = task.subjectName || 'Bài tập';
  
  if (!task.dueDate) {
    result.deadline = 'Không xác định';
    result.isLate = false;
    result.timeRemaining = 'Không giới hạn';
    result.timestamp = Infinity;
  } else {
    const due = new Date(task.dueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    result.timestamp = due.getTime();
    result.isLate = diff < 0;
    
    const timeStr = due.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = due.toLocaleDateString('vi-VN');
    result.deadline = `${timeStr} - ${dateStr}`;
    
    if (diff < 0) {
      result.timeRemaining = 'Quá hạn';
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      if (days > 0) result.timeRemaining = `${days} ngày ${hours} giờ`;
      else result.timeRemaining = `${hours} giờ`;
    }
  }

  const now = new Date();
  if (!task.assignedDate) {
    result.dateGroupKey = 'Không xác định';
    result.dateGroupLabel = 'Không xác định';
    result.assignedTimestamp = 0;
  } else {
    const assigned = new Date(task.assignedDate);
    const assignedMidnight = new Date(assigned.getFullYear(), assigned.getMonth(), assigned.getDate()).getTime();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const diffDays = Math.round((assignedMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
    
    result.dateGroupKey = assignedMidnight.toString();
    result.assignedTimestamp = assigned.getTime();
    const dateFormatted = assigned.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    if (diffDays === -1) result.dateGroupLabel = `Hôm qua, ${dateFormatted}`;
    else if (diffDays === 0) result.dateGroupLabel = `Hôm nay, ${dateFormatted}`;
    else if (diffDays === 1) result.dateGroupLabel = `Ngày mai, ${dateFormatted}`;
    else result.dateGroupLabel = assigned.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  return result;
};

export default function ParentAssignments() {
  const { selectedChild } = useParentContextStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<{ label: string; timestamp: number; items: any[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssignments = async (childId: number) => {
    setIsLoading(true);
    try {
      const data = await parentService.getAssignments(childId);
      const formatted = data.map(formatTaskData);
      
      const groupsMap = new Map<string, { label: string; timestamp: number; items: any[] }>();
      formatted.forEach((t: any) => {
        if (!groupsMap.has(t.dateGroupKey)) {
          groupsMap.set(t.dateGroupKey, {
            label: t.dateGroupLabel,
            timestamp: t.dateGroupKey === 'Không xác định' ? 0 : parseInt(t.dateGroupKey),
            items: []
          });
        }
        groupsMap.get(t.dateGroupKey)!.items.push(t);
      });
      
      const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
      sortedGroups.forEach(group => {
        group.items.sort((a, b) => a.timestamp - b.timestamp);
      });
      
      setTasks(formatted);
      setGroupedTasks(sortedGroups);
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
          <h2 className="text-2xl font-bold text-slate-900">Bài tập của bé</h2>
          <p className="text-slate-500 font-medium mt-1">
            Theo dõi các bài tập tương tác và bài tự luận của <strong className="text-blue-700">{selectedChild?.name || 'bé'}</strong>.
          </p>
        </div>
        <ClipboardList className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-blue-500">
             <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
             Chưa có bài tập nào.
          </div>
        ) : (
          groupedTasks.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-700 capitalize">{group.label}</h2>
                <div className="flex-1 h-px bg-slate-200 ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {group.items.map((task) => (
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
                          }`}>{task.subject}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{task.title}</h3>
                        
                        <div className="flex items-center text-sm font-medium">
                          {task.completed || task.status === 'DA_NOP' ? (
                            <span className="text-emerald-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Đã hoàn thành</span>
                          ) : task.isLate ? (
                            <span className="text-rose-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Quá hạn nộp</span>
                          ) : (
                            <span className="text-orange-500 flex items-center"><Clock className="w-4 h-4 mr-1"/> Còn {task.timeRemaining}</span>
                          )}
                          <span className="mx-2 text-slate-300">•</span>
                          <span className="text-slate-500">
                            {task.isLate ? <span className="text-rose-500 mr-1">Đã hết hạn lúc:</span> : <span>Hạn:</span>} {task.deadline}
                          </span>
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
          ))
        )}
      </div>
    </div>
  );
}
