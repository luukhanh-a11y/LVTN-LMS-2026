import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, PlayCircle, Maximize2, Minimize2, Eye, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import H5PEditor, { type H5PEditorHandle } from '../../components/h5p/H5PEditor';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { teacherService, type Subject } from '../../services/teacher.service';
import { GRADES } from '../../constants';
import { ExerciseSuggestionsPanel } from './components/ExerciseSuggestionsPanel';

export default function TeacherEditor() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<H5PEditorHandle>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewContentId, setPreviewContentId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grade, setGrade] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const isNew = !contentId;

  useEffect(() => {
    teacherService.getSubjects().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    if (isNew && (!grade || !subjectId)) {
      toast.error('Vui lòng chọn Khối và Môn học trước khi lưu.');
      return;
    }
    setSaving(true);
    try {
      const result = await editorRef.current.save();
      setHasUnsavedChanges(false);
      toast.success('Đã lưu học liệu H5P thành công!');
      setPreviewContentId(result.contentId);
    } catch (error: any) {
      toast.error(error?.message ?? 'Lưu học liệu thất bại, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
      return;
    }
    navigate(-1);
  };

  // H5P web component không phát sự kiện "nội dung thay đổi" riêng (chỉ có
  // editorloaded/saved) — nên đánh dấu "chưa lưu" dựa trên tương tác thật
  // của người dùng bên trong khung soạn thảo, thay vì lúc editor vừa tải xong.
  const handleEditorInteraction = () => setHasUnsavedChanges(true);

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-40 bg-white overflow-y-auto p-4 space-y-4' : 'space-y-4'}>
      <div className={isFullscreen ? 'flex justify-between items-center sticky top-0 bg-white z-10 pb-2' : 'flex justify-between items-center'}>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <PlayCircle className="w-6 h-6 mr-2 text-pro-primary" />
          {contentId ? 'Sửa Bài giảng H5P' : 'Soạn Bài giảng H5P'}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsFullscreen((f) => !f)}>
            {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            {isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button variant="pro-primary" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Đang lưu...' : 'Lưu học liệu'}
          </Button>
        </div>
      </div>

      {isNew && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 max-w-[1040px] mx-auto flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Khối <span className="text-red-500">*</span></label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="">-- Chọn Khối --</option>
              {GRADES.filter((g) => g.value !== 'all').map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Môn học <span className="text-red-500">*</span></label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">-- Chọn Môn học --</option>
              {subjects.map((s) => (
                <option key={s.monHocId} value={s.monHocId}>{s.tenMon}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={`flex gap-4 ${isFullscreen ? '' : 'max-w-[1360px] mx-auto'} items-start`}>
        {/* H5P tự giới hạn cứng nội dung trong iframe ở 960px — canh giữa thay vì để trống hai bên. */}
        <div
          className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 min-h-[70vh] max-w-[1040px] flex-1"
          onClickCapture={handleEditorInteraction}
          onInputCapture={handleEditorInteraction}
          onKeyDownCapture={handleEditorInteraction}
        >
          <H5PEditor
            ref={editorRef}
            contentId={contentId}
            grade={isNew && grade ? Number(grade) : undefined}
            subjectId={isNew && subjectId ? Number(subjectId) : undefined}
          />
        </div>

        {isNew && grade && subjectId && (
          <div className="w-[300px] shrink-0 sticky top-4">
            <ExerciseSuggestionsPanel grade={Number(grade)} subjectId={Number(subjectId)} />
          </div>
        )}
      </div>

      <Modal
        isOpen={!!previewContentId}
        onClose={() => {
          setPreviewContentId(null);
          navigate('/teacher/materials');
        }}
        title={
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-pro-primary" /> Xem trước học liệu vừa lưu
          </div>
        }
        widthClass="w-[90vw] max-w-4xl"
      >
        <div className="h-[70vh] p-4">
          {previewContentId && <H5PPlayer contentId={previewContentId} />}
        </div>
      </Modal>

      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title={
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Hủy soạn bài?
          </div>
        }
        widthClass="w-[420px]"
      >
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm">Nội dung chưa lưu sẽ mất. Bạn có chắc muốn hủy?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
              Tiếp tục soạn
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => navigate(-1)}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
