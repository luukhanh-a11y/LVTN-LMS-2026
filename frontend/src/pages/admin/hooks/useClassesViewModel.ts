import { useState, useEffect, useMemo } from 'react';
import { classService, type ClassRoom } from '../../../services/class.service';
import { teacherService, type TeacherProfile } from '../../../services/teacher.service';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  name: '',
  grade: '5',
  academicYear: '2026-2027',
  maxCapacity: '40',
  homeroomTeacherId: '',
};

export function useClassesViewModel() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [classData, teacherData] = await Promise.all([
        classService.getAllClasses(),
        teacherService.getAllTeachers(),
      ]);
      setClasses(classData);
      setTeachers(teacherData);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredClasses = useMemo(() =>
    classes.filter((cls) => {
      const matchSearch = cls.tenLop.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGrade = filterGrade === 'all' || cls.khoiLop.toString() === filterGrade;
      return matchSearch && matchGrade;
    }), [classes, searchQuery, filterGrade]);

  const openCreateModal = () => {
    setEditingClass(null);
    setFormData(INITIAL_FORM);
    setShowClassModal(true);
  };

  const openEditModal = (cls: ClassRoom) => {
    setEditingClass(cls);
    setFormData({
      name: cls.tenLop,
      grade: cls.khoiLop.toString(),
      academicYear: cls.namHoc?.tenNamHoc ?? '',
      maxCapacity: cls.siSoToiDa.toString(),
      homeroomTeacherId: cls.giaoVienChuNhiem?.giaoVienId?.toString() ?? '',
    });
    setShowClassModal(true);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await classService.toggleStatus(id);
      toast.success('Cập nhật trạng thái thành công!');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleSaveClass = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const dto = {
        name: formData.name,
        grade: parseInt(formData.grade),
        academicYear: formData.academicYear,
        maxCapacity: parseInt(formData.maxCapacity),
        homeroomTeacherId: formData.homeroomTeacherId ? parseInt(formData.homeroomTeacherId) : undefined,
      };
      if (!editingClass) {
        await classService.createClass(dto as any);
        toast.success('Tạo lớp học thành công!');
      } else {
        await classService.updateClass(editingClass.lopHocId, dto as any);
        toast.success('Sửa lớp học thành công!');
      }
      setShowClassModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo lớp');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Data
    filteredClasses, teachers, isLoading, isSubmitting,
    // Modal
    showClassModal, setShowClassModal,
    editingClass,
    formData, setFormData,
    // Filters
    searchQuery, setSearchQuery,
    filterGrade, setFilterGrade,
    // Handlers
    openCreateModal,
    openEditModal,
    handleToggleStatus,
    handleSaveClass,
  };
}
