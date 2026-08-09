import { useState } from 'react';
import { adminSettings } from '../../mockAdminData';
import { Save, School, ShieldAlert, ToggleLeft, ToggleRight, BookOpen, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import Button from '../../components/Button';

export default function AdminSettings() {
  const [settings, setSettings] = useState(adminSettings);
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Toán học', code: 'TOAN' },
    { id: 2, name: 'Tiếng Việt', code: 'TV' },
    { id: 3, name: 'Tiếng Anh', code: 'TA' },
    { id: 4, name: 'Tự nhiên và Xã hội', code: 'TNXH' },
    { id: 5, name: 'Đạo đức', code: 'DD' },
    { id: 6, name: 'Tin học', code: 'TIN' },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cấu hình hệ thống thành công!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cấu hình Hệ thống</h2>
        <p className="text-sm text-slate-500 mt-1">Cài đặt các thông số cơ bản cho toàn trường.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* THÔNG TIN CHUNG */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <School className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Thông tin chung</h3>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tên trường học</label>
              <input 
                type="text" 
                value={settings.schoolName}
                onChange={e => setSettings({...settings, schoolName: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Năm học hiện tại</label>
                <select 
                  value={settings.schoolYear}
                  onChange={e => setSettings({...settings, schoolYear: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>2025 - 2026</option>
                  <option>2026 - 2027</option>
                  <option>2027 - 2028</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Học kỳ hiện tại</label>
                <select 
                  value={settings.currentSemester}
                  onChange={e => setSettings({...settings, currentSemester: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>Học kỳ 1</option>
                  <option>Học kỳ 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* QUẢN LÝ MÔN HỌC */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Quản lý Môn học</h3>
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => toast('Chức năng đang phát triển', { icon: '🚧' })} 
            >
              Thêm môn
            </Button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-300 transition group bg-white shadow-sm hover:shadow-md">
                  <div>
                    <h4 className="font-bold text-slate-900">{sub.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Mã môn: {sub.code}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button type="button" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUYỀN VÀ BẢO MẬT */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-slate-900">Quản lý Đánh giá cuối năm</h3>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between p-5 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="max-w-xl">
                <h4 className="font-bold text-slate-900 mb-1">Mở đợt duyệt đánh giá cuối năm</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Khi bật tính năng này, các Giáo viên chủ nhiệm sẽ có quyền truy cập vào chức năng Xét Duyệt Lên Lớp/Ở Lại và nhập Đánh giá năng lực cuối năm cho học sinh. Chỉ bật khi chuẩn bị kết thúc năm học.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setSettings({...settings, isFinalReviewOpen: !settings.isFinalReviewOpen})}
                className={cn(
                  "p-1 rounded-full transition-colors cursor-pointer outline-none focus:ring-4 focus:ring-blue-100",
                  settings.isFinalReviewOpen ? "text-blue-600" : "text-slate-300"
                )}
              >
                {settings.isFinalReviewOpen ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" leftIcon={<Save className="w-5 h-5" />}>
            Lưu Cấu Hình
          </Button>
        </div>

      </form>
    </div>
  );
}
