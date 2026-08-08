import { useState, useEffect, useMemo, useCallback } from 'react';
import { adminService } from '../../../services/admin.service';
import { classService } from '../../../services/class.service';
import { useAcademicStore } from '../../../stores/useAcademicStore';
import toast from 'react-hot-toast';

export type TabType = 'teacher' | 'student' | 'parent';

const INITIAL_CREATE_FORM = {
  role: 'HOC_SINH',
  studentCode: '',
  fullName: '',
  dateOfBirth: '',
  department: '',
  phone: '',
  classId: '',
  parentName: '',
  parentPhone: '',
};

export function useUsersViewModel() {
  const [activeTab, setActiveTab] = useState<TabType>('student');
  const [users, setUsers] = useState<any[]>([]); // This will now accumulate pages
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // Modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Selected + form state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    soDienThoai: '', trangThai: '', hoTen: '', email: '', ngaySinh: '', gioiTinh: 'NAM', boMon: '', lopHocId: '' as string | number,
  });
  const [createFormData, setCreateFormData] = useState(INITIAL_CREATE_FORM);
  const [transferClassId, setTransferClassId] = useState('');
  const [transferReason, setTransferReason] = useState('DOI_LOP');

  // Action loading flags
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClassId, setFilterClassId] = useState('all'); // used for student and parent
  const [filterGrade, setFilterGrade] = useState('all'); // used for student
  const [filterSubject, setFilterSubject] = useState('all'); // used for teacher
  const [filterTeacherClassId, setFilterTeacherClassId] = useState('all'); // used for teacher

  const selectedNamHocId = useAcademicStore((s) => s.selectedNamHocId);

  // Initial fetch for metadata (classes)
  useEffect(() => {
    classService.getAllClasses().then(setClasses).catch(() => {});
  }, []);

  const fetchUsers = async (pageNumber: number = 0, isAppend: boolean = false) => {
    if (pageNumber === 0) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const roleMap: Record<TabType, string> = {
        student: 'HOC_SINH',
        teacher: 'GIAO_VIEN',
        parent: 'PHU_HUYNH',
      };

      const searchParams: any = {
        role: roleMap[activeTab],
        page: pageNumber,
        size: 15,
      };

      if (searchQuery) searchParams.keyword = searchQuery;
      if (filterStatus !== 'all') searchParams.status = filterStatus;
      if (selectedNamHocId) searchParams.namHocId = selectedNamHocId;

      if (activeTab === 'student' || activeTab === 'parent') {
        if (filterClassId !== 'all') searchParams.classId = filterClassId;
      }
      if (activeTab === 'student') {
        if (filterGrade !== 'all') searchParams.grade = filterGrade;
      }
      if (activeTab === 'teacher') {
        if (filterSubject !== 'all') searchParams.subject = filterSubject;
        if (filterTeacherClassId !== 'all') searchParams.classId = filterTeacherClassId;
      }

      const result = await adminService.searchUsers(searchParams);
      if (isAppend) {
        setUsers(prev => [...prev, ...result.content]);
      } else {
        setUsers(result.content);
      }
      setIsLastPage(result.last);
      setPage(pageNumber);
    } catch {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // When filters change, reset and fetch page 0
  useEffect(() => {
    fetchUsers(0, false);
  }, [activeTab, searchQuery, filterStatus, filterClassId, filterGrade, filterSubject, filterTeacherClassId, selectedNamHocId]);

  const loadMore = useCallback(() => {
    if (!isLastPage && !isLoadingMore && !isLoading) {
      fetchUsers(page + 1, true);
    }
  }, [page, isLastPage, isLoadingMore, isLoading, activeTab, searchQuery, filterStatus, filterClassId, filterGrade, filterSubject, filterTeacherClassId, selectedNamHocId]);

  const subjects = useMemo(() => {
    return Array.from(new Set(users.filter(u => u.role === 'GIAO_VIEN' && u.boMon).map(u => u.boMon)));
  }, [users]);

  const grades = useMemo(() => {
    return Array.from(new Set(users.filter(u => u.role === 'HOC_SINH' && u.khoiLop).map(u => u.khoiLop))).sort((a: any, b: any) => a - b);
  }, [users]);

  const handleToggleStatus = async (userId: number) => {
    try {
      const targetUser = users.find(u => u.id === userId || u.userId === userId);
      if (!targetUser) return;
      const newStatus = targetUser.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
      await adminService.toggleUserStatus(userId, newStatus);
      // Soft update list
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch {
      toast.error('Có lỗi xảy ra khi đổi trạng thái');
    }
  };

  const handleTransferClass = async () => {
    if (!transferClassId) return;
    setIsTransferring(true);
    try {
      await adminService.transferClass(selectedUser.id, parseInt(transferClassId), transferReason);
      toast.success('Chuyển lớp thành công!');
      setShowTransferModal(false);
      fetchUsers(0, false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi chuyển lớp');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleUpdateUser = async () => {
    setIsUpdating(true);
    try {
      const promises = [];
      const userId = selectedUser.id || selectedUser.userId;
      
      // Update User entity fields
      const userPayload: any = { soDienThoai: editFormData.soDienThoai, email: editFormData.email };
      promises.push(adminService.updateUser(userId, userPayload));

      // Update status
      if (selectedUser.status !== editFormData.trangThai) {
        promises.push(adminService.toggleUserStatus(userId, editFormData.trangThai));
      }
      
      // Wait for user updates first, then update profile
      await Promise.all(promises);

      // Update Profile (Hồ sơ)
      try {
        if (activeTab === 'student' && selectedUser.maHocSinh) {
          const hoSo = await adminService.getHoSoHocSinhByMa(selectedUser.maHocSinh);
          if (hoSo && hoSo.hocSinhId) {
            await adminService.updateHoSoHocSinh(hoSo.hocSinhId, {
              hoTen: editFormData.hoTen,
              nguoiDungId: userId,
              maHocSinh: selectedUser.maHocSinh,
              ngaySinh: editFormData.ngaySinh || undefined,
              gioiTinh: editFormData.gioiTinh,
              lopHocId: editFormData.lopHocId ? Number(editFormData.lopHocId) : hoSo.lopHocId,
            });
          }
        } else if (activeTab === 'teacher' && selectedUser.maGiaoVien) {
          const hoSo = await adminService.getHoSoGiaoVienByMa(selectedUser.maGiaoVien);
          if (hoSo && hoSo.giaoVienId) {
            await adminService.updateHoSoGiaoVien(hoSo.giaoVienId, {
              hoTen: editFormData.hoTen,
              nguoiDungId: userId,
              maGiaoVien: selectedUser.maGiaoVien,
              ngaySinh: editFormData.ngaySinh || undefined,
              gioiTinh: editFormData.gioiTinh,
              boMon: editFormData.boMon || hoSo.boMon,
            });
          }
        } else if (activeTab === 'parent') {
          const allPH = await adminService.getAllHoSoPhuHuynh();
          const hoSo = allPH.find((ph: any) => ph.nguoiDungId === userId || ph.nguoiDungId === String(userId));
          if (hoSo && hoSo.phuHuynhId) {
            await adminService.updateHoSoPhuHuynh(hoSo.phuHuynhId, { 
              hoTen: editFormData.hoTen, 
              emailNhanThongBao: editFormData.email,
              nguoiDungId: userId
            });
          }
        }
      } catch (profileErr) {
        console.error("Lỗi khi cập nhật hồ sơ:", profileErr);
        toast.error('Cập nhật tài khoản thành công nhưng cập nhật hồ sơ thất bại');
      }
      
      toast.success('Cập nhật tài khoản thành công!');
      setShowEditModal(false);
      fetchUsers(0, false);
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const payload: any = { ...createFormData };
      if (payload.role === 'HOC_SINH' && payload.classId) {
        payload.classId = parseInt(payload.classId);
      }
      await adminService.createUser(payload);
      toast.success('Tạo tài khoản thành công!');
      setShowCreateModal(false);
      setCreateFormData(INITIAL_CREATE_FORM);
      fetchUsers(0, false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setIsCreating(false);
    }
  };

  const [parentChildren, setParentChildren] = useState<any[]>([]);

  const fetchUserProfile = async (user: any) => {
    try {
      if (activeTab === 'student' && user.maHocSinh) {
        return await adminService.getHoSoHocSinhByMa(user.maHocSinh);
      } else if (activeTab === 'teacher' && user.maGiaoVien) {
        return await adminService.getHoSoGiaoVienByMa(user.maGiaoVien);
      } else if (activeTab === 'parent') {
        const allPH = await adminService.getAllHoSoPhuHuynh();
        return allPH.find((ph: any) => ph.nguoiDungId === user.id || ph.nguoiDungId === String(user.id));
      }
    } catch (err) {
      console.error("Lỗi lấy hồ sơ:", err);
    }
    return null;
  };

  const loadParentChildren = async (userId: string) => {
    try {
      const children = await adminService.getChildrenByParentId(userId);
      setParentChildren(children);
    } catch (err) {
      console.error("Lỗi lấy danh sách con:", err);
      setParentChildren([]);
    }
  };

  const openEditModal = async (user: any) => {
    const profile = await fetchUserProfile(user);
    if (activeTab === 'parent') {
      await loadParentChildren(String(user.id));
    }
    setSelectedUser({ ...user, profile });
    setEditFormData({
      soDienThoai: user.phone || user.soDienThoai || '',
      trangThai: user.status || user.trangThai,
      hoTen: profile?.hoTen || user.fullName || user.hoTen || user.name || '',
      email: profile?.emailNhanThongBao || user.email || '',
      ngaySinh: profile?.ngaySinh || '',
      gioiTinh: profile?.gioiTinh || 'NAM',
      boMon: profile?.boMon || '',
      lopHocId: profile?.lopHocId || '',
    });
    setShowEditModal(true);
  };

  const handleAddChild = async (maHocSinh: string, quanHe: string) => {
    if (!selectedUser || !selectedUser.profile?.phuHuynhId) {
      toast.error("Không tìm thấy hồ sơ phụ huynh!");
      return;
    }
    try {
      const hs = await adminService.getHoSoHocSinhByMa(maHocSinh);
      if (!hs || !hs.hocSinhId) {
        toast.error("Không tìm thấy học sinh với mã này!");
        return;
      }
      await adminService.createParentChildRelation(selectedUser.profile.phuHuynhId, hs.hocSinhId, quanHe);
      toast.success("Thêm con thành công!");
      await loadParentChildren(String(selectedUser.id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi thêm con!");
    }
  };

  const handleRemoveChild = async (idMoiQuanHe: number) => {
    try {
      await adminService.deleteParentChildRelation(idMoiQuanHe);
      toast.success("Xóa liên kết thành công!");
      if (selectedUser) {
        await loadParentChildren(String(selectedUser.id));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa liên kết!");
    }
  };

  const openTransferModal = (user: any) => {
    setSelectedUser(user);
    setTransferClassId('');
    setTransferReason('DOI_LOP');
    setShowTransferModal(true);
  };

  const openDetailModal = async (user: any) => {
    const profile = await fetchUserProfile(user);
    let children: any[] = [];
    if (activeTab === 'parent') {
      try {
        children = await adminService.getChildrenByParentId(String(user.id));
        setParentChildren(children);
      } catch (err) {
        console.error("Lỗi lấy danh sách con:", err);
      }
    }
    setSelectedUser({ ...user, profile, children });
    setShowDetailModal(true);
  };

  return {
    // State
    activeTab, setActiveTab,
    filteredUsers: users, visibleUsers: users, loadMore, classes, isLoading, isLoadingMore, isLastPage,
    selectedUser, subjects, grades,
    // Modals
    showCreateModal, setShowCreateModal,
    showEditModal, setShowEditModal,
    showDetailModal, setShowDetailModal,
    showTransferModal, setShowTransferModal,
    // Forms
    createFormData, setCreateFormData,
    editFormData, setEditFormData,
    transferClassId, setTransferClassId,
    transferReason, setTransferReason,
    // Action flags
    isCreating, isUpdating, isTransferring,
    // Filters
    searchQuery, setSearchQuery,
    filterStatus, setFilterStatus,
    filterClassId, setFilterClassId,
    filterGrade, setFilterGrade,
    filterSubject, setFilterSubject,
    filterTeacherClassId, setFilterTeacherClassId,
    // Handlers
    handleToggleStatus,
    handleTransferClass,
    handleUpdateUser,
    handleCreateUser,
    openEditModal,
    openTransferModal,
    openDetailModal,
    parentChildren,
    handleAddChild,
    handleRemoveChild
  };
}
