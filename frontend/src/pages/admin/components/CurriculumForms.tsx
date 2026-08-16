import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/admin.service';
import { useAcademicStore } from '../../../stores/useAcademicStore';
import { Plus, Trash2 } from 'lucide-react';

function toSlug(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function CreateSachModal({ isOpen, onClose, onSuccess, monHocList, initialData }: any) {
  const isEdit = !!initialData;
  const [tenSach, setTenSach] = useState('');
  const [slug, setSlug] = useState('');
  const [anhBiaUrl, setAnhBiaUrl] = useState('');
  const [moTa, setMoTa] = useState('');
  const [loaiSach, setLoaiSach] = useState<'SACH_GIAO_KHOA' | 'SACH_BAI_TAP' | 'SACH_THAM_KHAO'>('SACH_GIAO_KHOA');
  const [boSach, setBoSach] = useState('');
  const [khoiLop, setKhoiLop] = useState(1);
  const [monHocId, setMonHocId] = useState('');
  const [hocKy, setHocKy] = useState<number | ''>('');
  const [bookIdNgoai, setBookIdNgoai] = useState<number | ''>('');
  const [tongSoTrang, setTongSoTrang] = useState<number | ''>('');
  const [namXuatBan, setNamXuatBan] = useState<number | ''>('');
  const [banQuyen, setBanQuyen] = useState('');
  const [banBienSoan, setBanBienSoan] = useState<any[]>([]);
  const [trangThai, setTrangThai] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);

  const { selectedNamHocId } = useAcademicStore();
  const [hocKyList, setHocKyList] = useState<any[]>([]);

  useEffect(() => {
    if (selectedNamHocId) {
      import('../../../services/academic.service').then(({ academicService }) => {
        academicService.getHocKysByNamHoc(selectedNamHocId)
          .then(setHocKyList)
          .catch(() => setHocKyList([]));
      });
    }
  }, [selectedNamHocId]);

  useEffect(() => {
    if (!isOpen) return;
    setTenSach(initialData?.tenSach ?? '');
    setSlug(initialData?.slug ?? '');
    setAnhBiaUrl(initialData?.anhBiaUrl ?? '');
    setMoTa(initialData?.moTa ?? '');
    setLoaiSach(initialData?.loaiSach ?? 'SACH_GIAO_KHOA');
    setBoSach(initialData?.boSach ?? '');
    setKhoiLop(initialData?.khoiLop ?? 1);
    setMonHocId(initialData?.monHocId ?? '');
    setHocKy(initialData?.hocKyId ?? '');
    setBookIdNgoai(initialData?.bookIdNgoai ?? '');
    setTongSoTrang(initialData?.tongSoTrang ?? '');
    setNamXuatBan(initialData?.namXuatBan ?? new Date().getFullYear());
    setBanQuyen(initialData?.banQuyen ?? '');
    setTrangThai(initialData?.trangThai ?? 'ACTIVE');
    
    if (initialData?.banBienSoan) {
      try {
        setBanBienSoan(JSON.parse(initialData.banBienSoan));
      } catch (e) {
        setBanBienSoan([]);
      }
    } else {
      setBanBienSoan([]);
    }
  }, [isOpen, initialData]);

  const handleTenSachChange = (val: string) => {
    setTenSach(val);
    if (!isEdit && !slug) {
      setSlug(toSlug(val));
    }
  };

  const addTacGia = () => {
    setBanBienSoan([...banBienSoan, { name: '', title: 'Tác giả', orderNo: banBienSoan.length + 1 }]);
  };

  const updateTacGia = (index: number, field: string, value: any) => {
    const newArr = [...banBienSoan];
    newArr[index][field] = value;
    setBanBienSoan(newArr);
  };

  const removeTacGia = (index: number) => {
    setBanBienSoan(banBienSoan.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!tenSach || !monHocId) return toast.error('Vui lòng nhập tên sách và chọn môn học');
    setLoading(true);
    try {
      const selectedMonHoc = monHocList.find((m: any) => String(m.monHocId) === String(monHocId));
      const payload = {
        tenSach,
        slug: slug || toSlug(tenSach),
        anhBiaUrl,
        moTa,
        loaiSach,
        boSach,
        khoiLop: Number(khoiLop),
        maMon: selectedMonHoc?.maMon,
        hocKyId: hocKy === '' ? null : Number(hocKy),
        bookIdNgoai: bookIdNgoai === '' ? null : Number(bookIdNgoai),
        tongSoTrang: tongSoTrang === '' ? null : Number(tongSoTrang),
        namXuatBan: namXuatBan === '' ? null : Number(namXuatBan),
        banQuyen,
        banBienSoan: JSON.stringify(banBienSoan),
        trangThai,
        namHocId: selectedNamHocId,
      };

      if (isEdit) {
        await adminService.updateSach(initialData.sachId, payload);
        toast.success('Cập nhật Sách thành công');
      } else {
        await adminService.createSach(payload);
        toast.success('Tạo Sách thành công');
      }
      onSuccess();
    } catch (err) {
      toast.error(isEdit ? 'Có lỗi khi cập nhật sách' : 'Có lỗi xảy ra khi tạo sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa Thông Tin Sách' : 'Thêm Sách Mới'}>
      <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Tên Sách *" value={tenSach} onChange={e => handleTenSachChange(e.target.value)} placeholder="VD: Toán 1 - Tập Một" />
          <Input label="Đường dẫn (Slug)" value={slug} onChange={e => setSlug(e.target.value)} placeholder="VD: toan-1-tap-mot" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ảnh Bìa</label>
          <div className="flex gap-4 items-center">
            {anhBiaUrl && (
              <img src={anhBiaUrl.startsWith('http') || anhBiaUrl.startsWith('blob') ? anhBiaUrl : `http://localhost:8080/${anhBiaUrl}`} alt="Bìa" className="h-16 w-16 object-cover rounded border" />
            )}
            <div className="flex-1">
              <Input value={anhBiaUrl} onChange={e => setAnhBiaUrl(e.target.value)} placeholder="Nhập URL ảnh hoặc dán link ảnh bìa" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
          <textarea 
            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
            rows={3}
            value={moTa}
            onChange={e => setMoTa(e.target.value)}
            placeholder="Mô tả tóm tắt nội dung cuốn sách..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phân loại sách</label>
            <select className="w-full border p-2 rounded bg-white text-sm" value={loaiSach} onChange={e => setLoaiSach(e.target.value as any)}>
              <option value="SACH_GIAO_KHOA">Sách giáo khoa</option>
              <option value="SACH_BAI_TAP">Sách bài tập</option>
              <option value="SACH_THAM_KHAO">Sách tham khảo</option>
            </select>
          </div>
          <Input label="Bộ sách" value={boSach} onChange={e => setBoSach(e.target.value)} placeholder="VD: Kết nối tri thức..." />
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Khối Lớp</label>
            <select className="w-full border p-2 rounded text-sm" value={khoiLop} onChange={e => setKhoiLop(Number(e.target.value))}>
              {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Khối {i + 1}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Môn Học</label>
            {isEdit ? (
               <div className="p-2 border rounded bg-slate-100 text-sm text-slate-600 truncate">
                 {monHocList.find((m: any) => m.monHocId === monHocId)?.tenMon || 'N/A'}
               </div>
            ) : (
              <select className="w-full border p-2 rounded text-sm" value={monHocId} onChange={e => setMonHocId(e.target.value)}>
                <option value="">-- Chọn Môn --</option>
                {monHocList.map((m: any) => <option key={m.monHocId} value={m.monHocId}>{m.tenMon}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Học Kỳ</label>
            <select className="w-full border p-2 rounded text-sm" value={hocKy} onChange={e => setHocKy(e.target.value === '' ? '' : Number(e.target.value))}>
              <option value="">-- Chọn Phân bổ học vụ --</option>
              {hocKyList.map(hk => (
                <option key={hk.hocKyId} value={hk.hocKyId}>{hk.soHocKy === 0 ? 'Cả năm (Dùng chung)' : `Học kỳ ${hk.soHocKy}`}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input label="ID Ngoại (Hệ thống khác)" type="number" value={bookIdNgoai} onChange={e => setBookIdNgoai(e.target.value)} placeholder="VD: 407" />
          <Input label="Tổng số trang" type="number" value={tongSoTrang} onChange={e => setTongSoTrang(e.target.value)} placeholder="VD: 120" />
          <Input label="Năm xuất bản" type="number" value={namXuatBan} onChange={e => setNamXuatBan(e.target.value)} placeholder="VD: 2024" />
        </div>

        <Input label="Bản quyền" value={banQuyen} onChange={e => setBanQuyen(e.target.value)} placeholder="VD: Nhà xuất bản Giáo dục" />

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">Ban biên soạn (Tác giả)</label>
            <button type="button" onClick={addTacGia} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded flex items-center font-medium hover:bg-indigo-100">
              <Plus className="w-3 h-3 mr-1" /> Thêm
            </button>
          </div>
          {banBienSoan.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-2">Chưa có thông tin tác giả.</p>
          ) : (
            <div className="space-y-2">
              {banBienSoan.map((tacGia, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input value={tacGia.name} onChange={e => updateTacGia(index, 'name', e.target.value)} placeholder="Tên tác giả" className="flex-1" />
                  <Input value={tacGia.title} onChange={e => updateTacGia(index, 'title', e.target.value)} placeholder="Chức danh" className="w-32" />
                  <button type="button" onClick={() => removeTacGia(index)} className="p-2 text-red-500 hover:bg-red-50 rounded mt-5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={trangThai === 'ACTIVE'} onChange={(e) => setTrangThai(e.target.checked ? 'ACTIVE' : 'INACTIVE')} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${trangThai === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${trangThai === 'ACTIVE' ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-slate-700">{trangThai === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm ẩn'}</span>
          </label>
        </div>

        {isEdit && (
          <div className="text-xs text-slate-400 flex gap-4 bg-slate-50 p-2 rounded">
            <span>ID: {initialData.sachId}</span>
            <span>Tạo: {new Date(initialData.ngayTao).toLocaleString('vi-VN')}</span>
            <span>Cập nhật: {new Date(initialData.ngayCapNhat).toLocaleString('vi-VN')}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} variant="outline" className="mr-3">Hủy</Button>
          <Button onClick={handleSubmit} isLoading={loading}>{isEdit ? 'Lưu Sách' : 'Tạo Sách'}</Button>
        </div>
      </div>
    </Modal>
  );
}

export function CreateChuDeModal({ isOpen, onClose, onSuccess, sachId, tenSach, initialData }: any) {
  const isEdit = !!initialData;
  const [tenChuDe, setTenChuDe] = useState('');
  const [tieuDe, setTieuDe] = useState('');
  const [slug, setSlug] = useState('');
  const [soThuTu, setSoThuTu] = useState<number | ''>(1);
  const [soTrang, setSoTrang] = useState<number | ''>('');
  const [bookIndexIdNgoai, setBookIndexIdNgoai] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTenChuDe(initialData?.tenChuDe ?? '');
    setTieuDe(initialData?.tieuDe ?? '');
    setSlug(initialData?.slug ?? '');
    setSoThuTu(initialData?.soThuTu ?? 1);
    setSoTrang(initialData?.soTrang ?? '');
    setBookIndexIdNgoai(initialData?.bookIndexIdNgoai ?? '');
  }, [isOpen, initialData]);

  const handleTenChuDeChange = (val: string) => {
    setTenChuDe(val);
    if (!isEdit && !slug) {
      setSlug(toSlug(val));
    }
  };

  const handleSubmit = async () => {
    if (!tenChuDe) return toast.error('Vui lòng nhập tên chủ đề');
    setLoading(true);
    try {
      const payload = {
        tenChuDe,
        tieuDe,
        slug: slug || toSlug(tenChuDe),
        soThuTu: soThuTu === '' ? null : Number(soThuTu),
        soTrang: soTrang === '' ? null : Number(soTrang),
        bookIndexIdNgoai: bookIndexIdNgoai === '' ? null : Number(bookIndexIdNgoai),
        sachId
      };

      if (isEdit) {
        await adminService.updateChuDe(initialData.chuDeId, payload);
        toast.success('Cập nhật Chủ Đề thành công');
      } else {
        await adminService.createChuDe(payload);
        toast.success('Tạo Chủ Đề thành công');
      }
      onSuccess();
    } catch (err) {
      toast.error(isEdit ? 'Có lỗi khi cập nhật chủ đề' : 'Có lỗi xảy ra khi tạo chủ đề');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa Chủ Đề' : 'Thêm Chủ Đề Mới'}>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sách thuộc về</label>
          <div className="p-2 border rounded bg-slate-100 text-sm text-slate-600 font-medium">
            {tenSach || 'Chưa xác định sách'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Tên Chủ Đề *" value={tenChuDe} onChange={e => handleTenChuDeChange(e.target.value)} placeholder="VD: Chủ đề 1" />
          <Input label="Tiêu Đề (Hiển thị)" value={tieuDe} onChange={e => setTieuDe(e.target.value)} placeholder="VD: Phép cộng trừ trong phạm vi 10" />
        </div>

        <Input label="Đường dẫn (Slug)" value={slug} onChange={e => setSlug(e.target.value)} placeholder="VD: chu-de-1-phep-cong" />

        <div className="grid grid-cols-3 gap-4">
          <Input label="Số thứ tự" type="number" value={soThuTu} onChange={e => setSoThuTu(e.target.value)} />
          <Input label="Trang bắt đầu" type="number" value={soTrang} onChange={e => setSoTrang(e.target.value)} />
          <Input label="ID Ngoại (Mục lục)" type="number" value={bookIndexIdNgoai} onChange={e => setBookIndexIdNgoai(e.target.value)} />
        </div>

        {isEdit && (
          <div className="text-xs text-slate-400 flex gap-4 bg-slate-50 p-2 rounded">
            <span>ID: {initialData.chuDeId}</span>
            <span>Tạo lúc: {new Date(initialData.ngayTao).toLocaleString('vi-VN')}</span>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline" className="mr-3">Hủy</Button>
          <Button onClick={handleSubmit} isLoading={loading}>{isEdit ? 'Lưu Chủ Đề' : 'Thêm Chủ Đề'}</Button>
        </div>
      </div>
    </Modal>
  );
}

export function CreateBaiHocModal({ isOpen, onClose, onSuccess, chuDeId, tenChuDe, initialData }: any) {
  const isEdit = !!initialData;
  const [tenBaiHoc, setTenBaiHoc] = useState('');
  const [tieuDe, setTieuDe] = useState('');
  const [slug, setSlug] = useState('');
  const [soThuTu, setSoThuTu] = useState<number | ''>(1);
  const [soTrang, setSoTrang] = useState<number | ''>('');
  const [bookIndexIdNgoai, setBookIndexIdNgoai] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTenBaiHoc(initialData?.tenBaiHoc ?? '');
    setTieuDe(initialData?.tieuDe ?? '');
    setSlug(initialData?.slug ?? '');
    setSoThuTu(initialData?.soThuTu ?? 1);
    setSoTrang(initialData?.soTrang ?? '');
    setBookIndexIdNgoai(initialData?.bookIndexIdNgoai ?? '');
  }, [isOpen, initialData]);

  const handleTenBaiHocChange = (val: string) => {
    setTenBaiHoc(val);
    if (!isEdit && !slug) {
      setSlug(toSlug(val));
    }
  };

  const handleSubmit = async () => {
    if (!tenBaiHoc) return toast.error('Vui lòng nhập tên bài học');
    setLoading(true);
    try {
      const payload = {
        tenBaiHoc,
        tieuDe,
        slug: slug || toSlug(tenBaiHoc),
        soThuTu: soThuTu === '' ? null : Number(soThuTu),
        soTrang: soTrang === '' ? null : Number(soTrang),
        bookIndexIdNgoai: bookIndexIdNgoai === '' ? null : Number(bookIndexIdNgoai),
        chuDeId
      };

      if (isEdit) {
        await adminService.updateBaiHoc(initialData.baiHocId, payload);
        toast.success('Cập nhật Bài Học thành công');
      } else {
        await adminService.createBaiHoc(payload);
        toast.success('Tạo Bài Học thành công');
      }
      onSuccess();
    } catch (err) {
      toast.error(isEdit ? 'Có lỗi khi cập nhật bài học' : 'Có lỗi xảy ra khi tạo bài học');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa Bài Học' : 'Thêm Bài Học Mới'}>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề thuộc về</label>
          <div className="p-2 border rounded bg-slate-100 text-sm text-slate-600 font-medium truncate">
            {tenChuDe || 'Chưa xác định chủ đề'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Tên Bài Học *" value={tenBaiHoc} onChange={e => handleTenBaiHocChange(e.target.value)} placeholder="VD: Bài 1" />
          <Input label="Tiêu Đề (Hiển thị)" value={tieuDe} onChange={e => setTieuDe(e.target.value)} placeholder="VD: Số 0 trong phép cộng" />
        </div>

        <Input label="Đường dẫn (Slug)" value={slug} onChange={e => setSlug(e.target.value)} placeholder="VD: bai-1-so-0" />

        <div className="grid grid-cols-3 gap-4">
          <Input label="Số thứ tự" type="number" value={soThuTu} onChange={e => setSoThuTu(e.target.value)} />
          <Input label="Trang bắt đầu" type="number" value={soTrang} onChange={e => setSoTrang(e.target.value)} />
          <Input label="ID Ngoại (Mục lục)" type="number" value={bookIndexIdNgoai} onChange={e => setBookIndexIdNgoai(e.target.value)} />
        </div>

        {isEdit && (
          <div className="text-xs text-slate-400 flex gap-4 bg-slate-50 p-2 rounded">
            <span>ID: {initialData.baiHocId}</span>
            <span>Tạo lúc: {new Date(initialData.ngayTao).toLocaleString('vi-VN')}</span>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline" className="mr-3">Hủy</Button>
          <Button onClick={handleSubmit} isLoading={loading}>{isEdit ? 'Lưu Bài Học' : 'Thêm Bài Học'}</Button>
        </div>
      </div>
    </Modal>
  );
}
