import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Trash2, Save, X, FileText, LayoutTemplate, Settings, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/admin.service';

import { RichTextEditor } from '../../../components/ui/RichTextEditor';

interface GameAuthoringFormProps {
  dangBaiId: number; // 0 if new
  baiHocId: number;
  onSaveSuccess: () => void;
  onCancel: () => void;
  onPreviewUpdate?: (payload: any) => void;
}

type LoaiGame = 'LY_THUYET' | 'TU_LUAN' | 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET';
type GiaoDien = 'MAC_DINH' | 'DAO_VANG' | 'DUOI_BAT' | 'PHAN_LOAI' | 'THU_HOACH_NONG_SAN' | 'ECH_QUA_SONG' | 'BAN_BONG_BAY' | 'TRIEU_PHU' | 'ONG_TIM_MAT';

let uidCounter = 0;
const uid = () => `id${Date.now()}_${uidCounter++}`;

export default function GameAuthoringForm({ dangBaiId, baiHocId, onSaveSuccess, onCancel, onPreviewUpdate }: GameAuthoringFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);

  // === KHUNG THÔNG TIN CHUNG ===
  const [title, setTitle] = useState('');
  const [soThuTu, setSoThuTu] = useState<number>(0);
  const [soTrang, setSoTrang] = useState<number>(1);
  const [loai, setLoai] = useState<LoaiGame>('TRAC_NGHIEM');
  const [giaoDien, setGiaoDien] = useState('MAC_DINH');
  const [internalBaiHocId, setInternalBaiHocId] = useState(baiHocId);
  const [xp, setXp] = useState<number>(10);
  const [loaiNoiDung, setLoaiNoiDung] = useState('JSON_TEXT');
  const [nguonGoc, setNguonGoc] = useState('HE_THONG');
  const [giaoVienId, setGiaoVienId] = useState<number | ''>('');
  const [h5pNoiDungId, setH5pNoiDungId] = useState('');
  
  // Loại Game/Form chi tiết

  // === TRƯỜNG MEDIA CHUNG ===
  const [cauHoi, setCauHoi] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [amThanh, setAmThanh] = useState('');
  const [video, setVideo] = useState('');

  // === STATE CHO TRẮC NGHIỆM ===
  const [thanhPhanCauHoi, setThanhPhanCauHoi] = useState<{id: string; noiDung: string; hinhAnh?: string; amThanh?: string}[]>([]);
  const [luaChon, setLuaChon] = useState<{id: string; noiDung: string; hinhAnh?: string; amThanh?: string}[]>([
    { id: uid(), noiDung: '' },
    { id: uid(), noiDung: '' }
  ]);
  const [dapAnDungId, setDapAnDungId] = useState('');

  // === STATE CHO NỐI CẶP ===
  const [cotTrai, setCotTrai] = useState<{id: string; noiDung: string; hinhAnh?: string; amThanh?: string}[]>([{ id: uid(), noiDung: '' }]);
  const [cotPhai, setCotPhai] = useState<{id: string; noiDung: string; hinhAnh?: string; amThanh?: string}[]>([{ id: uid(), noiDung: '' }]);
  const [capDung, setCapDung] = useState<{traiId: string; phaiId: string}[]>([]);

  // === STATE CHO ĐIỀN KHUYẾT ===
  const [thanhPhanDoanVan, setThanhPhanDoanVan] = useState<{id: string; noiDung: string; hinhAnh?: string; amThanh?: string}[]>([]);
  const [danhSachCho, setDanhSachCho] = useState<{
    id: string; 
    vanBanTruoc: string; 
    vanBanTruocHinhAnh?: string;
    vanBanTruocAmThanh?: string;
    vanBanSau: string; 
    vanBanSauHinhAnh?: string;
    vanBanSauAmThanh?: string;
    dapAn: string; 
    dapAnHinhAnh?: string;
    dapAnAmThanh?: string;
    danhSachLuaChonMoi?: {id: string; text: string; hinhAnh: string; amThanh: string}[];
  }>([
    { id: uid(), vanBanTruoc: 'Hôm nay là', vanBanSau: 'rất đẹp.', dapAn: 'một ngày', danhSachLuaChonMoi: [{id: uid(), text: 'một ngày', hinhAnh: '', amThanh: ''}] }
  ]);

  useEffect(() => {
    // Load dropdown teachers
    adminService.searchUsers({ role: 'GIAO_VIEN', size: 100 })
      .then(res => setTeachers(res.content || []))
      .catch(err => console.error(err));

    if (dangBaiId > 0) {
      adminService.getDangBaiDetail(dangBaiId).then(dangBai => {
        setTitle(dangBai.tenDangBai || '');
        if (dangBai.baiHocId) setInternalBaiHocId(dangBai.baiHocId);
        setXp(dangBai.xpThuong || 10);
        setSoThuTu(dangBai.soThuTu || 0);
        setSoTrang(dangBai.soTrang || 1);
        setLoaiNoiDung(dangBai.loaiNoiDung || 'JSON_TEXT');
        setNguonGoc(dangBai.nguonGoc || 'HE_THONG');
        setGiaoVienId(dangBai.giaoVien?.giaoVienId || '');
        setH5pNoiDungId(dangBai.h5pNoiDungId || '');

        let parsed: any = {};
        try { parsed = JSON.parse(dangBai.duLieuGame); } catch(e) {}
        let ans: any = {};
        try { ans = JSON.parse(dangBai.dapAnChuan); } catch(e) {}
        
        const type = parsed.loai || 'LY_THUYET';
        if (type === 'PHAN_LOAI') {
          setLoai('NOI_CAP');
          setGiaoDien('PHAN_LOAI');
          if (parsed.danhSachThung && parsed.danhSachVatPham) {
            setCotTrai(parsed.danhSachThung.map((t: any) => ({ id: t.id, noiDung: t.ten })));
            setCotPhai(parsed.danhSachVatPham.map((v: any) => ({ id: v.id, noiDung: v.noiDung || v.ten })));
            if (ans.phanLoaiDung) {
              setCapDung(ans.phanLoaiDung.map((p: any) => ({ traiId: p.thungId, phaiId: p.itemId })));
            }
          }
        } else {
          setLoai(type as LoaiGame);
          setGiaoDien(parsed.giaoDien || 'MAC_DINH');
        }

        setCauHoi(parsed.cauHoi || '');
        setNoiDung(parsed.noiDung || '');
        setHinhAnh(parsed.hinhAnh || '');
        setAmThanh(parsed.amThanh || '');
        setVideo(parsed.video || '');

        if (type === 'TRAC_NGHIEM') {
          setThanhPhanCauHoi(parsed.thanhPhanCauHoi || []);
          setLuaChon(parsed.luaChon || parsed.danhSachLuaChon || [{ id: uid(), noiDung: '' }]);
          setDapAnDungId(ans.dapAnDungId || '');
        } else if (type === 'NOI_CAP') {
          setCotTrai(parsed.cotTrai || []);
          setCotPhai(parsed.cotPhai || []);
          setCapDung(ans.capDung || ans.danhSachCapDung || []);
        } else if (type === 'DIEN_KHUYET') {
          setThanhPhanDoanVan(parsed.thanhPhanDoanVan || []);
          const places = parsed.danhSachCho || [];
          const answers = ans.dapAnChoTrong || [];
          const mergedCho = places.map((p: any) => {
            const mapped = answers.find((m: any) => m.id === p.id);
            const danhSachLuaChonMoi = (p.danhSachLuaChonMoi && p.danhSachLuaChonMoi.length > 0)
              ? p.danhSachLuaChonMoi.map((s: any) => ({ 
                  id: s.id || uid(), 
                  text: s.noiDung || s.text || '', 
                  hinhAnh: s.hinhAnh || '', 
                  amThanh: s.amThanh || '' 
                }))
              : (Array.isArray(p.danhSachLuaChon) 
                  ? p.danhSachLuaChon.map((s: any) => typeof s === 'string' 
                      ? { id: uid(), text: s, hinhAnh: '', amThanh: '' } 
                      : { id: s.id || uid(), text: s.noiDung || s.text || '', hinhAnh: s.hinhAnh || '', amThanh: s.amThanh || '' })
                  : [{ id: uid(), text: '', hinhAnh: '', amThanh: '' }]);

            return { 
              id: p.id, 
              vanBanTruoc: p.vanBanTruoc, 
              vanBanTruocHinhAnh: p.vanBanTruocHinhAnh,
              vanBanTruocAmThanh: p.vanBanTruocAmThanh,
              vanBanSau: p.vanBanSau, 
              vanBanSauHinhAnh: p.vanBanSauHinhAnh,
              vanBanSauAmThanh: p.vanBanSauAmThanh,
              danhSachLuaChonMoi: danhSachLuaChonMoi,
              dapAn: mapped ? mapped.dapAn : '',
              dapAnHinhAnh: mapped ? mapped.dapAnHinhAnh : '',
              dapAnAmThanh: mapped ? mapped.dapAnAmThanh : ''
            };
          });
          setDanhSachCho(mergedCho);
        }
      }).catch(err => {
        console.error(err);
        toast.error('Không thể tải dữ liệu Dạng Bài');
      });
    }
  }, [dangBaiId]);

  const handleTypeChange = (newLoai: LoaiGame) => {
    if (dangBaiId > 0 && newLoai !== loai) {
      if (!window.confirm('Thay đổi Loại Game sẽ xoá dữ liệu chi tiết hiện tại. Chắc chắn không?')) return;
    }
    setLoai(newLoai);
    setGiaoDien('MAC_DINH');
  };

  const buildPayload = () => {
    let duLieuGame: any = { loai, giaoDien, cauHoi, noiDung, hinhAnh, amThanh, video };
    let dapAnChuan: any = {};

    if (loai === 'TRAC_NGHIEM') {
      duLieuGame.thanhPhanCauHoi = thanhPhanCauHoi;
      duLieuGame.danhSachLuaChon = luaChon;
      duLieuGame.dapAnDungId = dapAnDungId;
      dapAnChuan = { dapAnDungId };
    } else if (loai === 'NOI_CAP') {
      duLieuGame.cotTrai = cotTrai;
      duLieuGame.cotPhai = cotPhai;
      duLieuGame.capDung = capDung;
      dapAnChuan = { danhSachCapDung: capDung };
    } else if (loai === 'DIEN_KHUYET') {
      duLieuGame.thanhPhanDoanVan = thanhPhanDoanVan;
      duLieuGame.danhSachCho = danhSachCho.map(c => ({
        id: c.id, 
        vanBanTruoc: c.vanBanTruoc, 
        vanBanTruocHinhAnh: c.vanBanTruocHinhAnh,
        vanBanTruocAmThanh: c.vanBanTruocAmThanh,
        vanBanSau: c.vanBanSau,
        vanBanSauHinhAnh: c.vanBanSauHinhAnh,
        vanBanSauAmThanh: c.vanBanSauAmThanh,
        danhSachLuaChonMoi: c.danhSachLuaChonMoi,
        danhSachLuaChon: c.danhSachLuaChonMoi ? c.danhSachLuaChonMoi.map(x => x.text) : []
      }));
      const dapAnTheoCho: Record<string, string> = {};
      danhSachCho.forEach(c => {
        if (c.dapAn) {
          dapAnTheoCho[c.id] = c.dapAn;
        }
      });
      dapAnChuan = {
        dapAnTheoCho,
        dapAnChoTrong: danhSachCho.map(c => ({
          id: c.id,
          dapAn: c.dapAn,
          dapAnHinhAnh: c.dapAnHinhAnh,
          dapAnAmThanh: c.dapAnAmThanh
        }))
      };
      duLieuGame.dapAnTheoCho = dapAnChuan.dapAnTheoCho;
      duLieuGame.dapAnChoTrong = dapAnChuan.dapAnChoTrong;
    }

    return {
      tenDangBai: title,
      baiHocId: internalBaiHocId,
      giaoVienId: giaoVienId ? Number(giaoVienId) : null,
      loaiNoiDung,
      nguonGoc,
      soThuTu,
      soTrang,
      xpThuong: xp,
      h5pNoiDungId,
      duLieuGame: JSON.stringify(duLieuGame),
      dapAnChuan: JSON.stringify(dapAnChuan)
    };
  };

  useEffect(() => {
    if (onPreviewUpdate) {
      const handler = setTimeout(() => {
        onPreviewUpdate(buildPayload());
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [
    title, loai, giaoDien, cauHoi, noiDung, hinhAnh, amThanh, video,
    thanhPhanCauHoi, luaChon, dapAnDungId,
    cotTrai, cotPhai, capDung,
    thanhPhanDoanVan, danhSachCho,
    xp, nguonGoc, loaiNoiDung
  ]);

  const handleSave = async () => {
    if (!title) return toast.error('Vui lòng nhập Tên dạng bài');
    
    const payload = buildPayload();
    setIsSaving(true);
    try {
      if (dangBaiId === 0) {
        await adminService.createDangBai(payload);
      } else {
        await adminService.updateDangBai(dangBaiId, payload);
      }
      toast.success('Lưu dữ liệu thành công!');
      onSaveSuccess();
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-transparent space-y-6 pb-20">
      {/* Header Float */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {dangBaiId === 0 ? 'Thêm mới Bài tập' : 'Chỉnh sửa Bài tập'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Thiết lập cấu trúc và nội dung chi tiết cho bài học.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel} className="px-5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
            Hủy bỏ
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md shadow-slate-200">
            {isSaving ? 'Đang lưu...' : (
              <>
                <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* 1. KHUNG THÔNG TIN CHUNG */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-100">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Cấu hình Cơ bản</h2>
            <p className="text-sm text-slate-500 mt-0.5">Các thông số cốt lõi của bài tập.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-8">
            <label className="block text-sm font-bold text-slate-900 mb-2">Tên Dạng Bài</label>
            <Input className="h-12 text-base font-semibold bg-slate-50/50 border-slate-200 focus:bg-white" placeholder="VD: Ôn tập Từ vựng" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="col-span-4">
            <label className="block text-sm font-bold text-slate-900 mb-2">ID Bài học</label>
            <Input className="h-12 bg-slate-100 text-slate-500 font-mono border-slate-200" value={baiHocId} disabled />
          </div>

          <div className="col-span-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">Loại Game / Dạng Bài</label>
            <select className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-slate-200 outline-none transition-all cursor-pointer hover:bg-slate-100" value={loai} onChange={e => handleTypeChange(e.target.value as LoaiGame)}>
              <option value="LY_THUYET">Lý Thuyết</option>
              <option value="TU_LUAN">Tự Luận</option>
              <option value="TRAC_NGHIEM">Trắc Nghiệm</option>
              <option value="NOI_CAP">Nối Cặp</option>
              <option value="DIEN_KHUYET">Điền Khuyết</option>
            </select>
          </div>
          <div className="col-span-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">Nguồn gốc</label>
            <select className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all cursor-pointer hover:bg-slate-100" value={nguonGoc} onChange={e => setNguonGoc(e.target.value)}>
              <option value="HE_THONG">Hệ Thống</option>
              <option value="GIAO_VIEN">Giáo Viên Tự Soạn</option>
            </select>
          </div>
          <div className="col-span-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">XP Thưởng</label>
            <Input className="h-11 bg-slate-50 text-slate-700 font-semibold border-slate-200 focus:bg-white" type="number" value={xp} onChange={e => setXp(Number(e.target.value))} />
          </div>
        </div>
      </section>

      {/* 2. KHỐI THÔNG TIN NỀN */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Nội dung Đề bài & Hướng dẫn</h2>
            <p className="text-sm text-slate-500 mt-0.5">Yêu cầu, bài đọc, và các tệp đính kèm.</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {(loai === 'TRAC_NGHIEM' || loai === 'NOI_CAP' || loai === 'DIEN_KHUYET' || loai === 'LY_THUYET' || loai === 'TU_LUAN') && (
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Giao diện hiển thị (Template)</label>
              <select className="w-full md:w-1/3 h-12 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-slate-200 outline-none cursor-pointer hover:bg-slate-100" value={giaoDien} onChange={e => setGiaoDien(e.target.value as GiaoDien)}>
                {loai === 'LY_THUYET' || loai === 'TU_LUAN' ? (
                  <option value="MAC_DINH">Bố cục Mặc định</option>
                ) : loai === 'TRAC_NGHIEM' ? (
                  <>
                    <option value="MAC_DINH">Trắc nghiệm chuẩn</option>
                    <option value="DAO_VANG">Đào Vàng</option>
                    <option value="DUOI_BAT">Đuổi Bắt</option>
                    <option value="THU_HOACH_NONG_SAN">Thu hoạch Nông sản</option>
                    <option value="ECH_QUA_SONG">Ếch qua sông</option>
                    <option value="BAN_BONG_BAY">Bắn bóng bay</option>
                    <option value="TRIEU_PHU">Ai là triệu phú</option>
                  </>
                ) : loai === 'NOI_CAP' ? (
                  <>
                    <option value="MAC_DINH">Nối cặp (Kéo dây)</option>
                    <option value="PHAN_LOAI">Phân loại (Thùng rác)</option>
                  </>
                ) : loai === 'DIEN_KHUYET' ? (
                  <>
                    <option value="MAC_DINH">Nhập liệu chuẩn</option>
                    <option value="ONG_TIM_MAT">Game Ong Tìm Mật</option>
                  </>
                ) : null}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Yêu cầu đề bài (cauHoi)</label>
            <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-200">
              <RichTextEditor value={cauHoi} onChange={setCauHoi} placeholder="Nhập yêu cầu đề bài..." minHeight="120px" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-3">Giải thích / Hướng dẫn giải (Tùy chọn)</label>
            <div className="border border-slate-200 rounded-2xl overflow-hidden opacity-70 hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <RichTextEditor value={noiDung} onChange={setNoiDung} placeholder="Nhập văn bản bài giảng, hướng dẫn giải..." minHeight="80px" />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <label className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              Tệp đính kèm Tổng (Tùy chọn)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hình ảnh (URL)</label>
                <Input className="h-10 bg-white border-slate-200" value={hinhAnh} onChange={e => setHinhAnh(e.target.value)} placeholder="https://" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Âm thanh (URL)</label>
                <Input className="h-10 bg-white border-slate-200" value={amThanh} onChange={e => setAmThanh(e.target.value)} placeholder="https://" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Video (URL)</label>
                <Input className="h-10 bg-white border-slate-200" value={video} onChange={e => setVideo(e.target.value)} placeholder="https://" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHI TIẾT FORM */}
      {(loai === 'TRAC_NGHIEM' || loai === 'NOI_CAP' || loai === 'DIEN_KHUYET') && (
        <section className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-100">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Chi tiết phần: {loai === 'TRAC_NGHIEM' ? 'Trắc Nghiệm' : loai === 'NOI_CAP' ? 'Nối Cặp' : 'Điền Khuyết'}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">Thiết lập câu trả lời và logic chấm điểm.</p>
            </div>
          </div>

          {/* --- FORM 3: TRẮC NGHIỆM --- */}
          {loai === 'TRAC_NGHIEM' && (
            <div className="space-y-10">
              {/* Câu hỏi phụ */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-4">Thành phần Câu hỏi phụ (Tùy chọn)</label>
                <div className="space-y-4">
                  {thanhPhanCauHoi.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Văn bản</label>
                        <Input className="h-11 bg-white border-slate-200" placeholder="Nhập chữ..." value={item.noiDung} onChange={e => {
                          const nw = [...thanhPhanCauHoi]; nw[idx].noiDung = e.target.value; setThanhPhanCauHoi(nw);
                        }} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</label>
                        <Input className="h-11 bg-white border-slate-200" placeholder="Link hình (URL)" value={item.hinhAnh || ''} onChange={e => {
                          const nw = [...thanhPhanCauHoi]; nw[idx].hinhAnh = e.target.value; setThanhPhanCauHoi(nw);
                        }} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Âm thanh</label>
                        <Input className="h-11 bg-white border-slate-200" placeholder="Link âm thanh (URL)" value={item.amThanh || ''} onChange={e => {
                          const nw = [...thanhPhanCauHoi]; nw[idx].amThanh = e.target.value; setThanhPhanCauHoi(nw);
                        }} />
                      </div>
                      <button onClick={() => setThanhPhanCauHoi(thanhPhanCauHoi.filter(x => x.id !== item.id))} className="mt-6 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-5 rounded-xl px-5 text-slate-600 border-slate-200 font-medium hover:bg-slate-50" onClick={() => setThanhPhanCauHoi([...thanhPhanCauHoi, {id: uid(), noiDung: ''}])}>
                  + Thêm đoạn câu hỏi
                </Button>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* Lựa chọn & Đáp án */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-5">Danh sách Lựa chọn & Đáp án đúng</label>
                <div className="space-y-5">
                  {luaChon.map((lc, idx) => {
                    const isCorrect = dapAnDungId === lc.id;
                    return (
                      <div key={lc.id} className={`flex gap-5 p-6 rounded-2xl border-2 transition-all duration-300 ${isCorrect ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <div className="pt-3">
                          <input type="radio" name="tn_ans" className="w-6 h-6 cursor-pointer accent-emerald-600 transition-all" checked={isCorrect} onChange={() => setDapAnDungId(lc.id)} />
                        </div>
                        <div className="flex-1 space-y-4">
                          <Input className={`h-12 text-base ${isCorrect ? 'border-emerald-200 focus:border-emerald-500 bg-white font-bold' : 'border-slate-200 bg-slate-50 focus:bg-white'}`} placeholder={`Nhập nội dung Lựa chọn ${idx + 1}...`} value={lc.noiDung} onChange={e => {
                            const nw = [...luaChon]; nw[idx].noiDung = e.target.value; setLuaChon(nw);
                          }} />
                          <div className="flex gap-4">
                            <Input className="flex-1 h-10 text-sm bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link Hình ảnh (Tùy chọn)" value={lc.hinhAnh || ''} onChange={e => {
                              const nw = [...luaChon]; nw[idx].hinhAnh = e.target.value; setLuaChon(nw);
                            }} />
                            <Input className="flex-1 h-10 text-sm bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link Âm thanh (Tùy chọn)" value={lc.amThanh || ''} onChange={e => {
                              const nw = [...luaChon]; nw[idx].amThanh = e.target.value; setLuaChon(nw);
                            }} />
                          </div>
                        </div>
                        <button onClick={() => {
                          setLuaChon(luaChon.filter(x => x.id !== lc.id));
                          if(dapAnDungId === lc.id) setDapAnDungId('');
                        }} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors h-fit self-center">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" className="mt-6 rounded-xl px-6 text-slate-700 font-bold border-slate-200 hover:bg-slate-50" onClick={() => setLuaChon([...luaChon, { id: uid(), noiDung: '' }])}>
                  <Plus className="w-4 h-4 mr-2" /> Thêm lựa chọn
                </Button>
              </div>
            </div>
          )}

          {/* --- FORM 4: NỐI CẶP --- */}
          {loai === 'NOI_CAP' && (
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                {/* Cột trái */}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-3 mb-4">Thẻ Cột Trái</h4>
                  <div className="space-y-4">
                    {cotTrai.map((item, idx) => (
                      <div key={item.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-3 relative group">
                        <Input className="h-11 bg-white border-slate-200" placeholder="Nội dung thẻ..." value={item.noiDung} onChange={e => {
                          const nw = [...cotTrai]; nw[idx].noiDung = e.target.value; setCotTrai(nw);
                        }} />
                        <div className="flex gap-3">
                          <Input className="flex-1 h-10 text-sm bg-white border-slate-200" placeholder="Hình ảnh (URL)" value={item.hinhAnh || ''} onChange={e => {
                              const nw = [...cotTrai]; nw[idx].hinhAnh = e.target.value; setCotTrai(nw);
                          }} />
                          <Input className="flex-1 h-10 text-sm bg-white border-slate-200" placeholder="Âm thanh (URL)" value={item.amThanh || ''} onChange={e => {
                              const nw = [...cotTrai]; nw[idx].amThanh = e.target.value; setCotTrai(nw);
                          }} />
                        </div>
                        <button onClick={() => setCotTrai(cotTrai.filter(c => c.id !== item.id))} className="absolute -top-3 -right-3 p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 shadow-sm transition-all">
                          <X className="w-4 h-4"/>
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-5 w-full rounded-xl border-dashed border-slate-300 text-slate-500 hover:bg-slate-50" onClick={() => setCotTrai([...cotTrai, { id: uid(), noiDung: '' }])}>
                    + Thêm thẻ Trái
                  </Button>
                </div>
                
                {/* Cột phải */}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-3 mb-4">Thẻ Cột Phải</h4>
                  <div className="space-y-4">
                    {cotPhai.map((item, idx) => (
                      <div key={item.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-3 relative group">
                        <Input className="h-11 bg-white border-slate-200" placeholder="Nội dung thẻ..." value={item.noiDung} onChange={e => {
                          const nw = [...cotPhai]; nw[idx].noiDung = e.target.value; setCotPhai(nw);
                        }} />
                        <div className="flex gap-3">
                          <Input className="flex-1 h-10 text-sm bg-white border-slate-200" placeholder="Hình ảnh (URL)" value={item.hinhAnh || ''} onChange={e => {
                              const nw = [...cotPhai]; nw[idx].hinhAnh = e.target.value; setCotPhai(nw);
                          }} />
                          <Input className="flex-1 h-10 text-sm bg-white border-slate-200" placeholder="Âm thanh (URL)" value={item.amThanh || ''} onChange={e => {
                              const nw = [...cotPhai]; nw[idx].amThanh = e.target.value; setCotPhai(nw);
                          }} />
                        </div>
                        <button onClick={() => setCotPhai(cotPhai.filter(c => c.id !== item.id))} className="absolute -top-3 -right-3 p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 shadow-sm transition-all">
                          <X className="w-4 h-4"/>
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-5 w-full rounded-xl border-dashed border-slate-300 text-slate-500 hover:bg-slate-50" onClick={() => setCotPhai([...cotPhai, { id: uid(), noiDung: '' }])}>
                    + Thêm thẻ Phải
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60">
                <h4 className="font-bold text-sm text-slate-900 mb-5">Thiết lập Cặp Đúng (Logic chấm điểm)</h4>
                <div className="space-y-4">
                  {capDung.map((cap, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-white p-2 pl-4 rounded-xl border border-slate-200 shadow-sm">
                      <select className="flex-1 h-10 border-none bg-transparent font-medium text-slate-700 outline-none cursor-pointer" value={cap.traiId} onChange={e => {
                        const nw = [...capDung]; nw[idx].traiId = e.target.value; setCapDung(nw);
                      }}>
                        <option value="">-- Chọn thẻ trái --</option>
                        {cotTrai.map(c => <option key={c.id} value={c.id}>{c.noiDung || 'Thẻ ảnh/âm thanh'}</option>)}
                      </select>
                      
                      <div className="flex flex-col items-center px-4">
                        <div className="w-16 h-px bg-slate-300"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">NỐI VỚI</span>
                      </div>

                      <select className="flex-1 h-10 border-none bg-transparent font-medium text-slate-700 outline-none cursor-pointer" value={cap.phaiId} onChange={e => {
                        const nw = [...capDung]; nw[idx].phaiId = e.target.value; setCapDung(nw);
                      }}>
                        <option value="">-- Chọn thẻ phải --</option>
                        {cotPhai.map(c => <option key={c.id} value={c.id}>{c.noiDung || 'Thẻ ảnh/âm thanh'}</option>)}
                      </select>
                      
                      <button onClick={() => setCapDung(capDung.filter((_, i) => i !== idx))} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border-l border-slate-100 ml-2">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-5 rounded-xl px-5 text-slate-700 font-bold border-slate-200 hover:bg-slate-100 bg-white" onClick={() => setCapDung([...capDung, { traiId: '', phaiId: '' }])}>
                  <Plus className="w-4 h-4 mr-2" /> Thêm cặp nối
                </Button>
              </div>
            </div>
          )}

          {/* --- FORM 5: ĐIỀN KHUYẾT --- */}
          {loai === 'DIEN_KHUYET' && (
            <div className="space-y-12">
              {/* Khung văn bản chính */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-4">Đoạn văn bản bao quanh (Tùy chọn)</label>
                <div className="space-y-4">
                  {thanhPhanDoanVan.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Văn bản</label>
                        <Input className="h-11 bg-white border-slate-200" placeholder="Nhập chữ..." value={item.noiDung} onChange={e => {
                          const nw = [...thanhPhanDoanVan]; nw[idx].noiDung = e.target.value; setThanhPhanDoanVan(nw);
                        }} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</label>
                        <Input className="h-11 bg-white border-slate-200" placeholder="Link hình (URL)" value={item.hinhAnh || ''} onChange={e => {
                          const nw = [...thanhPhanDoanVan]; nw[idx].hinhAnh = e.target.value; setThanhPhanDoanVan(nw);
                        }} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Âm thanh</label>
                        <Input className="h-11 bg-white border-slate-200" placeholder="Link âm thanh (URL)" value={item.amThanh || ''} onChange={e => {
                          const nw = [...thanhPhanDoanVan]; nw[idx].amThanh = e.target.value; setThanhPhanDoanVan(nw);
                        }} />
                      </div>
                      <button onClick={() => setThanhPhanDoanVan(thanhPhanDoanVan.filter(x => x.id !== item.id))} className="mt-6 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-5 rounded-xl px-5 text-slate-600 border-slate-200 font-medium hover:bg-slate-50" onClick={() => setThanhPhanDoanVan([...thanhPhanDoanVan, {id: uid(), noiDung: ''}])}>
                  + Thêm đoạn
                </Button>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* Thiết lập chỗ trống */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-6">Thiết lập Chỗ trống (Blank Spaces)</label>
                <div className="space-y-8">
                  {danhSachCho.map((cho, idx) => (
                    <div key={cho.id} className="bg-white p-7 rounded-3xl border-2 border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 transition-colors group-hover:bg-slate-300"></div>
                      
                      <div className="flex justify-between items-center mb-6 pl-2">
                        <span className="text-lg font-black text-slate-800 tracking-tight">Chỗ trống #{idx + 1}</span>
                        <button onClick={() => setDanhSachCho(danhSachCho.filter(x => x.id !== cho.id))} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4"/> Xóa
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mb-8 pl-2">
                        <div className="flex flex-col space-y-3">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Văn bản trước</label>
                          <div className="space-y-3">
                            <Input className="h-11 bg-slate-50 border-slate-200 focus:bg-white" placeholder="Nhập chữ..." value={cho.vanBanTruoc} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].vanBanTruoc = e.target.value; setDanhSachCho(nw);
                            }} />
                            <Input className="h-10 text-sm bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link hình (URL)" value={cho.vanBanTruocHinhAnh || ''} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].vanBanTruocHinhAnh = e.target.value; setDanhSachCho(nw);
                            }} />
                            <Input className="h-10 text-sm bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link âm (URL)" value={cho.vanBanTruocAmThanh || ''} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].vanBanTruocAmThanh = e.target.value; setDanhSachCho(nw);
                            }} />
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-3 p-5 bg-slate-900 rounded-2xl relative shadow-lg shadow-slate-900/10">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">ĐÁP ÁN ĐÚNG</label>
                          <div className="space-y-3 mt-1">
                            <Input className="h-12 border-slate-700 bg-slate-800 text-white font-black text-lg placeholder-slate-600 focus:border-slate-500 focus:ring-slate-500" placeholder="Nhập chữ..." value={cho.dapAn} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].dapAn = e.target.value; setDanhSachCho(nw);
                            }} />
                            <Input className="h-10 text-sm border-slate-700 bg-slate-800 text-slate-300 placeholder-slate-600 focus:border-slate-500" placeholder="Link hình (URL)" value={cho.dapAnHinhAnh || ''} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].dapAnHinhAnh = e.target.value; setDanhSachCho(nw);
                            }} />
                            <Input className="h-10 text-sm border-slate-700 bg-slate-800 text-slate-300 placeholder-slate-600 focus:border-slate-500" placeholder="Link âm (URL)" value={cho.dapAnAmThanh || ''} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].dapAnAmThanh = e.target.value; setDanhSachCho(nw);
                            }} />
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Văn bản sau</label>
                          <div className="space-y-3">
                            <Input className="h-11 bg-slate-50 border-slate-200 focus:bg-white" placeholder="Nhập chữ..." value={cho.vanBanSau} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].vanBanSau = e.target.value; setDanhSachCho(nw);
                            }} />
                            <Input className="h-10 text-sm bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link hình (URL)" value={cho.vanBanSauHinhAnh || ''} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].vanBanSauHinhAnh = e.target.value; setDanhSachCho(nw);
                            }} />
                            <Input className="h-10 text-sm bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link âm (URL)" value={cho.vanBanSauAmThanh || ''} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].vanBanSauAmThanh = e.target.value; setDanhSachCho(nw);
                            }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-100 pl-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Mồi nhử (Trắc nghiệm sai)</label>
                        <div className="space-y-3 mb-5">
                          {(cho.danhSachLuaChonMoi || []).map((luachon, lIdx) => (
                            <div key={luachon.id} className="flex gap-4 items-center">
                              <Input className="flex-1 h-11 bg-slate-50 border-slate-200 focus:bg-white" placeholder="Nhập chữ..." value={luachon.text} onChange={e => {
                                const nw = [...danhSachCho]; nw[idx].danhSachLuaChonMoi![lIdx].text = e.target.value; setDanhSachCho(nw);
                              }} />
                              <Input className="flex-1 h-11 bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link hình (URL)" value={luachon.hinhAnh} onChange={e => {
                                const nw = [...danhSachCho]; nw[idx].danhSachLuaChonMoi![lIdx].hinhAnh = e.target.value; setDanhSachCho(nw);
                              }} />
                              <Input className="flex-1 h-11 bg-slate-50 border-slate-200 focus:bg-white" placeholder="Link âm (URL)" value={luachon.amThanh} onChange={e => {
                                const nw = [...danhSachCho]; nw[idx].danhSachLuaChonMoi![lIdx].amThanh = e.target.value; setDanhSachCho(nw);
                              }} />
                              <button onClick={() => {
                                const nw = [...danhSachCho]; nw[idx].danhSachLuaChonMoi = nw[idx].danhSachLuaChonMoi!.filter(x => x.id !== luachon.id); setDanhSachCho(nw);
                              }} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 className="w-5 h-5"/>
                              </button>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="rounded-xl px-5 text-slate-600 font-medium border-slate-200 hover:bg-slate-50" onClick={() => {
                          const nw = [...danhSachCho]; 
                          nw[idx].danhSachLuaChonMoi = [...(nw[idx].danhSachLuaChonMoi || []), { id: uid(), text: '', hinhAnh: '', amThanh: '' }]; 
                          setDanhSachCho(nw);
                        }}>
                          <Plus className="w-4 h-4 mr-2" /> Thêm mồi nhử
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-8 rounded-xl px-6 text-slate-800 font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 h-12" onClick={() => setDanhSachCho([...danhSachCho, { id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '' }])}>
                  <Plus className="w-5 h-5 mr-2" /> Thêm Chỗ trống mới
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
