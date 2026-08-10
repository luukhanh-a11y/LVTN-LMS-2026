import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText, Puzzle, Loader2, AlertTriangle, Send } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { teacherService, type Material, type ClassRoom } from '../../services/teacher.service';
import { useAcademicStore } from '../../stores/useAcademicStore';
import QuizForm from '../../components/student/QuizForm';
import LyThuyetForm from '../../components/student/LyThuyetForm';
import TuLuanForm from '../../components/student/TuLuanForm';
import { MatchingGame } from '../../components/games/MatchingGame';
import { MillionaireGame } from '../../components/games/MillionaireGame';
import { BeeGame } from '../../components/games/BeeGame';
import { SortingGame } from '../../components/games/SortingGame';
import { HarvestGame } from '../../components/games/HarvestGame';
import { FrogGame } from '../../components/games/FrogGame';
import { BalloonGame } from '../../components/games/BalloonGame';
import { CatchingGame } from '../../components/games/CatchingGame';
import { GoldMinerGame } from '../../components/games/GoldMinerGame';

const TYPE_LABEL: Record<Material['loaiNoiDung'], string> = {
  H5P: 'Bài giảng H5P',
  FILE: 'Tài liệu',
  NATIVE: 'Nội dung tương tác',
  JSON_TEXT: 'Lý thuyết',
};

// Xem trước (không nộp bài) nội dung game/trắc nghiệm của dang_bai không phải
// H5P — tái dùng đúng các component đang phát cho học sinh ở LessonPlayer.tsx.
// Truyền `result` khác null ngay từ đầu để mọi game tự khóa tương tác (chế độ
// "đã chấm/xem trước"), `onSubmit` không bao giờ thực sự được gọi tới.
function NoiDungGamePreview({ material }: { material: Material }) {
  let cauHinh: any = {};
  try {
    cauHinh = material.duLieuGame ? JSON.parse(material.duLieuGame) : {};
  } catch {
    cauHinh = {};
  }
  let dapAnChuan: any = null;
  try {
    dapAnChuan = material.dapAnChuan ? JSON.parse(material.dapAnChuan) : null;
  } catch {
    dapAnChuan = null;
  }
  const loai = cauHinh.loai || 'LY_THUYET';
  const giaoDien = cauHinh.giaoDien;
  const previewResult = { diem: 0, dapAnChuan };
  const noop = () => {};

  if (loai === 'LY_THUYET') return <LyThuyetForm cauHinh={cauHinh} />;
  if (loai === 'TU_LUAN') return <TuLuanForm cauHinh={cauHinh} result={previewResult} onSubmit={noop} submitting={false} />;
  if (loai === 'TRAC_NGHIEM' && giaoDien === 'THU_HOACH_NONG_SAN')
    return <HarvestGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'TRAC_NGHIEM' && giaoDien === 'ECH_QUA_SONG')
    return <FrogGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'TRAC_NGHIEM' && giaoDien === 'BAN_BONG_BAY')
    return <BalloonGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'TRAC_NGHIEM' && giaoDien === 'TRIEU_PHU')
    return <MillionaireGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'TRAC_NGHIEM' && giaoDien === 'DUOI_BAT')
    return <CatchingGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'TRAC_NGHIEM' && giaoDien === 'DAO_VANG')
    return <GoldMinerGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'NOI_CAP' && giaoDien === 'PHAN_LOAI')
    return <SortingGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'NOI_CAP')
    return <MatchingGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai === 'DIEN_KHUYET' && giaoDien === 'ONG_TIM_MAT')
    return <BeeGame cauHinh={cauHinh} result={previewResult} activeDapAnChuan={dapAnChuan} onSubmit={noop} />;
  if (loai && cauHinh)
    return (
      <QuizForm loai={loai} cauHinh={cauHinh} dapAnChuan={dapAnChuan} result={previewResult} onSubmit={noop} submitting={false} />
    );
  return null;
}

export default function TeacherMaterialDetail() {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Giao bài state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');
  const [maxResubmitCount, setMaxResubmitCount] = useState(3);
  
  const currentHocKyId = useAcademicStore(state => state.currentHocKyId);

  // Fetch classes when assign modal opens
  useEffect(() => {
    if (showAssignModal && classes.length === 0) {
      teacherService.getClasses().then(data => setClasses(data)).catch(console.error);
    }
  }, [showAssignModal]);

  useEffect(() => {
    if (!materialId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    teacherService
      .getMaterialById(materialId)
      .then((data) => {
        if (!cancelled) setMaterial(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Không tìm thấy học liệu này.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [materialId]);

  const isH5p = material?.loaiNoiDung === 'H5P';
  const isOwnMaterial = material?.nguonGoc === 'GIAO_VIEN_BO_SUNG';

  const handleDelete = async () => {
    if (!material || !material.giaoVienId) return;
    setDeleting(true);
    try {
      await teacherService.deleteMaterial(material.dangBaiId, material.giaoVienId);
      toast.success('Đã xóa học liệu.');
      navigate('/teacher/materials');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Xóa học liệu thất bại.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedClassId) {
      toast.error('Vui lòng chọn lớp học');
      return;
    }
    if (!material) return;
    
    setAssigning(true);
    try {
      const profile = await teacherService.getMyTeacherProfile();
      
      let loaiBaiTapBackend = "TRAC_NGHIEM";
      if (material.loaiNoiDung === 'H5P') {
        loaiBaiTapBackend = "H5P";
      } else if (material.loaiNoiDung === 'FILE') {
        loaiBaiTapBackend = "TU_LUAN";
      } else if (material.loaiNoiDung === 'JSON_TEXT') {
        try {
          const cauHinh = JSON.parse(material.duLieuGame || '{}');
          if (cauHinh.loai === 'TU_LUAN') loaiBaiTapBackend = 'TU_LUAN';
        } catch(e) {}
      }

      const payload = {
        baiTap: {
          giaoVienId: profile.giaoVienId,
          lopHocId: Number(selectedClassId),
          hocKyId: currentHocKyId || 1, // Fallback if missing
          tieuDe: material.tenDangBai,
          moTa: "Bài tập được giao từ kho học liệu",
          loaiBaiTap: loaiBaiTapBackend, 
          thoiDiemBatDau: new Date().toISOString(),
          deadline: deadline ? new Date(deadline).toISOString() : null,
          soLanNopLaiToiDa: maxResubmitCount,
          trangThai: "DANG_MO"
        },
        danhSachChiTiet: [
          {
            dangBaiId: material.dangBaiId || (material as any).id,
            thuTu: 1,
            cheDoGiaoDien: "DEFAULT"
          }
        ]
      };

      await teacherService.createAssignment(payload);
      toast.success('Giao bài thành công!');
      setShowAssignModal(false);
      
      // Không có trang /teacher/assignments, nên chuyển hướng về trang lớp học
      navigate('/teacher/classes');
    } catch (err: any) {
      if (err?.response?.data?.code === 1022) {
        toast.error('Hệ thống không cho phép giao bài từ Sách giáo khoa chính khóa (hoặc dữ liệu đã bị xóa). Vui lòng chọn học liệu khác!');
      } else {
        toast.error(err?.response?.data?.message ?? 'Giao bài thất bại. Lỗi 404 (Không tìm thấy đối tượng).');
      }
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/teacher/materials')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Kho học liệu
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Đang tải...
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-24 text-red-500 text-sm">{error}</div>
      )}

      {!loading && !error && material && (
        <Card className="border-slate-200 shadow-md">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner">
                {isH5p ? (
                  <Puzzle className="h-12 w-12 text-pro-primary" />
                ) : (
                  <FileText className="h-12 w-12 text-orange-600" />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{material.tenDangBai}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-sm px-3 py-1">{TYPE_LABEL[material.loaiNoiDung]}</Badge>
                  {!isOwnMaterial && (
                    <Badge variant="warning" className="text-sm px-3 py-1">Thư viện Hệ thống (Chỉ đọc)</Badge>
                  )}
                  {material.xpThuong > 0 && (
                    <Badge variant="success" className="text-sm px-3 py-1">+{material.xpThuong} XP</Badge>
                  )}
                  {material.khoiLop && (
                    <Badge variant="outline" className="text-sm px-3 py-1">Khối {material.khoiLop}</Badge>
                  )}
                  {material.tenMon && (
                    <Badge variant="outline" className="text-sm px-3 py-1">{material.tenMon}</Badge>
                  )}
                  {material.tenBaiHoc && (
                    <Badge variant="outline" className="text-sm px-3 py-1">Bài học: {material.tenBaiHoc}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              {isH5p && material.h5pNoiDungId ? (
                <div className="h-[500px] border border-slate-200 rounded-xl overflow-hidden">
                  <H5PPlayer contentId={material.h5pNoiDungId} />
                </div>
              ) : material.loaiNoiDung === 'JSON_TEXT' && material.duLieuGame ? (
                <div className="h-[500px] border border-slate-200 rounded-xl overflow-hidden">
                  <NoiDungGamePreview material={material} />
                </div>
              ) : (
                <div className="h-64 w-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-16 h-16 mb-4 text-slate-300" />
                  <p>Học liệu này chưa có nội dung/tệp đính kèm</p>
                </div>
              )}
            </div>

            <div className="pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 gap-4">
              {isOwnMaterial && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Xóa tài liệu
                </Button>
              )}
              <div className="flex space-x-3 w-full sm:w-auto">
                {isH5p && material.h5pNoiDungId && isOwnMaterial && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => navigate(`/teacher/editor/${material.h5pNoiDungId}`)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  onClick={() => setShowAssignModal(true)}
                >
                  <Send className="w-4 h-4 mr-2" /> Giao bài
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Xóa học liệu?
          </div>
        }
        widthClass="w-[420px]"
      >
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm">
            Học liệu "{material?.tenDangBai}" sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
              Hủy
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL GIAO BÀI */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => !assigning && setShowAssignModal(false)}
        title="Giao bài cho lớp"
        widthClass="w-[500px]"
      >
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Lớp học <span className="text-red-500">*</span></label>
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={assigning}
            >
              <option value="">-- Chọn lớp học --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hạn nộp (Tùy chọn)</label>
            <input 
              type="datetime-local" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={assigning}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Số lần làm bài tối đa</label>
            <input 
              type="number" 
              min={1}
              max={100}
              value={maxResubmitCount}
              onChange={(e) => setMaxResubmitCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={assigning}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowAssignModal(false)} disabled={assigning}>
              Hủy
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAssign} disabled={assigning}>
              {assigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {assigning ? 'Đang giao...' : 'Xác nhận giao bài'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
