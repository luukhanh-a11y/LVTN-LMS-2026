import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Trash2, Save, X } from 'lucide-react';
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
  const [xp, setXp] = useState<number>(10);
  const [loaiNoiDung, setLoaiNoiDung] = useState('JSON_TEXT');
  const [nguonGoc, setNguonGoc] = useState('HE_THONG');
  const [giaoVienId, setGiaoVienId] = useState<number | ''>('');
  const [h5pNoiDungId, setH5pNoiDungId] = useState('');
  
  const [loai, setLoai] = useState<LoaiGame>('LY_THUYET'); // Loại Game/Form chi tiết
  const [giaoDien, setGiaoDien] = useState<GiaoDien>('MAC_DINH');

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
  // === STATE CHO ĐIỀN KHUYẾT ===
  const [danhSachCho, setDanhSachCho] = useState<{id: string; vanBanTruoc: string; vanBanSau: string; dapAn: string; danhSachLuaChon?: string}[]>([
    { id: uid(), vanBanTruoc: 'Hôm nay là', vanBanSau: 'rất đẹp.', dapAn: 'một ngày', danhSachLuaChon: 'một ngày,một đêm' }
  ]);

  useEffect(() => {
    // Load dropdown teachers
    adminService.searchUsers({ role: 'GIAO_VIEN', size: 100 })
      .then(res => setTeachers(res.content || []))
      .catch(err => console.error(err));

    if (dangBaiId > 0) {
      adminService.getDangBaiDetail(dangBaiId).then(dangBai => {
        setTitle(dangBai.tenDangBai || '');
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
          setLuaChon(parsed.danhSachLuaChon || [{ id: uid(), noiDung: '' }]);
          setDapAnDungId(ans.dapAnDungId || '');
        } else if (type === 'NOI_CAP') {
          setCotTrai(parsed.cotTrai || []);
          setCotPhai(parsed.cotPhai || []);
          setCapDung(ans.danhSachCapDung || []);
        } else if (type === 'DIEN_KHUYET') {

          const places = parsed.danhSachCho || [];
          const answers = ans.dapAnChoTrong || [];
          const mergedCho = places.map((p: any) => {
            const mapped = answers.find((m: any) => m.id === p.id);
            return { 
              id: p.id, 
              vanBanTruoc: p.vanBanTruoc, 
              vanBanSau: p.vanBanSau, 
              danhSachLuaChon: (p.danhSachLuaChon || []).join(','),
              dapAn: mapped ? mapped.dapAn : '' 
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
      dapAnChuan = { dapAnDungId };
    } else if (loai === 'NOI_CAP') {
      duLieuGame.cotTrai = cotTrai;
      duLieuGame.cotPhai = cotPhai;
      dapAnChuan = { danhSachCapDung: capDung };
    } else if (loai === 'DIEN_KHUYET') {
      duLieuGame.danhSachCho = danhSachCho.map(c => ({
        id: c.id, 
        vanBanTruoc: c.vanBanTruoc, 
        vanBanSau: c.vanBanSau,
        danhSachLuaChon: c.danhSachLuaChon ? c.danhSachLuaChon.split(',').map(s => s.trim()) : []
      }));
      dapAnChuan = {
        dapAnChoTrong: danhSachCho.map(c => ({
          id: c.id,
          dapAn: c.dapAn
        }))
      };
    }

    return {
      tenDangBai: title,
      baiHocId,
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
      // Debounce the update slightly to avoid too many renders when typing quickly
      const handler = setTimeout(() => {
        onPreviewUpdate(buildPayload());
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [
    title, loai, giaoDien, cauHoi, noiDung, hinhAnh, amThanh, video,
    thanhPhanCauHoi, luaChon, dapAnDungId,
    cotTrai, cotPhai, capDung,
    danhSachCho,
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

  // Components Render Media
  const renderMediaFields = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <Input label="Hình ảnh (URL)" value={hinhAnh} onChange={e => setHinhAnh(e.target.value)} placeholder="https://" />
      <Input label="Âm thanh (URL)" value={amThanh} onChange={e => setAmThanh(e.target.value)} placeholder="https://" />
      <Input label="Video (URL)" value={video} onChange={e => setVideo(e.target.value)} placeholder="https://" />
    </div>
  );

  return (
    <Card className="shadow-lg border-indigo-200 ring-4 ring-indigo-50">
      <CardHeader className="py-4 border-b border-indigo-100 bg-white rounded-t-xl flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold text-indigo-900">
          {dangBaiId === 0 ? 'Thêm mới Bài tập / Học liệu' : 'Chỉnh sửa Bài tập / Học liệu'}
        </CardTitle>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </CardHeader>
      
      <CardContent className="p-0 bg-white rounded-b-xl">
        <div className="p-6 space-y-8">
          
          {/* ========================================================== */}
          {/* 1. KHUNG THÔNG TIN CHUNG */}
          {/* ========================================================== */}
          <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Khung Thông Tin Chung</h2>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <Input label="Tên Dạng Bài" placeholder="VD: Ôn tập Từ vựng" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="col-span-4">
                <Input label="Bài học ID (Read-only)" value={baiHocId} disabled />
              </div>

              <div className="col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại Game / Dạng Bài</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-indigo-50 font-semibold text-indigo-700" value={loai} onChange={e => handleTypeChange(e.target.value as LoaiGame)}>
                  <option value="LY_THUYET">Lý Thuyết</option>
                  <option value="TU_LUAN">Tự Luận</option>
                  <option value="TRAC_NGHIEM">Trắc Nghiệm</option>
                  <option value="NOI_CAP">Nối Cặp</option>
                  <option value="DIEN_KHUYET">Điền Khuyết</option>
                </select>
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nguồn gốc</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" value={nguonGoc} onChange={e => setNguonGoc(e.target.value)}>
                  <option value="HE_THONG">Hệ Thống</option>
                  <option value="GIAO_VIEN">Giáo Viên Tự Soạn</option>
                </select>
              </div>
              <div className="col-span-4">
                <Input label="XP Thưởng" type="number" value={xp} onChange={e => setXp(Number(e.target.value))} />
              </div>
            </div>
          </section>

          {/* ==============================            {/* ========================================================== */}
            {/* 2. KHỐI THÔNG TIN NỀN (Hiển thị cho mọi form) */}
            {/* ========================================================== */}
            <section className="bg-indigo-50/30 p-5 rounded-xl border border-indigo-100 mb-6">
              <h2 className="text-base font-bold text-indigo-900 mb-4 border-b border-indigo-200 pb-2">Thông Tin Nền (Yêu cầu & Nội dung chính)</h2>
              
              <div className="space-y-4">
                {(loai === 'TRAC_NGHIEM' || loai === 'NOI_CAP' || loai === 'DIEN_KHUYET' || loai === 'LY_THUYET' || loai === 'TU_LUAN') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Giao diện (Template)</label>
                    <select className="w-full md:w-1/3 px-3 py-2 border border-slate-300 rounded-lg bg-white" value={giaoDien} onChange={e => setGiaoDien(e.target.value as GiaoDien)}>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Yêu cầu đề bài (cauHoi)</label>
                  <RichTextEditor value={cauHoi} onChange={setCauHoi} placeholder="Nhập yêu cầu đề bài..." minHeight="80px" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Giải thích/Nội dung (noiDung)</label>
                  <RichTextEditor value={noiDung} onChange={setNoiDung} placeholder="Nhập văn bản bài giảng, hướng dẫn giải..." minHeight="80px" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Khối Media Tổng</label>
                  {renderMediaFields()}
                </div>
              </div>
            </section>

            {/* ========================================================== */}
            {/* 3. CHI TIẾT FORM (Render động theo loại) */}
            {/* ========================================================== */}
            {(loai === 'TRAC_NGHIEM' || loai === 'NOI_CAP' || loai === 'DIEN_KHUYET') && (
              <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h2 className="text-base font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">
                  Chi tiết phần: {loai === 'TRAC_NGHIEM' ? 'Trắc Nghiệm' : loai === 'NOI_CAP' ? 'Nối Cặp' : 'Điền Khuyết'}
                </h2>

                {/* --- FORM 3: TRẮC NGHIỆM --- */}
                {loai === 'TRAC_NGHIEM' && (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Thành phần Câu hỏi phụ (thanhPhanCauHoi)</label>
                      {thanhPhanCauHoi.map((item, idx) => (
                        <div key={item.id} className="flex gap-2 mb-2">
                          <Input className="flex-1" placeholder="Văn bản" value={item.noiDung} onChange={e => {
                            const nw = [...thanhPhanCauHoi]; nw[idx].noiDung = e.target.value; setThanhPhanCauHoi(nw);
                          }} />
                          <Input className="w-1/4" placeholder="Hình ảnh (URL)" value={item.hinhAnh || ''} onChange={e => {
                            const nw = [...thanhPhanCauHoi]; nw[idx].hinhAnh = e.target.value; setThanhPhanCauHoi(nw);
                          }} />
                          <Input className="w-1/4" placeholder="Âm thanh (URL)" value={item.amThanh || ''} onChange={e => {
                            const nw = [...thanhPhanCauHoi]; nw[idx].amThanh = e.target.value; setThanhPhanCauHoi(nw);
                          }} />
                          <Button variant="outline" className="px-2" onClick={() => setThanhPhanCauHoi(thanhPhanCauHoi.filter(x => x.id !== item.id))}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" onClick={() => setThanhPhanCauHoi([...thanhPhanCauHoi, {id: uid(), noiDung: ''}])}>+ Thêm đoạn câu hỏi</Button>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <label className="block text-sm font-bold text-slate-700 mb-3">Quản lý Đáp án (Lựa chọn)</label>
                      {luaChon.map((lc, idx) => (
                        <div key={lc.id} className="flex gap-3 items-start p-3 rounded-lg border mb-3 bg-slate-50">
                          <div className="pt-2">
                            <input type="radio" name="tn_ans" className="w-5 h-5 cursor-pointer accent-indigo-600" checked={dapAnDungId === lc.id} onChange={() => setDapAnDungId(lc.id)} />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input placeholder={`Lựa chọn ${idx + 1}`} value={lc.noiDung} onChange={e => {
                              const nw = [...luaChon]; nw[idx].noiDung = e.target.value; setLuaChon(nw);
                            }} />
                            <div className="flex gap-2">
                              <Input className="text-xs h-8" placeholder="Hình ảnh URL (Tùy chọn)" value={lc.hinhAnh || ''} onChange={e => {
                                const nw = [...luaChon]; nw[idx].hinhAnh = e.target.value; setLuaChon(nw);
                              }} />
                              <Input className="text-xs h-8" placeholder="Âm thanh URL (Tùy chọn)" value={lc.amThanh || ''} onChange={e => {
                                const nw = [...luaChon]; nw[idx].amThanh = e.target.value; setLuaChon(nw);
                              }} />
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => {
                            setLuaChon(luaChon.filter(x => x.id !== lc.id));
                            if(dapAnDungId === lc.id) setDapAnDungId('');
                          }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setLuaChon([...luaChon, { id: uid(), noiDung: '' }])}>
                        <Plus className="w-4 h-4 mr-1" /> Thêm lựa chọn
                      </Button>
                    </div>
                  </div>
                )}

                {/* --- FORM 4: NỐI CẶP --- */}
                {loai === 'NOI_CAP' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Cột trái */}
                      <div className="bg-white p-4 border rounded-xl space-y-3 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-700 border-b pb-2">Thẻ Cột Trái</h4>
                        {cotTrai.map((item, idx) => (
                          <div key={item.id} className="space-y-2 border p-2 rounded-lg bg-slate-50">
                            <div className="flex gap-2">
                              <Input className="flex-1" placeholder="Văn bản..." value={item.noiDung} onChange={e => {
                                const nw = [...cotTrai]; nw[idx].noiDung = e.target.value; setCotTrai(nw);
                              }} />
                              <Button variant="outline" className="px-2" onClick={() => setCotTrai(cotTrai.filter(c => c.id !== item.id))}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                            </div>
                            <div className="flex gap-2">
                              <Input className="flex-1 h-8 text-xs" placeholder="Hình ảnh (URL)" value={item.hinhAnh || ''} onChange={e => {
                                  const nw = [...cotTrai]; nw[idx].hinhAnh = e.target.value; setCotTrai(nw);
                              }} />
                              <Input className="flex-1 h-8 text-xs" placeholder="Âm thanh (URL)" value={item.amThanh || ''} onChange={e => {
                                  const nw = [...cotTrai]; nw[idx].amThanh = e.target.value; setCotTrai(nw);
                              }} />
                            </div>
                          </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={() => setCotTrai([...cotTrai, { id: uid(), noiDung: '' }])}>+ Thêm thẻ bên trái</Button>
                      </div>
                      
                      {/* Cột phải */}
                      <div className="bg-white p-4 border rounded-xl space-y-3 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-700 border-b pb-2">Thẻ Cột Phải</h4>
                        {cotPhai.map((item, idx) => (
                          <div key={item.id} className="space-y-2 border p-2 rounded-lg bg-slate-50">
                            <div className="flex gap-2">
                              <Input className="flex-1" placeholder="Văn bản..." value={item.noiDung} onChange={e => {
                                const nw = [...cotPhai]; nw[idx].noiDung = e.target.value; setCotPhai(nw);
                              }} />
                              <Button variant="outline" className="px-2" onClick={() => setCotPhai(cotPhai.filter(c => c.id !== item.id))}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                            </div>
                            <div className="flex gap-2">
                              <Input className="flex-1 h-8 text-xs" placeholder="Hình ảnh (URL)" value={item.hinhAnh || ''} onChange={e => {
                                  const nw = [...cotPhai]; nw[idx].hinhAnh = e.target.value; setCotPhai(nw);
                              }} />
                              <Input className="flex-1 h-8 text-xs" placeholder="Âm thanh (URL)" value={item.amThanh || ''} onChange={e => {
                                  const nw = [...cotPhai]; nw[idx].amThanh = e.target.value; setCotPhai(nw);
                              }} />
                            </div>
                          </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={() => setCotPhai([...cotPhai, { id: uid(), noiDung: '' }])}>+ Thêm thẻ bên phải</Button>
                      </div>
                    </div>

                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                      <h4 className="font-bold text-sm text-slate-700 mb-4">Thiết lập Cặp Đúng</h4>
                      {capDung.map((cap, idx) => (
                        <div key={idx} className="flex gap-3 mb-3 items-center">
                          <select className="flex-1 border p-2 rounded-lg bg-slate-50" value={cap.traiId} onChange={e => {
                            const nw = [...capDung]; nw[idx].traiId = e.target.value; setCapDung(nw);
                          }}>
                            <option value="">-- Chọn thẻ trái --</option>
                            {cotTrai.map(c => <option key={c.id} value={c.id}>{c.noiDung || 'Thẻ ảnh'}</option>)}
                          </select>
                          <span className="font-bold text-slate-400">GHÉP VỚI</span>
                          <select className="flex-1 border p-2 rounded-lg bg-slate-50" value={cap.phaiId} onChange={e => {
                            const nw = [...capDung]; nw[idx].phaiId = e.target.value; setCapDung(nw);
                          }}>
                            <option value="">-- Chọn thẻ phải --</option>
                            {cotPhai.map(c => <option key={c.id} value={c.id}>{c.noiDung || 'Thẻ ảnh'}</option>)}
                          </select>
                          <Button variant="outline" onClick={() => setCapDung(capDung.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" onClick={() => setCapDung([...capDung, { traiId: '', phaiId: '' }])}>+ Thêm cặp nối</Button>
                    </div>
                  </div>
                )}

                {/* --- FORM 5: ĐIỀN KHUYẾT --- */}
                {loai === 'DIEN_KHUYET' && (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <label className="block text-sm font-bold text-slate-700 mb-3">Thiết lập Chỗ trống (Blank Spaces)</label>
                      {danhSachCho.map((cho, idx) => (
                        <div key={cho.id} className="p-3 rounded-lg border border-slate-300 mb-3 bg-slate-50 space-y-3">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm font-bold text-slate-700">Chỗ trống #{idx + 1}</span>
                            <button 
                              type="button"
                              className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-md transition-colors"
                              onClick={() => setDanhSachCho(danhSachCho.filter(x => x.id !== cho.id))}
                            >
                              <Trash2 className="w-3.5 h-3.5"/> Xóa
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-4">
                              <label className="text-xs font-bold text-slate-500 block mb-1">Văn bản trước</label>
                              <Input placeholder="..." value={cho.vanBanTruoc} onChange={e => {
                                const nw = [...danhSachCho]; nw[idx].vanBanTruoc = e.target.value; setDanhSachCho(nw);
                              }} />
                            </div>
                            <div className="col-span-4">
                              <label className="text-xs font-bold text-indigo-600 block mb-1">ĐÁP ÁN ĐÚNG</label>
                              <Input className="font-bold text-indigo-700 bg-indigo-50 border-indigo-300" placeholder="vd: một ngày" value={cho.dapAn} onChange={e => {
                                const nw = [...danhSachCho]; nw[idx].dapAn = e.target.value; setDanhSachCho(nw);
                              }} />
                            </div>
                            <div className="col-span-4">
                              <label className="text-xs font-bold text-slate-500 block mb-1">Văn bản sau</label>
                              <Input placeholder="..." value={cho.vanBanSau} onChange={e => {
                                const nw = [...danhSachCho]; nw[idx].vanBanSau = e.target.value; setDanhSachCho(nw);
                              }} />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">Danh sách mồi nhử (Nhập các từ cách nhau bằng dấu phẩy)</label>
                            <Input className="text-sm" placeholder="VD: một ngày, một đêm, buổi sáng" value={cho.danhSachLuaChon} onChange={e => {
                              const nw = [...danhSachCho]; nw[idx].danhSachLuaChon = e.target.value; setDanhSachCho(nw);
                            }} />
                          </div>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" onClick={() => setDanhSachCho([...danhSachCho, { id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '', danhSachLuaChon: '' }])}>
                        + Thêm chỗ trống
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 flex justify-end gap-3 rounded-b-xl border-t border-slate-200">
          <Button variant="outline" onClick={onCancel}>Hủy bỏ</Button>
          <Button onClick={handleSave} isLoading={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
            <Save className="w-4 h-4 mr-2" /> LƯU THÔNG TIN
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


