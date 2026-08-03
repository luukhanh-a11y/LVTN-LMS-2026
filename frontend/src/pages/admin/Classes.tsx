import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { GRADES } from '../../constants';
import { useClassesViewModel } from './hooks/useClassesViewModel';

export default function AdminClasses() {
  const vm = useClassesViewModel();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Lớp học</h1>
        <Button onClick={vm.openCreateModal}>
          <Plus className="h-4 w-4 mr-2" /> Tạo lớp mới
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Tìm lớp..."
              value={vm.searchQuery}
              onChange={(e) => vm.setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1"
            value={vm.filterGrade}
            onChange={(e) => vm.setFilterGrade(e.target.value)}
          >
            {GRADES.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Khối</TableHead>
                <TableHead>GVCN</TableHead>
                <TableHead>Sĩ số</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vm.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : vm.filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Không tìm thấy lớp học nào.</TableCell>
                </TableRow>
              ) : vm.filteredClasses.map((cls) => (
                <TableRow key={cls.lopHocId}>
                  <TableCell className="font-medium text-primary">{cls.tenLop}</TableCell>
                  <TableCell>{cls.khoiLop}</TableCell>
                  <TableCell className="font-medium">
                    {cls.giaoVienChuNhiem
                      ? cls.giaoVienChuNhiem.hoTen
                      : <span className="text-slate-400 italic">Chưa phân công</span>}
                  </TableCell>
                  <TableCell>{cls.siSoHienTai || 0} / {cls.siSoToiDa}</TableCell>
                  <TableCell>
                    <Badge variant={cls.trangThai === 'ACTIVE' ? 'success' : 'outline'}>
                      {cls.trangThai === 'ACTIVE' ? 'Đang học' : 'Đóng băng'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/admin/classes/${cls.lopHocId}`}>
                      <Button variant="ghost" size="sm">Chi tiết</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => vm.handleToggleStatus(cls.lopHocId)}>
                      {cls.trangThai === 'ACTIVE' ? 'Đóng băng' : 'Mở khóa'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => vm.openEditModal(cls)}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={vm.showClassModal}
        onClose={() => vm.setShowClassModal(false)}
        title={vm.editingClass ? 'Sửa thông tin Lớp học' : 'Tạo Lớp học mới'}
      >
        <form onSubmit={vm.handleSaveClass} className="p-6 space-y-4">
          <Input
            label="Tên lớp"
            value={vm.formData.name}
            onChange={(e) => vm.setFormData({ ...vm.formData, name: e.target.value })}
            placeholder="VD: Lớp 5A"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Khối</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={vm.formData.grade}
                onChange={(e) => vm.setFormData({ ...vm.formData, grade: e.target.value })}
              >
                {GRADES.filter((g) => g.value !== 'all').map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="Niên khóa"
              value={vm.formData.academicYear}
              onChange={(e) => vm.setFormData({ ...vm.formData, academicYear: e.target.value })}
              placeholder="VD: 2026-2027"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sĩ số tối đa"
              type="number"
              value={vm.formData.maxCapacity}
              onChange={(e) => vm.setFormData({ ...vm.formData, maxCapacity: e.target.value })}
              required min="1"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Giáo viên chủ nhiệm</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={vm.formData.homeroomTeacherId}
                onChange={(e) => vm.setFormData({ ...vm.formData, homeroomTeacherId: e.target.value })}
              >
                <option value="">-- Chưa phân công --</option>
                {vm.teachers.map((t) => (
                  <option key={t.giaoVienId} value={t.giaoVienId}>{t.hoTen}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
            <Button type="button" variant="outline" onClick={() => vm.setShowClassModal(false)}>Hủy bỏ</Button>
            <Button type="submit" isLoading={vm.isSubmitting}>Lưu thay đổi</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
