import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/Badge';
import { Plus, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { adminService } from '../../services/admin.service';

export default function AdminSettings() {
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [config, setConfig] = useState({
    tenTruong: '',
    namHocHienTai: '',
    hocKyHienTai: 1,
    logoUrl: '',
    danhSachKhoi: '',
    danhSachMon: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newGrade, setNewGrade] = useState('');
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await adminService.getSystemConfig();
      setConfig(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await adminService.updateSystemConfig(config);
      toast.success('Lưu cấu hình thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi lưu cấu hình');
    } finally {
      setIsLoading(false);
    }
  };

  const gradesList = config.danhSachKhoi ? config.danhSachKhoi.split(',').map(s => s.trim()).filter(s => s) : [];
  const subjectsList = config.danhSachMon ? config.danhSachMon.split(',').map(s => s.trim()).filter(s => s) : [];

  const handleAddGrade = () => {
    if (!newGrade) return;
    const updatedGrades = [...gradesList, newGrade].join(',');
    setConfig({ ...config, danhSachKhoi: updatedGrades });
    setNewGrade('');
    setShowGradeModal(false);
  };

  const handleRemoveGrade = (gradeToRemove: string) => {
    const updatedGrades = gradesList.filter(g => g !== gradeToRemove).join(',');
    setConfig({ ...config, danhSachKhoi: updatedGrades });
  };

  const handleAddSubject = () => {
    if (!newSubject) return;
    const updatedSubjects = [...subjectsList, newSubject].join(',');
    setConfig({ ...config, danhSachMon: updatedSubjects });
    setNewSubject('');
    setShowSubjectModal(false);
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    const updatedSubjects = subjectsList.filter(s => s !== subjectToRemove).join(',');
    setConfig({ ...config, danhSachMon: updatedSubjects });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Cấu hình Trường học</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên trường"
              value={config.tenTruong}
              onChange={(e) => setConfig({...config, tenTruong: e.target.value})}
            />
            <Input label="Hotline" defaultValue="1900 1234" disabled />
          </div>
          <Input label="Địa chỉ" defaultValue="123 Đường ABC, Quận XYZ, TP.HCM" disabled />
          <Input label="Email liên hệ" type="email" defaultValue="contact@titkul.edu.vn" disabled />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <Input
              label="Năm học hiện tại"
              value={config.namHocHienTai}
              onChange={(e) => setConfig({...config, namHocHienTai: e.target.value})}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Học kỳ hiện tại</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1"
                value={config.hocKyHienTai}
                onChange={(e) => setConfig({...config, hocKyHienTai: parseInt(e.target.value)})}
              >
                <option value={1}>Học kỳ 1</option>
                <option value={2}>Học kỳ 2</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cơ cấu đào tạo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-700 text-sm">Danh sách Khối lớp</h3>
              <Button variant="outline" size="sm" onClick={() => setShowGradeModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Thêm Khối
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {gradesList.map(g => (
                <Badge key={g} variant="outline" className="px-3 py-1.5 flex items-center">
                  {g} <Trash2 className="w-3 h-3 ml-2 text-slate-400 hover:text-red-500 cursor-pointer" onClick={() => handleRemoveGrade(g)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-700 text-sm">Danh mục Môn học</h3>
              <Button variant="outline" size="sm" onClick={() => setShowSubjectModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Thêm Môn
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjectsList.map(s => (
                <Badge key={s} variant="outline" className="px-3 py-1.5 flex items-center bg-slate-50">
                  {s} <Trash2 className="w-3 h-3 ml-2 text-slate-400 hover:text-red-500 cursor-pointer" onClick={() => handleRemoveSubject(s)} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Thêm Khối */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Thêm Khối mới</h3>
              <button onClick={() => setShowGradeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Tên Khối" 
                placeholder="VD: Khối 6" 
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
              />
              <div className="pt-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowGradeModal(false)}>Hủy bỏ</Button>
                <Button onClick={handleAddGrade}>Thêm Khối</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Môn Học */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Thêm Môn học mới</h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Tên Môn học" 
                placeholder="VD: Tin học" 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <div className="pt-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowSubjectModal(false)}>Hủy bỏ</Button>
                <Button onClick={handleAddSubject}>Thêm Môn</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-end pt-4 pb-8">
        <Button onClick={handleSave} isLoading={isLoading} className="px-8">
          Lưu tất cả thay đổi
        </Button>
      </div>
    </div>
  );
}
