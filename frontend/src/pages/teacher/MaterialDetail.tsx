import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText, Puzzle, Loader2, AlertTriangle, Tag } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { teacherService, type Material, type Subject } from '../../services/teacher.service';
import { GRADES } from '../../constants';

const TYPE_LABEL: Record<Material['type'], string> = {
  TAI_LIEU: 'Tài liệu',
  BAI_GIANG_H5P: 'Bài giảng H5P',
  BAI_TAP_H5P: 'Bài tập H5P',
};

export default function TeacherMaterialDetail() {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showClassifyModal, setShowClassifyModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classifyGrade, setClassifyGrade] = useState('');
  const [classifySubjectId, setClassifySubjectId] = useState('');
  const [classifying, setClassifying] = useState(false);

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

  useEffect(() => {
    teacherService.getSubjects().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  const openClassifyModal = () => {
    setClassifyGrade(material?.grade ? String(material.grade) : '');
    setClassifySubjectId(material?.subjectId ? String(material.subjectId) : '');
    setShowClassifyModal(true);
  };

  const handleSaveClassification = async () => {
    if (!material) return;
    setClassifying(true);
    try {
      const updated = await teacherService.updateMaterialClassification(material.id, {
        grade: classifyGrade ? Number(classifyGrade) : null,
        subjectId: classifySubjectId ? Number(classifySubjectId) : null,
      });
      setMaterial(updated);
      toast.success('Đã cập nhật Khối/Môn cho học liệu.');
      setShowClassifyModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Cập nhật thất bại.');
    } finally {
      setClassifying(false);
    }
  };

  const isH5p = material?.type === 'BAI_GIANG_H5P' || material?.type === 'BAI_TAP_H5P';

  const handleDelete = async () => {
    if (!material) return;
    setDeleting(true);
    try {
      await teacherService.deleteMaterial(material.id);
      toast.success('Đã xóa học liệu.');
      navigate('/teacher/materials');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Xóa học liệu thất bại.');
      setDeleting(false);
      setShowDeleteConfirm(false);
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
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{material.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-sm px-3 py-1">{TYPE_LABEL[material.type]}</Badge>
                  {material.origin === 'THU_VIEN_GOC' && (
                    <Badge variant="warning" className="text-sm px-3 py-1">Thư viện Gốc (Chỉ đọc)</Badge>
                  )}
                  {material.xpReward > 0 && (
                    <Badge variant="success" className="text-sm px-3 py-1">+{material.xpReward} XP</Badge>
                  )}
                  {material.grade && (
                    <Badge variant="outline" className="text-sm px-3 py-1">Khối {material.grade}</Badge>
                  )}
                  {material.subjectName && (
                    <Badge variant="outline" className="text-sm px-3 py-1">{material.subjectName}</Badge>
                  )}
                  {material.origin !== 'THU_VIEN_GOC' && !material.grade && !material.subjectName && (
                    <Badge variant="warning" className="text-sm px-3 py-1">Chưa phân loại Khối/Môn</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              {isH5p && material.h5pContentId ? (
                <div className="h-[500px] border border-slate-200 rounded-xl overflow-hidden">
                  <H5PPlayer contentId={material.h5pContentId} />
                </div>
              ) : (
                <div className="h-64 w-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-16 h-16 mb-4 text-slate-300" />
                  <p>{material.fileUrl ? 'Xem tệp đính kèm' : 'Học liệu này chưa có nội dung/tệp đính kèm'}</p>
                </div>
              )}
            </div>

            <div className="pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 gap-4">
              {material.origin !== 'THU_VIEN_GOC' && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Xóa tài liệu
                </Button>
              )}
              <div className="flex space-x-3 w-full sm:w-auto">
                {material.origin !== 'THU_VIEN_GOC' && (
                  <Button variant="outline" className="w-full sm:w-auto" onClick={openClassifyModal}>
                    <Tag className="w-4 h-4 mr-2" /> Phân loại Khối/Môn
                  </Button>
                )}
                {isH5p && material.h5pContentId && material.origin !== 'THU_VIEN_GOC' && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => navigate(`/teacher/editor/${material.h5pContentId}`)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
                <Button
                  className="w-full sm:w-auto px-8"
                  disabled={!isH5p || !material.h5pContentId}
                  title={!isH5p || !material.h5pContentId ? 'Chỉ học liệu H5P mới giao được thành bài tập tự động chấm' : undefined}
                  onClick={() => navigate(`/teacher/assignments?hocLieuId=${material.id}`)}
                >
                  Giao bài cho lớp
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
            Học liệu "{material?.title}" sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
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

      <Modal
        isOpen={showClassifyModal}
        onClose={() => setShowClassifyModal(false)}
        title={
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-pro-primary" /> Phân loại Khối/Môn
          </div>
        }
        widthClass="w-[420px]"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Khối</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-pro-primary focus:ring-2 focus:ring-pro-primary/10"
              value={classifyGrade}
              onChange={(e) => setClassifyGrade(e.target.value)}
            >
              <option value="">-- Chưa chọn --</option>
              {GRADES.filter((g) => g.value !== 'all').map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Môn học</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-base focus:border-pro-primary focus:ring-2 focus:ring-pro-primary/10"
              value={classifySubjectId}
              onChange={(e) => setClassifySubjectId(e.target.value)}
            >
              <option value="">-- Chưa chọn --</option>
              {subjects.map((s) => (
                <option key={s.monHocId} value={s.monHocId}>{s.tenMon}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowClassifyModal(false)} disabled={classifying}>
              Hủy
            </Button>
            <Button onClick={handleSaveClassification} disabled={classifying}>
              {classifying ? 'Đang lưu...' : 'Lưu phân loại'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
