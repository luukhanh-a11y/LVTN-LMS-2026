import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/admin.service';

interface GameAuthoringFormProps {
  dangBaiId: number; // 0 if new
  baiHocId: number;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

type LoaiGame = 'LY_THUYET' | 'TU_LUAN' | 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET';
type GiaoDien = 'MAC_DINH' | 'DAO_VANG' | 'DUOI_BAT' | 'NOI_CAP' | 'PHAN_LOAI' | 'THU_HOACH_NONG_SAN' | 'ECH_QUA_SONG' | 'BAN_BONG_BAY' | 'TRIEU_PHU' | 'ONG_TIM_MAT';

// Helper for unique IDs
let uidCounter = 0;
const uid = () => `id${Date.now()}_${uidCounter++}`;

export default function GameAuthoringForm({ dangBaiId, baiHocId, onSaveSuccess, onCancel }: GameAuthoringFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [xp, setXp] = useState(10);
  
  // Trạng thái cấu hình Game
  const [loai, setLoai] = useState<LoaiGame>('TRAC_NGHIEM');
  const [giaoDien, setGiaoDien] = useState<GiaoDien>('MAC_DINH');

  // Lý thuyết & Tự luận
  const [noiDung, setNoiDung] = useState('');
  
  // Media chung
  const [hinhAnh, setHinhAnh] = useState('');
  const [amThanh, setAmThanh] = useState('');
  const [video, setVideo] = useState('');

  // Trắc nghiệm (Đào Vàng, Đuổi bắt, etc)
  const [cauHoi, setCauHoi] = useState('');
  const [luaChon, setLuaChon] = useState<{id: string; noiDung: string}[]>([
    { id: uid(), noiDung: '' },
    { id: uid(), noiDung: '' }
  ]);
  const [dapAnDungId, setDapAnDungId] = useState('');

  // Nối Cặp / Phân loại
  const [cotTrai, setCotTrai] = useState<{id: string; noiDung: string}[]>([{ id: uid(), noiDung: '' }]);
  const [cotPhai, setCotPhai] = useState<{id: string; noiDung: string}[]>([{ id: uid(), noiDung: '' }]);
  const [capDung, setCapDung] = useState<{traiId: string; phaiId: string}[]>([]);

  // Điền khuyết
  const [danhSachCho, setDanhSachCho] = useState<{id: string; vanBanTruoc: string; vanBanSau: string; dapAn: string}[]>([
    { id: uid(), vanBanTruoc: 'Hôm nay là', vanBanSau: 'rất đẹp.', dapAn: 'một ngày' }
  ]);

  const [activeTab, setActiveTab] = useState<'EDIT' | 'CHANGE_TYPE'>('EDIT');

  useEffect(() => {
    if (dangBaiId > 0) {
      setActiveTab('EDIT');
      // Fetch details
      adminService.getDangBaiDetail(dangBaiId).then(dangBai => {
        setTitle(dangBai.tenDangBai);
        setXp(dangBai.xpThuong || 10);
        let parsed: any = {};
        try { parsed = JSON.parse(dangBai.duLieuGame); } catch(e) {}
        let ans: any = {};
        try { ans = JSON.parse(dangBai.dapAnChuan); } catch(e) {}
        
        const type = parsed.loai || 'TRAC_NGHIEM';
        // Note: Old PHAN_LOAI was converted to NOI_CAP with giaoDien PHAN_LOAI
        if (type === 'PHAN_LOAI') {
          setLoai('NOI_CAP');
          setGiaoDien('PHAN_LOAI');
          // Try to map old structure to new structure if it exists
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

        setHinhAnh(parsed.hinhAnh || '');
        setAmThanh(parsed.amThanh || '');
        setVideo(parsed.video || '');

        if (type === 'LY_THUYET' || type === 'TU_LUAN') {
          setNoiDung(parsed.noiDung || '');
        } else if (type === 'TRAC_NGHIEM') {
          setCauHoi(parsed.cauHoi || '');
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
            return { id: p.id, vanBanTruoc: p.vanBanTruoc, vanBanSau: p.vanBanSau, dapAn: mapped ? mapped.dapAn : '' };
          });
          setDanhSachCho(mergedCho);
        }
      }).catch(err => {
        console.error(err);
        toast.error('Không thể tải dữ liệu Game');
      });
    } else {
      setActiveTab('EDIT');
      setTitle('');
      setCauHoi('');
      setNoiDung('');
      setHinhAnh('');
      setAmThanh('');
      setVideo('');
      setGiaoDien('MAC_DINH');
      setLoai('TRAC_NGHIEM');
      setXp(10);
    }
  }, [dangBaiId]);

  const handleTypeChange = (newLoai: LoaiGame) => {
    if (dangBaiId > 0 && activeTab === 'EDIT') return; // Cannot change in EDIT mode
    if (newLoai !== loai) {
      if (dangBaiId > 0 && !window.confirm('Việc thay đổi Dạng bài sẽ làm lại dữ liệu từ đầu. Bạn có chắc chắn không?')) {
        return;
      }
      setLoai(newLoai);
      // Reset defaults based on newLoai
      if (newLoai === 'TRAC_NGHIEM') setGiaoDien('MAC_DINH');
      else if (newLoai === 'NOI_CAP') setGiaoDien('MAC_DINH');
      else if (newLoai === 'DIEN_KHUYET') setGiaoDien('MAC_DINH');
      else if (newLoai === 'LY_THUYET' || newLoai === 'TU_LUAN') setGiaoDien('MAC_DINH');
      
      setNoiDung('');
      setCauHoi('');
      setHinhAnh('');
      setAmThanh('');
      setVideo('');
      setLuaChon([{ id: uid(), noiDung: '' }, { id: uid(), noiDung: '' }]);
      setDapAnDungId('');
      setCotTrai([{ id: uid(), noiDung: '' }]);
      setCotPhai([{ id: uid(), noiDung: '' }]);
      setCapDung([]);
      setDanhSachCho([{ id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '' }]);
    }
  };

  const buildPayload = () => {
    let duLieuGame = {};
    let dapAnChuan = {};

    if (loai === 'LY_THUYET' || loai === 'TU_LUAN') {
      duLieuGame = { loai, noiDung, hinhAnh, amThanh, video };
      dapAnChuan = {};
    } else if (loai === 'TRAC_NGHIEM') {
      duLieuGame = { loai: 'TRAC_NGHIEM', cauHoi, giaoDien, hinhAnh, amThanh, video, danhSachLuaChon: luaChon };
      dapAnChuan = { dapAnDungId };
    } else if (loai === 'NOI_CAP') {
      duLieuGame = { loai: 'NOI_CAP', cauHoi: title, giaoDien, hinhAnh, amThanh, video, cotTrai, cotPhai };
      dapAnChuan = { danhSachCapDung: capDung };
    } else if (loai === 'DIEN_KHUYET') {
      duLieuGame = {
        loai: 'DIEN_KHUYET', cauHoi: title, giaoDien, hinhAnh, amThanh, video,
        danhSachCho: danhSachCho.map(c => ({
          id: c.id, vanBanTruoc: c.vanBanTruoc, vanBanSau: c.vanBanSau
        }))
      };
      dapAnChuan = {
        dapAnChoTrong: danhSachCho.map(c => ({
          id: c.id,
          dapAn: c.dapAn
        }))
      };
    }

    return {
      tenDangBai: title,
      loaiNoiDung: 'JSON_TEXT', // Luôn gửi JSON_TEXT để Frontend Student nhận diện và parse
      baiHocId,
      xpThuong: xp,
      duLieuGame: JSON.stringify(duLieuGame),
      dapAnChuan: JSON.stringify(dapAnChuan)
    };
  };

  const handleSave = async () => {
    if (!title) {
      toast.error('Vui lòng nhập tên dạng bài (Game Title)');
      return;
    }
    
    const payload = buildPayload();
    console.log("Saving payload:", payload);
    
    setIsSaving(true);
    try {
      if (dangBaiId === 0) {
        await adminService.createDangBai(payload);
      } else {
        await adminService.updateDangBai(dangBaiId, payload);
      }
      toast.success('Lưu bài tập/Game thành công!');
      onSaveSuccess();
    } catch (err) {
      toast.error('Lỗi khi lưu');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Functions cho từng Loại ---
  const renderMediaFields = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Input label="URL Hình ảnh (Tùy chọn)" placeholder="https://..." value={hinhAnh} onChange={(e) => setHinhAnh(e.target.value)} />
      <Input label="URL Âm thanh (Tùy chọn)" placeholder="https://..." value={amThanh} onChange={(e) => setAmThanh(e.target.value)} />
      <Input label="URL Video (Tùy chọn)" placeholder="https://..." value={video} onChange={(e) => setVideo(e.target.value)} />
    </div>
  );

  const renderHocLieuThuan = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nội dung (Đề bài / Lý thuyết)</label>
        <textarea 
          className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 min-h-[150px]"
          placeholder="Nhập nội dung văn bản..."
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
        />
      </div>
    </div>
  );

  const renderTracNghiem = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Giao diện Game</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            value={giaoDien}
            onChange={(e) => setGiaoDien(e.target.value as GiaoDien)}
          >
            <option value="MAC_DINH">Trắc nghiệm chuẩn</option>
            <option value="DAO_VANG">Đào Vàng</option>
            <option value="DUOI_BAT">Đuổi Bắt</option>
            <option value="THU_HOACH_NONG_SAN">Thu hoạch Nông sản</option>
            <option value="ECH_QUA_SONG">Ếch qua sông</option>
            <option value="BAN_BONG_BAY">Bắn bóng bay</option>
            <option value="TRIEU_PHU">Ai là triệu phú</option>
          </select>
        </div>
      </div>
      
      <Input
        label="Nội dung Câu hỏi"
        value={cauHoi}
        onChange={(e) => setCauHoi(e.target.value)}
        placeholder="VD: Quả táo tiếng Anh là gì?"
      />
      
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-medium text-slate-700">Các lựa chọn (Tối thiểu 2, tối đa 4 cho Game)</label>
        {luaChon.map((lc, idx) => (
          <div key={lc.id} className="flex items-center gap-3">
            <input 
              type="radio" 
              name="tracnghiem_dapan" 
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              checked={dapAnDungId === lc.id}
              onChange={() => setDapAnDungId(lc.id)}
            />
            <Input 
              className="flex-1"
              value={lc.noiDung}
              onChange={(e) => {
                const nw = [...luaChon];
                nw[idx].noiDung = e.target.value;
                setLuaChon(nw);
              }}
              placeholder={`Lựa chọn ${idx + 1}`}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="px-2 text-slate-400 hover:text-red-500"
              onClick={() => {
                setLuaChon(luaChon.filter(l => l.id !== lc.id));
                if (dapAnDungId === lc.id) setDapAnDungId('');
              }}
              disabled={luaChon.length <= 2}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {luaChon.length < 4 && (
          <Button variant="outline" size="sm" onClick={() => setLuaChon([...luaChon, { id: uid(), noiDung: '' }])}>
            <Plus className="w-4 h-4 mr-1" /> Thêm lựa chọn
          </Button>
        )}
      </div>
    </div>
  );

  const renderNoiCap = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Giao diện Game</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            value={giaoDien}
            onChange={(e) => setGiaoDien(e.target.value as GiaoDien)}
          >
            <option value="MAC_DINH">Nối cặp (Kéo dây)</option>
            <option value="PHAN_LOAI">Phân loại (Kéo thả vào thùng)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-sm font-medium text-slate-700">Cột Trái (Thùng chứa / Từ vựng)</label>
          {cotTrai.map((item, idx) => (
            <div key={item.id} className="flex gap-2">
              <Input 
                className="flex-1"
                value={item.noiDung}
                onChange={(e) => {
                  const nw = [...cotTrai];
                  nw[idx].noiDung = e.target.value;
                  setCotTrai(nw);
                }}
                placeholder="Nội dung trái"
              />
              <Button variant="outline" className="px-2" onClick={() => setCotTrai(cotTrai.filter(c => c.id !== item.id))}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCotTrai([...cotTrai, { id: uid(), noiDung: '' }])}>Thêm mục</Button>
        </div>

        {/* Cột phải */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-sm font-medium text-slate-700">Cột Phải (Vật phẩm / Nghĩa)</label>
          {cotPhai.map((item, idx) => (
            <div key={item.id} className="flex gap-2">
              <Input 
                className="flex-1"
                value={item.noiDung}
                onChange={(e) => {
                  const nw = [...cotPhai];
                  nw[idx].noiDung = e.target.value;
                  setCotPhai(nw);
                }}
                placeholder="Nội dung phải"
              />
              <Button variant="outline" className="px-2" onClick={() => setCotPhai(cotPhai.filter(c => c.id !== item.id))}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCotPhai([...cotPhai, { id: uid(), noiDung: '' }])}>Thêm mục</Button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">Định nghĩa Cặp Đúng (Đáp án)</label>
        {capDung.map((cap, idx) => (
          <div key={idx} className="flex items-center gap-3 mb-2">
            <select 
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              value={cap.traiId}
              onChange={(e) => {
                const nw = [...capDung];
                nw[idx].traiId = e.target.value;
                setCapDung(nw);
              }}
            >
              <option value="">-- Chọn cột trái --</option>
              {cotTrai.map(c => <option key={c.id} value={c.id}>{c.noiDung || c.id}</option>)}
            </select>
            <span className="text-slate-400">---</span>
            <select 
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              value={cap.phaiId}
              onChange={(e) => {
                const nw = [...capDung];
                nw[idx].phaiId = e.target.value;
                setCapDung(nw);
              }}
            >
              <option value="">-- Chọn cột phải --</option>
              {cotPhai.map(c => <option key={c.id} value={c.id}>{c.noiDung || c.id}</option>)}
            </select>
            <Button variant="outline" size="sm" className="px-2 text-red-400" onClick={() => setCapDung(capDung.filter((_, i) => i !== idx))}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => setCapDung([...capDung, { traiId: '', phaiId: '' }])}>
          <Plus className="w-4 h-4 mr-1" /> Thêm Cặp
        </Button>
      </div>
    </div>
  );

  const renderDienKhuyet = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Giao diện Game</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            value={giaoDien}
            onChange={(e) => setGiaoDien(e.target.value as GiaoDien)}
          >
            <option value="MAC_DINH">Nhập liệu chuẩn</option>
            <option value="ONG_TIM_MAT">Game Ong Tìm Mật</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <label className="block text-sm font-medium text-slate-700">Danh sách Chỗ trống</label>
        {danhSachCho.map((cho, idx) => (
          <div key={cho.id} className="flex gap-2 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <Input 
                placeholder="Văn bản TRƯỚC ô trống" 
                value={cho.vanBanTruoc}
                onChange={(e) => {
                  const nw = [...danhSachCho];
                  nw[idx].vanBanTruoc = e.target.value;
                  setDanhSachCho(nw);
                }}
              />
              <Input 
                className="font-bold text-indigo-600 bg-indigo-50"
                placeholder="ĐÁP ÁN (ô trống)" 
                value={cho.dapAn}
                onChange={(e) => {
                  const nw = [...danhSachCho];
                  nw[idx].dapAn = e.target.value;
                  setDanhSachCho(nw);
                }}
              />
              <Input 
                placeholder="Văn bản SAU ô trống" 
                value={cho.vanBanSau}
                onChange={(e) => {
                  const nw = [...danhSachCho];
                  nw[idx].vanBanSau = e.target.value;
                  setDanhSachCho(nw);
                }}
              />
            </div>
            <Button variant="outline" className="px-2" onClick={() => setDanhSachCho(danhSachCho.filter(c => c.id !== cho.id))}>
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => setDanhSachCho([...danhSachCho, { id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '' }])}>
          <Plus className="w-4 h-4 mr-1" /> Thêm chỗ trống
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="shadow-lg border-indigo-200 ring-4 ring-indigo-50">
      <CardHeader className="py-4 border-b border-indigo-100 bg-white rounded-t-xl flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold text-indigo-900 flex items-center">
          {dangBaiId === 0 ? 'Tạo Bài tập / Học liệu Mới' : 'Chỉnh sửa Bài tập / Học liệu'}
        </CardTitle>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </CardHeader>
      
      <CardContent className="p-0 bg-white rounded-b-xl">
        {dangBaiId > 0 && (
          <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('EDIT')} 
              className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'EDIT' ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Chỉnh sửa Giao diện & Dữ liệu
            </button>
            <button 
              onClick={() => setActiveTab('CHANGE_TYPE')} 
              className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'CHANGE_TYPE' ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Thay đổi Dạng bài (Reset)
            </button>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Thông tin chung */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Tiêu đề Bài / Tiêu đề Game"
                placeholder="VD: Ôn tập Từ Vựng Chủ Đề Gia đình"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Điểm XP Thưởng"
                type="number"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Loại Dạng Bài / Học liệu</label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'LY_THUYET', label: 'Lý Thuyết' },
                { val: 'TU_LUAN', label: 'Tự Luận' },
                { val: 'TRAC_NGHIEM', label: 'Trắc Nghiệm' },
                { val: 'NOI_CAP', label: 'Nối Cặp / Phân loại' },
                { val: 'DIEN_KHUYET', label: 'Điền Khuyết' }
              ].map(type => {
                const disabled = dangBaiId > 0 && activeTab === 'EDIT' && loai !== type.val;
                return (
                <button
                  key={type.val}
                  onClick={() => handleTypeChange(type.val as LoaiGame)}
                  disabled={disabled}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${loai === type.val ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'} ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
                >
                  {type.label}
                </button>
              )})}
            </div>
          </div>

          {/* Khu vực Form Động tùy theo Loại */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
            Cấu hình Nội dung: {loai}
          </h3>
          {renderMediaFields()}
          {(loai === 'LY_THUYET' || loai === 'TU_LUAN') && renderHocLieuThuan()}
          {loai === 'TRAC_NGHIEM' && renderTracNghiem()}
          {loai === 'NOI_CAP' && renderNoiCap()}
          {loai === 'DIEN_KHUYET' && renderDienKhuyet()}
        </div>

        {/* Hành động */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onCancel}>Hủy</Button>
          <Button onClick={handleSave} isLoading={isSaving} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" /> Lưu Dữ Liệu
          </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
