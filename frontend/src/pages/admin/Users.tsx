import { Search, Filter, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { CreateUserModal } from './components/CreateUserModal';
import { EditUserModal } from './components/EditUserModal';
import { TransferClassModal } from './components/TransferClassModal';
import { UserDetailModal } from './components/UserDetailModal';
import { useUsersViewModel, type TabType } from './hooks/useUsersViewModel';

const TABS: { key: TabType; label: string }[] = [
  { key: 'student', label: 'Học sinh' },
  { key: 'parent', label: 'Phụ huynh' },
  { key: 'teacher', label: 'Giáo viên' },
];

export default function AdminUsers() {
  const vm = useUsersViewModel();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quản lý Tài khoản</h1>
          <p className="text-slate-500 mt-2 text-sm">Quản lý học sinh, giáo viên và phụ huynh trong hệ thống.</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => vm.setShowCreateModal(true)}>+ Tạo tài khoản</Button>
          <Link to="/admin/import">
            <Button variant="secondary">
              <Upload className="h-4 w-4 mr-2" /> Import Excel
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-xl w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => vm.setActiveTab(key)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-bold transition-all',
              vm.activeTab === key
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="border-slate-200/60 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50/50 rounded-t-xl">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10 bg-white border-slate-200/80 focus:border-primary shadow-sm h-11"
              placeholder="Tìm kiếm theo tên, mã..."
              value={vm.searchQuery}
              onChange={(e) => vm.setSearchQuery(e.target.value)}
            />
          </div>

          {(vm.activeTab === 'student' || vm.activeTab === 'parent') && (
            <div className="flex items-center space-x-2 bg-white border border-slate-200/80 rounded-[14px] px-3 shadow-sm h-11">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                className="py-2 outline-none bg-transparent text-sm font-medium text-slate-700 w-[140px]"
                value={vm.filterClassId}
                onChange={(e) => vm.setFilterClassId(e.target.value)}
              >
                <option value="all">Tất cả các lớp</option>
                {vm.classes.map((c) => (
                  <option key={c.lopHocId} value={c.lopHocId.toString()}>{c.tenLop}</option>
                ))}
              </select>
            </div>
          )}

          <select
            className="px-4 border border-slate-200/80 rounded-[14px] outline-none bg-white text-sm font-medium text-slate-700 focus:border-primary shadow-sm h-11"
            value={vm.filterStatus}
            onChange={(e) => vm.setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="LOCKED">Bị khóa</option>
          </select>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="py-4">Họ và tên</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                {vm.activeTab === 'teacher' && <TableHead>Bảo mật</TableHead>}
                {vm.activeTab === 'student' && <TableHead>Email</TableHead>}
                {vm.activeTab === 'parent' && <TableHead>Số điện thoại</TableHead>}
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vm.filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-semibold text-slate-800">{user.fullName || user.username}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{user.username}</TableCell>
                  {vm.activeTab === 'teacher' && (
                    <TableCell>
                      {user.requirePasswordChange
                        ? <Badge variant="warning">Mặc định</Badge>
                        : <Badge variant="success">Đã đổi MK</Badge>}
                    </TableCell>
                  )}
                  {vm.activeTab === 'student' && (
                    <TableCell><span className="text-sm text-slate-500 font-medium">{user.email || 'Chưa có'}</span></TableCell>
                  )}
                  {vm.activeTab === 'parent' && (
                    <TableCell className="text-slate-600 font-medium">{user.phone || 'Chưa có'}</TableCell>
                  )}
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => vm.openDetailModal(user)} className="h-8 px-3 text-xs">Chi tiết</Button>
                    {vm.activeTab === 'student' && (
                      <Button variant="outline" size="sm" onClick={() => vm.openTransferModal(user)} className="h-8 px-3 text-xs">Chuyển lớp</Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => vm.handleToggleStatus(user.id)} className="h-8 px-3 text-xs">Trạng thái</Button>
                    <Button variant="ghost" size="sm" onClick={() => vm.openEditModal(user)} className="h-8 px-3 text-xs">Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
              {vm.filteredUsers.length === 0 && !vm.isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-medium">
                    Không tìm thấy tài khoản nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {vm.showTransferModal && vm.selectedUser && (
        <TransferClassModal
          user={vm.selectedUser} classes={vm.classes}
          transferClassId={vm.transferClassId} setTransferClassId={vm.setTransferClassId}
          transferReason={vm.transferReason} setTransferReason={vm.setTransferReason}
          onConfirm={vm.handleTransferClass} onClose={() => vm.setShowTransferModal(false)}
          isTransferring={vm.isTransferring}
        />
      )}
      {vm.showEditModal && vm.selectedUser && (
        <EditUserModal
          user={vm.selectedUser} activeTab={vm.activeTab}
          formData={vm.editFormData} setFormData={vm.setEditFormData}
          onConfirm={vm.handleUpdateUser} onClose={() => vm.setShowEditModal(false)}
          isUpdating={vm.isUpdating}
        />
      )}
      {vm.showCreateModal && (
        <CreateUserModal
          formData={vm.createFormData} setFormData={vm.setCreateFormData}
          classes={vm.classes} onSubmit={vm.handleCreateUser}
          onClose={() => vm.setShowCreateModal(false)} isCreating={vm.isCreating}
        />
      )}
      {vm.showDetailModal && vm.selectedUser && (
        <UserDetailModal user={vm.selectedUser} onClose={() => vm.setShowDetailModal(false)} />
      )}
    </div>
  );
}
