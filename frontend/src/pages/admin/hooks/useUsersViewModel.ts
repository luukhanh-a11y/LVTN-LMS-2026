import { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/admin.service';
import { classService } from '../../../services/class.service';
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
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Selected + form state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ soDienThoai: '', trangThai: '' });
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
  const [filterClassId, setFilterClassId] = useState('all');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, classesData] = await Promise.all([
        adminService.getAllUsers(),
        classService.getAllClasses(),
      ]);
      setUsers(usersData);
      setClasses(classesData);
    } catch {
      // silent — table will just show empty
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredUsers = useMemo(() => {
    const roleMap: Record<TabType, string> = {
      student: 'HOC_SINH',
      teacher: 'GIAO_VIEN',
      parent: 'PHU_HUYNH',
    };
    return users.filter((u) => {
      if (u.role !== roleMap[activeTab]) return false;
      const name = (u.fullName ?? u.username).toLowerCase();
      if (!name.includes(searchQuery.toLowerCase()) && !u.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterStatus !== 'all' && u.status !== filterStatus) return false;
      if ((activeTab === 'student' || activeTab === 'parent') && filterClassId !== 'all') {
        const classIdNum = parseInt(filterClassId);
        if (!u.classIds?.includes(classIdNum)) return false;
      }
      return true;
    });
  }, [users, activeTab, searchQuery, filterStatus, filterClassId]);

  const handleToggleStatus = async (userId: number) => {
    try {
      await adminService.toggleUserStatus(userId);
      fetchData();
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
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi chuyển lớp');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleUpdateUser = async () => {
    setIsUpdating(true);
    try {
      await adminService.updateUser(selectedUser.id, editFormData);
      toast.success('Cập nhật tài khoản thành công!');
      setShowEditModal(false);
      fetchData();
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
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditFormData({ soDienThoai: user.phone ?? '', trangThai: user.status });
    setShowEditModal(true);
  };

  const openTransferModal = (user: any) => {
    setSelectedUser(user);
    setTransferClassId('');
    setTransferReason('DOI_LOP');
    setShowTransferModal(true);
  };

  const openDetailModal = (user: any) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  return {
    // State
    activeTab, setActiveTab,
    filteredUsers, classes, isLoading,
    selectedUser,
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
    // Handlers
    handleToggleStatus,
    handleTransferClass,
    handleUpdateUser,
    handleCreateUser,
    openEditModal,
    openTransferModal,
    openDetailModal,
  };
}
