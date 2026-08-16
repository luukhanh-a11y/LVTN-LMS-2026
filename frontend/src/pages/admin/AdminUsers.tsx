import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Eye, Lock, Unlock } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import { adminService } from '../../services/admin.service';
import { classService } from '../../services/class.service';
import { useAcademicStore } from '../../stores/useAcademicStore';

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('Tất cả');
  const [filterGrade, setFilterGrade] = useState('Tất cả');
  const [filterClass, setFilterClass] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isBulkLocking, setIsBulkLocking] = useState(false);
  const [bulkLockProgress, setBulkLockProgress] = useState({ current: 0, total: 0 });
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserRole, setNewUserRole] = useState('Giáo viên');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { selectedNamHocId } = useAcademicStore();

  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const isNamHocMatch = !selectedNamHocId || c.namHoc?.namHocId === selectedNamHocId;
      const isGradeMatch = filterGrade === 'Tất cả' || String(c.khoiLop) === filterGrade;
      return isNamHocMatch && isGradeMatch;
    });
  }, [classes, selectedNamHocId, filterGrade]);

  const availableKhoi = useMemo(() => {
    return Array.from(new Set(classes.map(c => c.khoiLop))).sort((a, b) => a - b);
  }, [classes]);

  useEffect(() => {
    classService.getAllClasses().then(setClasses).catch(console.error);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
  }, [debouncedSearch, filterRole, filterClass, filterGrade, filterStatus]);

  const fetchUsers = async () => {
    if (!hasMore && page > 0) return;
    setLoading(true);
    try {
      const roleMap: Record<string, string> = {
        'Tất cả': '',
        'Giáo viên': 'GIAO_VIEN',
        'Học sinh': 'HOC_SINH',
        'Phụ huynh': 'PHU_HUYNH'
      };
      
      const statusMap: Record<string, string> = {
        'Tất cả': '',
        'Hoạt động': 'ACTIVE',
        'Đã khóa': 'LOCKED'
      };
      
      const res = await adminService.searchUsers({
        keyword: debouncedSearch,
        role: roleMap[filterRole],
        status: statusMap[filterStatus] || undefined,
        classId: filterClass !== 'Tất cả' ? filterClass : undefined,
        grade: filterGrade !== 'Tất cả' ? filterGrade : undefined,
        page: page,
        size: 15
      });
      
      const mappedUsers = res.content.map((u: any) => ({
        id: u.id,
        name: u.fullName,
        email: u.email || u.username,
        role: u.role === 'GIAO_VIEN' ? 'Giáo viên' : u.role === 'HOC_SINH' ? 'Học sinh' : u.role === 'PHU_HUYNH' ? 'Phụ huynh' : 'Quản trị',
        status: u.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa',
        lastLogin: 'Gần đây'
      }));
      
      if (page === 0) {
        setUsers(mappedUsers);
      } else {
        setUsers(prev => {
          const newUsers = [...prev];
          mappedUsers.forEach((mu: any) => {
            if (!newUsers.find(u => u.id === mu.id)) newUsers.push(mu);
          });
          return newUsers;
        });
      }
      setHasMore(res.content.length === 15);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, filterRole, filterClass, filterGrade, filterStatus]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback((node: HTMLTableRowElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Use the fetched users directly
  const filteredUsers = users;

  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Vui lòng chọn file Excel');
      return;
    }
    setIsImporting(true);
    try {
      await adminService.importUsers(importFile);
      toast.success('Import thành công!');
      setShowImportModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi import');
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const roleMap: Record<string, string> = {
        'Giáo viên': 'GIAO_VIEN',
        'Học sinh': 'HOC_SINH',
        'Phụ huynh': 'PHU_HUYNH'
      };
      
      await adminService.createUser({
        tenDangNhap: newUserEmail.includes('@') ? newUserEmail.split('@')[0] : newUserEmail,
        matKhau: newUserPassword,
        email: newUserEmail.includes('@') ? newUserEmail : undefined,
        vaiTro: roleMap[newUserRole],
        trangThai: 'ACTIVE',
      });
      
      toast.success('Thêm tài khoản thành công!');
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleLock = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      const newStatus = user.status === 'Hoạt động' ? 'LOCKED' : 'ACTIVE';
      await adminService.toggleUserStatus(userId, newStatus);
      toast.success(`Tài khoản đã được ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'}!`);
      fetchUsers();
    } catch (err) {
      toast.error('Lỗi khi thay đổi trạng thái');
    }
  };

  const handleBulkLock = async () => {
    if (selectedUserIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn đảo ngược trạng thái (Khóa/Mở khóa) ${selectedUserIds.length} tài khoản này không?`)) return;
    
    setIsBulkLocking(true);
    setBulkLockProgress({ current: 0, total: selectedUserIds.length });
    
    let successCount = 0;
    for (let i = 0; i < selectedUserIds.length; i++) {
      const id = selectedUserIds[i];
      try {
        const user = users.find(u => u.id === id);
        if (user) {
          const newStatus = user.status === 'Hoạt động' ? 'LOCKED' : 'ACTIVE';
          await adminService.toggleUserStatus(id, newStatus);
          successCount++;
        }
      } catch (err) {
        console.error(`Lỗi khi xử lý user ${id}`);
      }
      setBulkLockProgress({ current: i + 1, total: selectedUserIds.length });
    }
    
    toast.success(`Đã xử lý xong ${successCount}/${selectedUserIds.length} tài khoản`);
    setIsBulkLocking(false);
    setSelectedUserIds([]);
    fetchUsers();
  };

  const toggleSelectAll = () => {
    if (filteredUsers.length === 0) return;
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter(userId => userId !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Tài khoản</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản Giáo viên, Học sinh và Phụ huynh.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="secondary"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setShowImportModal(true)}
          >
            Import Excel
          </Button>
          <Button 
            type="button" 
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Thêm tài khoản
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            
            <select 
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value); setFilterClass('Tất cả'); setFilterGrade('Tất cả'); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer shrink-0"
            >
              <option value="Tất cả">Tất cả vai trò</option>
              <option value="Giáo viên">Giáo viên</option>
              <option value="Học sinh">Học sinh</option>
              <option value="Phụ huynh">Phụ huynh</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer shrink-0"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Đã khóa">Đã khóa</option>
            </select>

            <select 
              value={filterGrade}
              onChange={(e) => { setFilterGrade(e.target.value); setFilterClass('Tất cả'); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer shrink-0"
            >
              <option value="Tất cả">Tất cả Khối</option>
              {availableKhoi.map(g => (
                <option key={g} value={g}>Khối {g}</option>
              ))}
            </select>

            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer shrink-0 max-w-[150px] truncate"
            >
              <option value="Tất cả">Tất cả Lớp</option>
              {filteredClasses.map(c => (
                <option key={c.lopHocId || c.id} value={c.lopHocId || c.id}>{c.tenLop || c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUserIds.length > 0 && (
          <div className="bg-blue-50/50 border-b border-blue-100 p-3 px-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Đã chọn {selectedUserIds.length} tài khoản
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedUserIds([])} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition">Bỏ chọn</button>
              <Button size="sm" onClick={handleBulkLock} isLoading={isBulkLocking} className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm font-semibold border-none">
                <Lock className="w-4 h-4 mr-2" /> Khóa / Mở khóa hàng loạt
              </Button>
            </div>
          </div>
        )}

        {/* Bảng Dữ liệu */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 w-12 border-b border-slate-200">
                  <input 
                    type="checkbox" 
                    checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredUsers.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Họ & Tên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Email / Tài khoản</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  ref={index === filteredUsers.length - 1 ? lastUserElementRef : null}
                  className={cn("hover:bg-slate-50/50 transition", selectedUserIds.includes(user.id) ? "bg-blue-50/20" : "")}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-2 py-4 text-sm font-medium text-slate-500">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Đăng nhập: {user.lastLogin}</div>
                    {user.role === 'Học sinh' && user.maHocSinh && <div className="text-xs font-medium text-blue-600 mt-1">MHS: {user.maHocSinh} {user.tenLop ? `- Lớp ${user.tenLop}` : ''}</div>}
                    {user.role === 'Giáo viên' && user.maGiaoVien && <div className="text-xs font-medium text-purple-600 mt-1">MGV: {user.maGiaoVien} {user.boMon ? `- ${user.boMon}` : ''}</div>}
                    {user.role === 'Phụ huynh' && user.tenCon && <div className="text-xs font-medium text-orange-600 mt-1">Con: {user.tenCon} {user.lopCuaCon ? `- Lớp ${user.lopCuaCon}` : ''}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold",
                      user.role === 'Giáo viên' ? "bg-purple-100 text-purple-700" :
                      user.role === 'Học sinh' ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-sm font-medium",
                      user.status === 'Hoạt động' ? "text-emerald-600" : "text-red-600"
                    )}>
                      <span className={cn("w-2 h-2 rounded-full", user.status === 'Hoạt động' ? "bg-emerald-500" : "bg-red-500")}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/users/${user.id}`}
                        className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" /> Xem chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && hasMore && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải thêm...
                    </div>
                  </td>
                </tr>
              )}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    Không tìm thấy tài khoản nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL IMPORT EXCEL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  Import Danh sách từ Excel
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => !isImporting && setShowImportModal(false)} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
                disabled={isImporting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleImport} className="p-8 bg-slate-50/50 space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Loại tài khoản cần Import</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white">
                  <option>Danh sách Học sinh</option>
                  <option>Danh sách Giáo viên</option>
                   <option>Danh sách Phụ huynh</option>
                </select>
                <p className="text-xs text-slate-500">Lưu ý: Nếu SĐT phụ huynh trùng nhau, hệ thống sẽ tự động gộp vào chung một tài khoản Phụ huynh.</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition cursor-pointer group relative">
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Upload className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">{importFile ? importFile.name : 'Kéo thả file Excel vào đây'}</h4>
                <p className="text-sm text-slate-500 mb-4">hoặc nhấn để duyệt file (.xlsx, .xls)</p>
                <button type="button" className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm pointer-events-none">
                  Chọn file
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-3 text-sm text-blue-800">
                  <AlertCircle className="w-5 h-5" />
                  Bạn chưa có file mẫu?
                </div>
                <button type="button" onClick={() => adminService.downloadTemplate()} className="text-sm font-bold text-blue-600 hover:underline">Tải file mẫu Excel</button>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowImportModal(false)} 
                  disabled={isImporting}
                >
                  Hủy bỏ
                </Button>
                <button 
                  type="submit" 
                  disabled={isImporting}
                  className="flex items-center justify-center min-w-[140px] gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold hover:bg-emerald-700 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Thực hiện Import</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM TÀI KHOẢN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-blue-600" />
                  Thêm Tài khoản mới
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => !isAdding && setShowAddModal(false)} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
                disabled={isAdding}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Họ và tên</label>
                <input 
                  type="text"
                  required
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  placeholder="Nhập họ tên đầy đủ..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email hoặc Tên đăng nhập</label>
                <input 
                  type="text"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="email@truong.edu.vn hoặc tên đăng nhập..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Vai trò</label>
                  <select 
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700"
                  >
                    <option value="Giáo viên">Giáo viên</option>
                    <option value="Học sinh">Học sinh</option>
                    <option value="Phụ huynh">Phụ huynh</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Mật khẩu khởi tạo</label>
                  <input 
                    type="password"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {(newUserRole === 'Học sinh' || newUserRole === 'Phụ huynh') && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Khối</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700">
                      <option>Khối 1</option>
                      <option>Khối 2</option>
                      <option>Khối 3</option>
                      <option>Khối 4</option>
                      <option>Khối 5</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Lớp</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700">
                      <option>1A1</option>
                      <option>1A2</option>
                      <option>1A3</option>
                      <option>1A4</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddModal(false)} 
                  disabled={isAdding}
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isAdding}
                >
                  {isAdding ? 'Đang thêm...' : 'Tạo tài khoản'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
