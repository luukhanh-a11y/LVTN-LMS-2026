import { useState, useEffect } from 'react';
import { X, UploadCloud, FileText, ArrowRight, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { studentService } from '../../services/student.service';

export default function StudentEssayWorkspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assignmentId = parseInt(searchParams.get('id') || '0', 10);

  const [content, setContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [assignmentData, setAssignmentData] = useState<any>(null);

  useEffect(() => {
    if (assignmentId) {
      studentService.getEssayAssignmentDetail(assignmentId)
        .then(data => setAssignmentData(data))
        .catch(err => {
          console.error(err);
          toast.error("Không tải được bài tập");
        });
    } else {
      // Mock data if no ID provided
      setAssignmentData({
        tieuDe: 'Viết đoạn văn tả con vật',
        moTa: 'Em hãy viết một đoạn văn ngắn (5-7 câu) miêu tả một con vật nuôi mà em yêu thích. Em có thể viết thẳng vào ô bên dưới, hoặc làm ra vở, chụp ảnh rồi tải lên nhé!',
        hanNop: '23:59 - Hôm nay'
      });
    }
  }, [assignmentId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      toast.success('Đã đính kèm file thành công!');
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !uploadedFile) {
      toast.error('Em hãy viết bài hoặc tải ảnh lên trước khi nộp nhé!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let attachmentUrl = null;
      if (uploadedFile) {
        const uploadRes = await studentService.uploadFile(uploadedFile);
        attachmentUrl = uploadRes.url || uploadRes.fileName;
      }

      if (assignmentId) {
        await studentService.submitEssay(assignmentId, {
          textContent: content,
          attachmentUrl: attachmentUrl
        });
      }

      toast.success('Nộp bài thành công! Em làm tốt lắm!', {
        icon: '🎉',
        style: { background: '#22c55e', color: '#fff', fontWeight: 'bold' }
      });
      // Làm xong bài tự động chuyển sang bài tiếp theo còn phải làm, hết bài thì về trang chủ.
      const nextRoute = assignmentId ? await studentService.getNextTaskRoute(assignmentId) : '/student';
      navigate(nextRoute);
    } catch (e) {
      toast.error('Có lỗi xảy ra khi nộp bài');
      setIsSubmitting(false);
    }
  };

  if (!assignmentData) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Đang tải đề bài...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col fixed inset-0 z-50 overflow-y-auto">
      
      {/* HEADER */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate('/student')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nộp bài tự luận</p>
          <h1 className="text-lg font-black text-slate-800">{assignmentData.title || assignmentData.tieuDe || assignmentData.tenBaiTap}</h1>
        </div>
        <div className="w-10 h-10"></div> {/* Spacer */}
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-8 flex flex-col gap-6">
        
        {/* Hướng dẫn đề bài */}
        <div className="bg-blue-50/50 rounded-3xl p-6 border-2 border-blue-100 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-blue-900 mb-2">Đề bài yêu cầu:</h2>
            <p className="text-blue-800 font-medium leading-relaxed">
              {assignmentData.description || assignmentData.moTa || (
                <span className="italic text-blue-600/70">
                  (Giáo viên không đính kèm mô tả chi tiết cho bài tập này. Em hãy làm theo Tiêu đề bài tập nhé!)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Khung làm bài (Nhập Text) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 font-bold text-slate-600 text-sm">
            ✍️ Em gõ bài làm vào đây nhé:
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ví dụ: Nhà em có nuôi một chú mèo mướp rất đáng yêu..."
            className="w-full h-48 p-6 text-slate-700 font-medium text-lg leading-relaxed focus:outline-none resize-none"
          ></textarea>
        </div>

        {/* Khu vực Upload Ảnh/File (Cho học sinh viết ra vở) */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative">
          
          {uploadedFile ? (
            <div className="w-full flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-green-800">{uploadedFile.name}</p>
                  <p className="text-xs font-semibold text-green-600">Đã tải lên sẵn sàng!</p>
                </div>
              </div>
              <button 
                onClick={() => setUploadedFile(null)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-700 mb-1">Tải ảnh chụp vở lên</h3>
              <p className="text-slate-500 font-medium text-sm max-w-sm">
                Nếu em làm bài ra vở, hãy nhờ bố mẹ chụp ảnh và bấm vào đây để nộp nhé.
              </p>
            </>
          )}

        </div>

        <div className="h-20"></div> {/* Spacer cho Footer */}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-center">
        <div className="max-w-3xl w-full flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && !uploadedFile)}
            className={cn(
              "flex items-center gap-3 px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300",
              (content.trim() || uploadedFile)
                ? "bg-[#00D26A] text-white hover:bg-[#00e676] shadow-lg shadow-green-500/30 cursor-pointer" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài ngay'} 
            {!isSubmitting && <ArrowRight className="w-6 h-6" />}
          </button>
        </div>
      </footer>

    </div>
  );
}
