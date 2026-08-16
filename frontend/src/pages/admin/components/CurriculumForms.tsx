import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/admin.service';
import { useAcademicStore } from '../../../stores/useAcademicStore';

export function CreateSachModal({ isOpen, onClose, onSuccess, monHocList, initialData }: any) {
  const isEdit = !!initialData;
  const [tenSach, setTenSach] = useState('');
  const [boSach, setBoSach] = useState('');
  const [khoiLop, setKhoiLop] = useState(1);
  const [monHocId, setMonHocId] = useState('');
  const [hocKy, setHocKy] = useState(1);
  const [loaiSach, setLoaiSach] = useState<'SACH_GIAO_KHOA' | 'SACH_BAI_TAP'>('SACH_GIAO_KHOA');
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
    setBoSach(initialData?.boSach ?? '');
    setKhoiLop(initialData?.khoiLop ?? 1);
    setMonHocId(initialData?.monHocId ?? '');
    setHocKy(initialData?.hocKyId ?? '');
    setLoaiSach(initialData?.loaiSach ?? 'SACH_GIAO_KHOA');
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!tenSach || !monHocId || !boSach) return toast.error('Vui lòng nhập tên sách, bộ sách và chọn môn học');
    setLoading(true);
    try {
      const selectedMonHoc = monHocList.find((m: any) => String(m.monHocId) === String(monHocId));
      const payload = {
        tenSach, 
        boSach,
        khoiLop: Number(khoiLop), 
        maMon: selectedMonHoc?.maMon, 
        hocKyId: hocKy === '' ? null : Number(hocKy), 
        loaiSach, 
        trangThai: 'ACTIVE',
        namHocId: selectedNamHocId,
      };
      if (isEdit) {
        await adminService.updateSach(initialData.sachId, payload);
        toast.success('Cập nhật Bộ Sách thành công');
      } else {
        await adminService.createSach(payload);
        toast.success('Tạo Bộ Sách thành công');
      }
      onSuccess();
    } catch (err) {
      toast.error(isEdit ? 'Có lỗi khi cập nhật sách' : 'Có lỗi xảy ra khi tạo sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa Bộ Sách' : 'Thêm Bộ Sách Mới'}>
      <div className="p-6 space-y-4">
        <Input label="Tên Cuốn Sách" value={tenSach} onChange={e => setTenSach(e.target.value)} placeholder="VD: Toán 1" />
        <Input label="Bộ Sách" value={boSach} onChange={e => setBoSach(e.target.value)} placeholder="VD: Cánh Diều, Kết nối tri thức..." />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại sách</label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${loaiSach === 'SACH_GIAO_KHOA' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`}
              onClick={() => setLoaiSach('SACH_GIAO_KHOA')}
            >
              Sách giáo khoa
            </button>
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${loaiSach === 'SACH_BAI_TAP' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`}
              onClick={() => setLoaiSach('SACH_BAI_TAP')}
            >
              Sách bài tập
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Khối Lớp</label>
            <select className="w-full border p-2 rounded" value={khoiLop} onChange={e => setKhoiLop(Number(e.target.value))}>
              {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Khối {i + 1}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Môn Học</label>
            <select className="w-full border p-2 rounded" value={monHocId} onChange={e => setMonHocId(e.target.value)}>
              <option value="">-- Chọn Môn --</option>
              {monHocList.map((m: any) => <option key={m.monHocId} value={m.monHocId}>{m.tenMon}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Học Kỳ</label>
            <select className="w-full border p-2 rounded" value={hocKy} onChange={e => setHocKy(e.target.value === '' ? '' : Number(e.target.value))}>
              {hocKyList.map(hk => (
                <option key={hk.hocKyId} value={hk.hocKyId}>Học kỳ {hk.soHocKy}</option>
              ))}
              <option value="">Cả năm (Dùng chung)</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-4"><Button onClick={handleSubmit} isLoading={loading}>{isEdit ? 'Lưu thay đổi' : 'Xác nhận'}</Button></div>
      </div>
    </Modal>
  );
}

export function CreateChuDeModal({ isOpen, onClose, onSuccess, sachId, initialData }: any) {
  const isEdit = !!initialData;
  const [tenChuDe, setTenChuDe] = useState('');
  const [soThuTu, setSoThuTu] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTenChuDe(initialData?.tenChuDe ?? '');
    setSoThuTu(initialData?.soThuTu ?? 1);
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!tenChuDe) return toast.error('Vui lòng nhập tên chương / chủ đề');
    setLoading(true);
    try {
      if (isEdit) {
        await adminService.updateChuDe(initialData.chuDeId, { tenChuDe, soThuTu: Number(soThuTu), sachId });
        toast.success('Cập nhật Chương thành công');
      } else {
        await adminService.createChuDe({ tenChuDe, soThuTu: Number(soThuTu), sachId });
        toast.success('Tạo Chương thành công');
      }
      onSuccess();
    } catch (err) {
      toast.error(isEdit ? 'Có lỗi khi cập nhật chương' : 'Có lỗi xảy ra khi tạo chương');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa Chương / Chủ Đề' : 'Thêm Chương / Chủ Đề'}>
      <div className="p-6 space-y-4">
        <Input label="Tên Chương" value={tenChuDe} onChange={e => setTenChuDe(e.target.value)} placeholder="VD: Chương 1: Ôn tập" />
        <Input label="Số thứ tự" type="number" value={soThuTu} onChange={e => setSoThuTu(Number(e.target.value))} />
        <div className="flex justify-end pt-4"><Button onClick={handleSubmit} isLoading={loading}>{isEdit ? 'Lưu thay đổi' : 'Xác nhận'}</Button></div>
      </div>
    </Modal>
  );
}

export function CreateBaiHocModal({ isOpen, onClose, onSuccess, chuDeId, initialData }: any) {
  const isEdit = !!initialData;
  const [tenBaiHoc, setTenBaiHoc] = useState('');
  const [soThuTu, setSoThuTu] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTenBaiHoc(initialData?.tenBaiHoc ?? '');
    setSoThuTu(initialData?.soThuTu ?? 1);
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!tenBaiHoc) return toast.error('Vui lòng nhập tên bài học');
    setLoading(true);
    try {
      if (isEdit) {
        await adminService.updateBaiHoc(initialData.baiHocId, { tenBaiHoc, soThuTu: Number(soThuTu), chuDeId });
        toast.success('Cập nhật Bài Học thành công');
      } else {
        await adminService.createBaiHoc({ tenBaiHoc, soThuTu: Number(soThuTu), chuDeId });
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa Bài Học' : 'Thêm Bài Học'}>
      <div className="p-6 space-y-4">
        <Input label="Tên Bài Học" value={tenBaiHoc} onChange={e => setTenBaiHoc(e.target.value)} placeholder="VD: Bài 1: Phép cộng" />
        <Input label="Số thứ tự" type="number" value={soThuTu} onChange={e => setSoThuTu(Number(e.target.value))} />
        <div className="flex justify-end pt-4"><Button onClick={handleSubmit} isLoading={loading}>{isEdit ? 'Lưu thay đổi' : 'Xác nhận'}</Button></div>
      </div>
    </Modal>
  );
}
