import { useState } from 'react';
import { FileText, ListChecks, ChevronRight, ChevronLeft, Search, CheckCircle2, Sparkles, LayoutTemplate } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const STEPS = [
  { id: 1, label: 'Thông tin chung', icon: FileText },
  { id: 2, label: 'Chọn Câu hỏi & Giao diện', icon: ListChecks }, // Gộp việc chọn câu hỏi và cấu hình giao diện
];

export default function CreateAssignment() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else toast.success('Đã tạo và giao bài tập thành công!');
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleAISuggest = () => {
    toast('AI đang phân tích chương trình học...', { icon: '🤖' });
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tạo bài tập mới</h2>
          <p className="text-sm text-slate-500 mt-1">Thiết lập bài tập và cá nhân hóa trải nghiệm học sinh.</p>
        </div>
        {currentStep === 1 && (
          <button onClick={handleAISuggest} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition font-medium shadow-sm cursor-pointer text-sm">
            <Sparkles className="w-4 h-4" /> AI Gợi ý Đề bài
          </button>
        )}
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50/30">
          
          {/* BƯỚC 1: THÔNG TIN CHUNG */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tiêu đề bài tập <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="VD: Bài tập cuối tuần..." className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Giao cho Lớp <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none bg-white">
                    <option>Toán 10A1</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Hạn nộp (Deadline) <span className="text-red-500">*</span></label>
                  <input type="datetime-local" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none bg-white" />
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 2: CHỌN CÂU HỎI TỪ THƯ VIỆN & CẤU HÌNH GIAO DIỆN TỪNG CÂU */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Bộ lọc phân tầng (Drill-down API) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">1. Sách bài tập</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    <option>Sách Toán 10 - Kết nối tri thức</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">2. Chủ đề</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    <option>Chương 2: Bất phương trình</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">3. Bài học</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50">
                    <option>Bài 4: Hệ bất phương trình bậc nhất</option>
                  </select>
                </div>
                <button className="self-end px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                  Lấy câu hỏi
                </button>
              </div>

              {/* Danh sách câu hỏi và Cấu hình Giao diện */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-blue-600" />
                  Danh sách câu hỏi được chọn
                </h3>

                {/* Card Câu 1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">Câu 1</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">Trắc nghiệm</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-2">Miền nghiệm của bất phương trình x + y {'>'} 0 là gì?</p>
                    </div>
                    
                    {/* Cấu hình giao diện riêng cho câu này */}
                    <div className="w-64 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <LayoutTemplate className="w-3.5 h-3.5" /> Chế độ hiển thị
                      </label>
                      <select className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:outline-none">
                        <option>Mặc định (Tiêu chuẩn)</option>
                        <option>Game A: Giải cứu thú cưng</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card Câu 2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">Câu 2</span>
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded">Nối cặp</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-2">Nối các hệ bất phương trình với hình ảnh đồ thị tương ứng.</p>
                    </div>
                    
                    <div className="w-64 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <LayoutTemplate className="w-3.5 h-3.5" /> Chế độ hiển thị
                      </label>
                      <select className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:outline-none">
                        <option>Mặc định (Tiêu chuẩn)</option>
                        <option>Game B: Đua xe giải toán</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button type="button" onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition disabled:opacity-50 cursor-pointer">
            <ChevronLeft className="w-5 h-5" /> Quay lại
          </button>
          
          <button type="button" onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition shadow-sm cursor-pointer">
            {currentStep === 2 ? 'Lưu & Giao bài' : 'Tiếp tục chọn câu hỏi'}
            {currentStep !== 2 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
