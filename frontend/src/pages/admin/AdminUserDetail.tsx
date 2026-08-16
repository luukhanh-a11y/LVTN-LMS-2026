import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Shield, Lock, Unlock, Award, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/Button';
import { adminService } from '../../services/admin.service';
import { classService } from '../../services/class.service';

export default function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  // Base State
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);

  // Common User Data
  const [baseUser, setBaseUser] = useState<any>(null);
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [vaiTro, setVaiTro] = useState('');
  const [trangThai, setTrangThai] = useState('');
  
  // Profile Data
  const [profileId, setProfileId] = useState<number | null>(null);
  const [hoTen, setHoTen] = useState('');
  const [anhDaiDienUrl, setAnhDaiDienUrl] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [gioiTinh, setGioiTinh] = useState('NAM');
  
  // Specific Data - Teacher
  const [maGiaoVien, setMaGiaoVien] = useState('');
  const [boMon, setBoMon] = useState('');
  const [lopGiangDay, setLopGiangDay] = useState<any[]>([]);

  // Specific Data - Student
  const [maHocSinh, setMaHocSinh] = useState('');
  const [lopHocId, setLopHocId] = useState<number | ''>('');
  const [tongXp, setTongXp] = useState(0);

  // Specific Data - Parent
  const [emailNhanThongBao, setEmailNhanThongBao] = useState('');
  const [childrenInfo, setChildrenInfo] = useState<any[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [searchStudentTerm, setSearchStudentTerm] = useState('');
  const [foundStudents, setFoundStudents] = useState<any[]>([]);
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);

  const handleSearchStudent = async () => {
    if (!searchStudentTerm) return;
    setIsSearchingStudent(true);
    try {
      const res = await adminService.searchUsers({ keyword: searchStudentTerm, role: 'HOC_SINH', size: 10 });
      setFoundStudents(res.content || []);
    } catch (err) {
      toast.error('Lỗi khi tìm kiếm');
    } finally {
      setIsSearchingStudent(false);
    }
  };

  const handleLinkStudent = async (studentUserId: number, maHocSinh: string) => {
    if (!profileId) {
      toast.error('Không tìm thấy profileId của phụ huynh');
      return;
    }
    try {
      // Get real hocSinhId from maHocSinh if possible, or just use user ID if backend maps them
      let realHocSinhId = studentUserId;
      if (maHocSinh) {
        const hsInfo = await adminService.getHoSoHocSinhByMa(maHocSinh);
        if (hsInfo && (hsInfo.hocSinhId || hsInfo.id)) {
          realHocSinhId = hsInfo.hocSinhId || hsInfo.id;
        }
      }
      
      await adminService.createParentChildRelation(profileId, realHocSinhId, 'Phụ huynh');
      toast.success('Liên kết học sinh thành công');
      setShowLinkModal(false);
      setSearchStudentTerm('');
      setFoundStudents([]);
      // Reload children
      if (userId) {
        const children = await adminService.getChildrenByParentId(userId as string);
        setChildrenInfo(children);
      }
    } catch (err) {
      toast.error('Lỗi khi liên kết học sinh (Có thể đã liên kết hoặc sai ID)');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchClasses();
    }
  }, [userId]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (e) {
      console.warn('Failed to load classes', e);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      // 1. Lấy thông tin cơ bản
      let found = await adminService.getUserById(userId as string);
      
      if (!found) {
        toast.error('Không tìm thấy người dùng');
        navigate('/admin/users');
        return;
      }

      setBaseUser(found);
      setTenDangNhap(found.tenDangNhap || found.username || '');
      setEmail(found.email || '');
      setSoDienThoai(found.soDienThoai || found.phone || '');
      setTrangThai(found.trangThai || found.status || 'ACTIVE');
      
      let mappedRole = found.vaiTro || found.role || '';
      if (mappedRole === 'GIAO_VIEN') mappedRole = 'Giáo viên';
      else if (mappedRole === 'HOC_SINH') mappedRole = 'Học sinh';
      else if (mappedRole === 'PHU_HUYNH') mappedRole = 'Phụ huynh';
      else if (mappedRole === 'ADMIN') mappedRole = 'Quản trị';
      setVaiTro(mappedRole);

      // 2. Tìm kiếm thông tin chi tiết qua searchUsers
      let joinedData: any = null;
      try {
        const searchRes = await adminService.searchUsers({ keyword: found.tenDangNhap || found.username, size: 10 });
        joinedData = searchRes.content.find((u: any) => String(u.id) === userId || String(u.userId) === userId);
      } catch (e) {
        console.warn("Could not fetch joined profile data", e);
      }

      // 3. Lấy hồ sơ chuyên sâu
      if (mappedRole === 'Học sinh') {
        const ma = joinedData?.maHocSinh;
        if (ma) {
          const hoso = await adminService.getHoSoHocSinhByMa(ma);
          if (hoso) {
            setProfileId(hoso.hocSinhId || hoso.id);
            setHoTen(hoso.hoTen || '');
            setAnhDaiDienUrl(hoso.anhDaiDienUrl || '');
            setNgaySinh(hoso.ngaySinh ? hoso.ngaySinh.split('T')[0] : '');
            setGioiTinh(hoso.gioiTinh === 'NU' ? 'NU' : 'NAM');
            setMaHocSinh(hoso.maHocSinh || '');
            setLopHocId(hoso.lopHocId || hoso.lopHoc?.lopHocId || '');
            setTongXp(hoso.tongXp || 0);
          }
        }
      } else if (mappedRole === 'Giáo viên') {
        const ma = joinedData?.maGiaoVien;
        if (ma) {
          const hoso = await adminService.getHoSoGiaoVienByMa(ma);
          if (hoso) {
            setProfileId(hoso.giaoVienId || hoso.id);
            setHoTen(hoso.hoTen || '');
            setAnhDaiDienUrl(hoso.anhDaiDienUrl || '');
            setNgaySinh(hoso.ngaySinh ? hoso.ngaySinh.split('T')[0] : '');
            setGioiTinh(hoso.gioiTinh === 'NU' ? 'NU' : 'NAM');
            setMaGiaoVien(hoso.maGiaoVien || '');
            setBoMon(hoso.boMon || '');
            // Dữ liệu lớp giảng dạy thường thông qua bảng phan_cong_giang_day
            // Tạm thời set mảng rỗng nếu backend không gửi kèm
            setLopGiangDay(hoso.lopGiangDay || []);
          }
        }
      } else if (mappedRole === 'Phụ huynh') {
        // Phụ huynh không có mã, lấy danh sách tất cả và map
        const danhSachPh = await adminService.getAllHoSoPhuHuynh();
        const hoso = danhSachPh.find(p => String(p.nguoiDungId) === String(userId));
        if (hoso) {
          setProfileId(hoso.phuHuynhId || hoso.id);
          setHoTen(hoso.hoTen || '');
          setEmailNhanThongBao(hoso.emailNhanThongBao || '');
        }
        
        // Cố gắng lấy danh sách con (nếu api getChildrenByParentId hoạt động)
        try {
          const children = await adminService.getChildrenByParentId(userId as string);
          setChildrenInfo(children);
        } catch (e) {
           // Fallback sang joinedData nếu có
           if (joinedData && joinedData.tenCon) {
              setChildrenInfo([{ hoTen: joinedData.tenCon, tenLop: joinedData.lopCuaCon }]);
           }
        }
      }

      // Fallback nếu API chuyên sâu không lấy được họ tên
      if (!hoTen && (found.hoTen || found.fullName)) {
        setHoTen(found.hoTen || found.fullName);
      }

    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải thông tin chi tiết người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
      // Lưu thông tin cơ bản của User
      await adminService.updateUser(userId, {
        email: email || null,
        soDienThoai: soDienThoai || null,
        tenDangNhap,
      });

      // Lưu thông tin Hồ sơ chuyên sâu
      if (profileId) {
        if (vaiTro === 'Học sinh') {
          await adminService.updateHoSoHocSinh(profileId, {
            hoTen,
            anhDaiDienUrl,
            ngaySinh: ngaySinh || null,
            gioiTinh,
            lopHocId: lopHocId || null,
            maHocSinh,
          });
        } else if (vaiTro === 'Giáo viên') {
          await adminService.updateHoSoGiaoVien(profileId, {
            hoTen,
            anhDaiDienUrl,
            ngaySinh: ngaySinh || null,
            gioiTinh,
            boMon,
            maGiaoVien,
          });
        } else if (vaiTro === 'Phụ huynh') {
          await adminService.updateHoSoPhuHuynh(profileId, {
            hoTen,
            emailNhanThongBao,
            // SĐT đã cập nhật ở bảng user, nhưng nếu backend yêu cầu thì gửi luôn
            soDienThoai: soDienThoai
          });
        }
      }

      toast.success('Cập nhật thành công!');
      fetchUser();
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cập nhật dữ liệu');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleLock = async () => {
    if (!userId) return;
    try {
      const isLocked = trangThai === 'LOCKED' || trangThai === 'Đã khóa';
      const newStatus = isLocked ? 'ACTIVE' : 'LOCKED';
      await adminService.toggleUserStatus(Number(userId), newStatus);
      toast.success(`Tài khoản đã được ${isLocked ? 'mở khóa' : 'khóa'}!`);
      fetchUser();
    } catch (err) {
      toast.error('Lỗi khi thay đổi trạng thái');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!baseUser) return null;

  const isLocked = trangThai === 'LOCKED' || trangThai === 'Đã khóa';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/users" className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Hồ sơ người dùng</h2>
            <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin chi tiết và cài đặt tài khoản.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant={isLocked ? 'primary' : 'danger'}
            onClick={handleToggleLock}
          >
            {isLocked ? (
              <><Unlock className="w-4 h-4 mr-2" /> Mở khóa tài khoản</>
            ) : (
              <><Lock className="w-4 h-4 mr-2" /> Khóa tài khoản</>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Phần 1: Form đặc thù theo Role */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden relative group">
              {anhDaiDienUrl ? (
                <img src={anhDaiDienUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                hoTen.charAt(0).toUpperCase() || tenDangNhap.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{hoTen || 'Chưa cập nhật tên'}</h3>
              <p className="text-sm font-medium text-blue-600">{vaiTro}</p>
            </div>
          </div>

          <div className="p-6">
            <h4 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> 
              Thông tin Hồ sơ ({vaiTro})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* === HỒ SƠ GIÁO VIÊN === */}
              {vaiTro === 'Giáo viên' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                    <input type="text" required value={hoTen} onChange={e => setHoTen(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mã giáo viên</label>
                    <input type="text" value={maGiaoVien} onChange={e => setMaGiaoVien(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Ngày sinh</label>
                    <input type="date" value={ngaySinh} onChange={e => setNgaySinh(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Giới tính</label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gioiTinh" value="NAM" checked={gioiTinh === 'NAM'} onChange={e => setGioiTinh(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-slate-700">Nam</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gioiTinh" value="NU" checked={gioiTinh === 'NU'} onChange={e => setGioiTinh(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-slate-700">Nữ</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Bộ môn</label>
                    <select value={boMon} onChange={e => setBoMon(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">-- Chọn bộ môn --</option>
                      <option value="Toán">Toán</option>
                      <option value="Vật lý">Vật lý</option>
                      <option value="Hóa học">Hóa học</option>
                      <option value="Ngữ văn">Ngữ văn</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                      <option value="Sinh học">Sinh học</option>
                      <option value="Lịch sử">Lịch sử</option>
                      <option value="Địa lý">Địa lý</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Lớp giảng dạy (Chỉ đọc)</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {lopGiangDay.length > 0 ? lopGiangDay.map((lop, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">Lớp {lop.tenLop || lop}</span>
                      )) : <span className="text-sm text-slate-400 italic">Chưa được phân công</span>}
                    </div>
                  </div>
                </>
              )}

              {/* === HỒ SƠ HỌC SINH === */}
              {vaiTro === 'Học sinh' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                    <input type="text" required value={hoTen} onChange={e => setHoTen(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mã học sinh</label>
                    <input type="text" value={maHocSinh} onChange={e => setMaHocSinh(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Ngày sinh</label>
                    <input type="date" value={ngaySinh} onChange={e => setNgaySinh(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Giới tính</label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gioiTinh" value="NAM" checked={gioiTinh === 'NAM'} onChange={e => setGioiTinh(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-slate-700">Nam</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gioiTinh" value="NU" checked={gioiTinh === 'NU'} onChange={e => setGioiTinh(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-slate-700">Nữ</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Lớp học</label>
                    <select value={lopHocId} onChange={e => setLopHocId(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">-- Chọn lớp học --</option>
                      {classes.map(c => (
                        <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop} (Khối {c.khoiLop})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Kinh nghiệm (XP)</label>
                    <div className="flex items-center gap-3 pt-1">
                      <Award className="w-8 h-8 text-amber-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-amber-600">{tongXp} XP</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-amber-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* === HỒ SƠ PHỤ HUYNH === */}
              {vaiTro === 'Phụ huynh' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                    <input type="text" required value={hoTen} onChange={e => setHoTen(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email nhận thông báo</label>
                    <input type="email" value={emailNhanThongBao} onChange={e => setEmailNhanThongBao(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">Thông tin con cái</label>
                      <Button size="sm" variant="outline" type="button" onClick={() => setShowLinkModal(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Thêm liên kết
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {childrenInfo.length > 0 ? childrenInfo.map((child: any, idx) => (
                        <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex flex-col">
                          <span className="font-semibold text-slate-800">{child.hoTen || child.fullName || 'Tên học sinh'}</span>
                          <span className="text-xs text-slate-500 mt-1">Lớp: {child.tenLop || child.className || 'Chưa cập nhật'}</span>
                        </div>
                      )) : <div className="p-4 text-center text-slate-500 text-sm border border-dashed rounded-xl w-full col-span-2">Chưa liên kết học sinh nào.</div>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Phần 2: Thông tin tài khoản chung */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-400" /> 
            Cài đặt Tài khoản (NguoiDung)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tên đăng nhập</label>
              <input type="text" value={tenDangNhap} onChange={e => setTenDangNhap(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <label className="text-sm font-medium text-slate-700 mb-2">Trạng thái hệ thống</label>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${!isLocked ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {!isLocked ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
                
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email liên hệ chung</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Số điện thoại chung</label>
              <input type="tel" value={soDienThoai} onChange={e => setSoDienThoai(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Hidden Inputs */}
            <input type="hidden" name="nguoiDungId" value={userId} />
            <input type="hidden" name="profileId" value={profileId || ''} />
          </div>
        </div>

        <div className="flex justify-end pt-2 pb-6">
          <Button type="submit" variant="primary" isLoading={isSaving} size="lg">
            Lưu tất cả thay đổi
          </Button>
        </div>
      </form>

      {/* Modal Liên kết Học sinh */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title="Liên kết Học sinh">
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nhập tên, username hoặc mã học sinh..." 
              value={searchStudentTerm}
              onChange={e => setSearchStudentTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearchStudent()}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <Button variant="secondary" onClick={handleSearchStudent} isLoading={isSearchingStudent}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {foundStudents.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Chưa có kết quả tìm kiếm</p>
            ) : (
              foundStudents.map(student => (
                <div key={student.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{student.fullName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {student.maHocSinh ? `MHS: ${student.maHocSinh}` : `Username: ${student.username}`}
                      {student.tenLop && ` - Lớp ${student.tenLop}`}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleLinkStudent(student.id, student.maHocSinh)}>
                    Liên kết
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
