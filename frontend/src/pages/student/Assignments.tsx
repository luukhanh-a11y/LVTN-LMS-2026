import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, FileText, Upload, X, Loader2, ClipboardList, Puzzle, ListChecks, CalendarDays } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { studentService } from '../../services/student.service';
import { useAuthStore } from '../../stores/useAuthStore';
import toast from 'react-hot-toast';

// Helper để format date và tính thời gian
const formatTaskData = (task: any) => {
  const result = { ...task };
  result.subject = task.subjectName || 'Bài tập';
  
  // Tính toán thời gian hạn nộp
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
      if (days > 0) {
        result.timeRemaining = `${days} ngày ${hours} giờ`;
      } else {
        result.timeRemaining = `${hours} giờ`;
      }
    }
  }

  // Nhóm theo ngày giao bài (assignedDate)
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
    else {
      result.dateGroupLabel = assigned.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }

  return result;
};

export default function StudentAssignments() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  // Mảng gốc và mảng đã nhóm
  const [tasks, setTasks] = useState<any[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<{ label: string; timestamp: number; items: any[] }[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [essayText, setEssayText] = useState('');
  const [isEssayLoading, setIsEssayLoading] = useState(false);
  const [isEssaySubmitting, setIsEssaySubmitting] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const fetchAssignments = async () => {
    try {
      const data = await studentService.getAssignments();
      const formatted = data.map(formatTaskData);
      
      // Nhóm bài tập
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
      
      // Sắp xếp các nhóm theo ngày giao (mới nhất lên đầu)
      const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
      
      // Sắp xếp các bài tập trong mỗi nhóm (bài nào sắp hết hạn lên đầu)
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

  useEffect(() => { fetchAssignments(); }, []);

  const handleOpenSubmit = async (task: any) => {
    setSelectedTask(task);
    setEssayText('');
    setAttachmentUrl(null);
    setAttachmentName('');
    setIsSubmitModalOpen(true);
    setIsEssayLoading(true);
    try {
      const detail = await studentService.getEssayAssignmentDetail(task.id);
      setEssayText(detail.draftText || '');
      if (detail.draftAttachmentUrl) {
        setAttachmentUrl(detail.draftAttachmentUrl);
        setAttachmentName(detail.draftAttachmentUrl.split('/').pop() ?? 'Tệp đính kèm');
      }
    } catch (err) {
      console.error('Failed to fetch essay detail', err);
    } finally {
      setIsEssayLoading(false);
    }
  };

  const MAX_ATTACHMENT_SIZE = 20 * 1024 * 1024; // 20MB, khớp giới hạn thật của backend
  const ALLOWED_ATTACHMENT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'mp3', 'mp4', 'wav'];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)) {
      toast.error('Loại file không được hỗ trợ');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      toast.error('File vượt quá dung lượng cho phép (tối đa 20MB)');
      e.target.value = '';
      return;
    }

    setIsUploadingFile(true);
    try {
      const result = await studentService.uploadFile(file);
      setAttachmentUrl(result.url);
      setAttachmentName(result.fileName);
      toast.success('Đã tải file lên!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tải file thất bại.');
    } finally {
      setIsUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleSubmitEssay = async (isDraft: boolean) => {
    if (!selectedTask) return;
    if (!essayText.trim()) {
      toast.error('Vui lòng nhập nội dung bài làm.');
      return;
    }
    setIsEssaySubmitting(true);
    try {
      await studentService.submitEssay(selectedTask.id, { textContent: essayText, isDraft, attachmentUrl });
      toast.success(isDraft ? 'Đã lưu nháp!' : 'Nộp bài thành công!');
      setIsSubmitModalOpen(false);
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi nộp bài');
    } finally {
      setIsEssaySubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Bài tập của em</h1>
          <p className="text-slate-500 font-medium mt-1">Hoàn thành bài tập đúng hạn để nhận thêm nhiều Kim cương nhé!</p>
        </div>
        <ClipboardList className="w-16 h-16 text-student-primary opacity-20 hidden sm:block" strokeWidth={1.5} />
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-student-primary">
             <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
             Chưa có bài tập nào.
          </div>
        ) : (
          groupedTasks.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              {/* Tiêu đề nhóm ngày */}
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-700 capitalize">{group.label}</h2>
                <div className="flex-1 h-px bg-slate-200 ml-4"></div>
              </div>
              
              {/* Danh sách bài tập trong ngày */}
              <div className="grid grid-cols-1 gap-4">
                {group.items.map((task) => (
                  <div key={task.id} className={`bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between transition-shadow hover:shadow-md ${
                    task.status === 'YC_LAM_LAI' ? 'border-student-error/50 bg-student-error/10' : 'border-slate-200'
                  }`}>
                    <div className="flex items-start mb-4 md:mb-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 ${
                        task.type === 'H5P' ? 'bg-student-primary/10 text-student-primary' : (task.type === 'TRAC_NGHIEM' || task.type === 'NOI_CAP' || task.type === 'DIEN_KHUYET' || task.type === 'NHIEU_CAU') ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {task.type === 'H5P' ? <Puzzle className="w-7 h-7" /> : (task.type === 'TRAC_NGHIEM' || task.type === 'NOI_CAP' || task.type === 'DIEN_KHUYET' || task.type === 'NHIEU_CAU') ? <ListChecks className="w-7 h-7" /> : <FileText className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            task.subject === 'Toán Học' ? 'bg-student-primary/10 text-student-primary border border-student-primary/20' : 'bg-orange-50 text-orange-700 border border-orange-100'
                          }`}>{task.subject}</span>
                          {task.status === 'YC_LAM_LAI' && <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-student-error/20 text-rose-700 animate-pulse">Làm lại</span>}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{task.title}</h3>
                        
                        <div className="flex flex-wrap items-center text-sm font-medium gap-y-1">
                          {task.status === 'DA_NOP' ? (
                            <span className="text-student-success flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Đã nộp</span>
                          ) : task.isLate ? (
                            <span className="text-rose-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Quá hạn nộp</span>
                          ) : (
                            <span className="text-orange-500 flex items-center"><Clock className="w-4 h-4 mr-1"/> Còn {task.timeRemaining}</span>
                          )}
                          <span className="mx-2 text-slate-300">•</span>
                          <span className="text-slate-500 flex items-center">
                             {task.isLate ? <span className="text-rose-500 mr-1">Đã hết hạn lúc:</span> : <span>Hạn:</span>} {task.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {task.status === 'DA_NOP' ? (
                         <Button variant="outline" className="w-full md:w-auto border-slate-200 text-slate-600" disabled>Chờ chấm điểm</Button>
                      ) : task.type === 'H5P' ? (
                         <Button
                           onClick={() => navigate(`/student/tasks/${task.id}/play`)}
                           className="w-full md:w-auto bg-student-primary hover:bg-[#3A82DF] text-white rounded-xl shadow-[0_4px_0_0_theme(colors.primary.hover)] hover:shadow-[0_2px_0_0_theme(colors.primary.hover)] hover:translate-y-[2px] transition-all font-bold"
                         >
                           Làm bài H5P
                         </Button>
                      ) : (task.type === 'TRAC_NGHIEM' || task.type === 'NOI_CAP' || task.type === 'DIEN_KHUYET' || task.type === 'NHIEU_CAU') ? (
                         <Button
                           onClick={() => navigate(`/student/tasks/${task.id}/quiz`)}
                           className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-[0_4px_0_0_theme(colors.purple.800)] hover:shadow-[0_2px_0_0_theme(colors.purple.800)] hover:translate-y-[2px] transition-all font-bold"
                         >
                           Làm bài Quiz
                         </Button>
                      ) : (
                         <Button onClick={() => handleOpenSubmit(task)} className="w-full md:w-auto bg-student-success hover:brightness-95 text-white rounded-xl shadow-[0_4px_0_0_theme(colors.student.success)] hover:shadow-[0_2px_0_0_theme(colors.student.success)] hover:translate-y-[2px] transition-all font-bold">
                           {task.status === 'YC_LAM_LAI' ? 'Nộp lại bài' : 'Nộp bài tự luận'}
                         </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nộp Bài Tự Luận */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
               <h2 className="font-bold text-lg text-slate-800 flex items-center">
                 <FileText className="w-5 h-5 mr-2 text-student-primary" />
                 Nộp bài: {selectedTask?.title}
               </h2>
               <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Nhập nội dung bài làm</label>
                 {isEssayLoading ? (
                   <div className="w-full h-40 flex items-center justify-center border border-slate-200 rounded-xl">
                     <Loader2 className="w-6 h-6 animate-spin text-student-primary" />
                   </div>
                 ) : (
                   <textarea
                     className="w-full h-40 border border-slate-300 rounded-xl p-3 outline-none focus:border-student-primary focus:ring-2 focus:ring-student-primary/10 transition-all resize-none text-sm"
                     placeholder="Em viết đoạn văn vào đây nhé..."
                     value={essayText}
                     onChange={(e) => setEssayText(e.target.value)}
                   ></textarea>
                 )}
               </div>

               {attachmentUrl ? (
                 <div className="flex items-center justify-between w-full p-3 border border-student-primary/30 bg-student-primary/5 rounded-xl">
                   <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-student-primary truncate flex items-center">
                     <FileText className="w-4 h-4 mr-2 shrink-0" /> {attachmentName}
                   </a>
                   <button onClick={() => { setAttachmentUrl(null); setAttachmentName(''); }} className="text-slate-400 hover:text-rose-500 shrink-0 ml-2">
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               ) : (
                 <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors ${isUploadingFile ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploadingFile ? (
                              <Loader2 className="w-6 h-6 text-slate-400 mb-2 animate-spin" />
                            ) : (
                              <Upload className="w-6 h-6 text-slate-400 mb-2" />
                            )}
                            <p className="text-sm text-slate-400 font-medium">{isUploadingFile ? 'Đang tải lên...' : 'Đính kèm file (tối đa 20MB)'}</p>
                        </div>
                        <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp3,.mp4,.wav" className="hidden" disabled={isUploadingFile} onChange={handleFileChange} />
                    </label>
                 </div>
               )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50">
               <Button
                 onClick={() => handleSubmitEssay(true)}
                 variant="outline"
                 disabled={isEssaySubmitting || isEssayLoading}
                 className="border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
               >
                 {isEssaySubmitting ? 'Đang xử lý...' : 'Lưu Nháp'}
               </Button>
               <Button
                 onClick={() => handleSubmitEssay(false)}
                 disabled={isEssaySubmitting || isEssayLoading}
                 className="bg-student-success hover:brightness-95 text-white shadow-[0_4px_0_0_theme(colors.student.success)] hover:shadow-[0_2px_0_0_theme(colors.student.success)] hover:translate-y-[2px] transition-all font-bold"
               >
                 {isEssaySubmitting ? 'Đang xử lý...' : 'Gửi Bài'}
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
