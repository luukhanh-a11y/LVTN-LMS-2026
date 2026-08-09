import { useState } from 'react';
import { Search, Plus, Filter, Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { usersData } from '../../mockAdminData';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Tất cả');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [users, setUsers] = useState(usersData);
  const [newUserRole, setNewUserRole] = useState('Giáo viên');

  const filteredUsers = users.filter(user => {
    const matchName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'Tất cả' || user.role === filterRole;
    return matchName && matchRole;
  });

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsImporting(false);
      setShowImportModal(false);
      toast.success('Import thành công 45 tài khoản Học sinh!');
    }, 2000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    setTimeout(() => {
      setIsAdding(false);
      setShowAddModal(false);
      toast.success('Đã thêm tài khoản thành công!');
    }, 800);
  };

  const handleToggleLock = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động';
        toast.success(`Tài khoản đã được ${newStatus.toLowerCase()}!`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
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
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            
            {(filterRole === 'Học sinh' || filterRole === 'Phụ huynh') && (
              <>
                <select className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer hidden md:block">
                  <option>Tất cả Khối</option>
                  <option>Khối 1</option>
                  <option>Khối 2</option>
                  <option>Khối 3</option>
                  <option>Khối 4</option>
                  <option>Khối 5</option>
                </select>
                <select className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer hidden md:block">
                  <option>Tất cả Lớp</option>
                  <option>1A1</option>
                  <option>1A2</option>
                  <option>1A3</option>
                  <option>1A4</option>
                </select>
              </>
            )}

            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="Tất cả">Tất cả vai trò</option>
              <option value="Giáo viên">Giáo viên</option>
              <option value="Học sinh">Học sinh</option>
              <option value="Phụ huynh">Phụ huynh</option>
            </select>
          </div>
        </div>

        {/* Bảng Dữ liệu */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Họ & Tên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Email / Tài khoản</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Đăng nhập: {user.lastLogin}</div>
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
                      <button 
                        type="button" 
                        onClick={() => handleToggleLock(user.id)}
                        className={cn(
                          "text-sm font-bold transition cursor-pointer px-3 py-1.5 rounded-lg",
                          user.status === 'Hoạt động' 
                            ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100" 
                            : "text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                        )}
                      >
                        {user.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                      </button>
                      <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg">
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
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
                  <option>Danh sách Học sinh & Phụ huynh</option>
                  <option>Danh sách Giáo viên</option>
                </select>
                <p className="text-xs text-slate-500">Lưu ý: Nếu SĐT phụ huynh trùng nhau, hệ thống sẽ tự động gộp vào chung một tài khoản Phụ huynh.</p>
              </div>

              {/* Vùng kéo thả file */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition cursor-pointer group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Upload className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Kéo thả file Excel vào đây</h4>
                <p className="text-sm text-slate-500 mb-4">hoặc nhấn để duyệt file (.xlsx, .xls)</p>
                <button type="button" className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                  Chọn file
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-3 text-sm text-blue-800">
                  <AlertCircle className="w-5 h-5" />
                  Bạn chưa có file mẫu?
                </div>
                <button type="button" className="text-sm font-bold text-blue-600 hover:underline">Tải file mẫu Excel</button>
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
                  placeholder="Nhập họ tên đầy đủ..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email hoặc Tên đăng nhập</label>
                <input 
                  type="text"
                  required
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
