import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MonitorPlay, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Components
import GameAuthoringForm from './components/GameAuthoringForm';
import QuizForm from '../../components/student/QuizForm';
import NoiCapForm from '../../components/student/NoiCapForm';
import TuLuanForm from '../../components/student/TuLuanForm';
import LyThuyetForm from '../../components/student/LyThuyetForm';

export default function AdminGameAuthoringWorkspace() {
  const { action, id } = useParams();
  const navigate = useNavigate();
  const [livePayload, setLivePayload] = useState<any>(null);

  const isNew = action === 'new';
  const baiHocId = isNew ? Number(id) : 0;
  const dangBaiId = !isNew ? Number(id) : 0;

  // Render the preview component based on the live payload
  const renderLivePreview = () => {
    if (!livePayload) {
      return (
        <div className="flex items-center justify-center h-full text-slate-400 p-8 text-center">
          <div>
            <MonitorPlay className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Bản xem trước sẽ hiển thị tại đây</p>
          </div>
        </div>
      );
    }

    let parsedDuLieuGame: any = {};
    let parsedDapAn: any = {};

    try { parsedDuLieuGame = JSON.parse(livePayload.duLieuGame); } catch(e) {}
    try { parsedDapAn = JSON.parse(livePayload.dapAnChuan); } catch(e) {}

    // Force MAC_DINH template for preview as requested
    parsedDuLieuGame.giaoDien = 'MAC_DINH';

    const loai = parsedDuLieuGame.loai || 'LY_THUYET';

    // Mock props for the student components
    const commonProps = {
      loai: loai,
      cauHinh: parsedDuLieuGame,
      dapAnChuan: parsedDapAn,
      result: null,
      onSubmit: (bl: any) => { console.log('Mock submit:', bl); },
      submitting: false
    };

    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full relative">
        {/* Fake Browser/Mobile Header */}
        <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div className="text-xs font-bold text-slate-500 mx-auto bg-white px-3 py-1 rounded-md shadow-sm border border-slate-200 flex items-center gap-2">
            <MonitorPlay className="w-3.5 h-3.5" />
            Live Preview (Giao diện Mặc Định)
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 [&_button[type='submit']]:!hidden">
          <div className="max-w-2xl mx-auto">
            {loai === 'TRAC_NGHIEM' || loai === 'DIEN_KHUYET' ? (
              <QuizForm {...commonProps} />
            ) : loai === 'NOI_CAP' ? (
              <NoiCapForm {...commonProps} />
            ) : loai === 'TU_LUAN' ? (
              <TuLuanForm {...commonProps} />
            ) : loai === 'LY_THUYET' ? (
              <LyThuyetForm {...commonProps} />
            ) : (
              <div className="text-center text-slate-500 py-10">Chưa hỗ trợ xem trước cho loại {loai}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/academics')} className="gap-2 text-slate-600">
            <ArrowLeft className="w-4 h-4" /> Quay lại Quản lý Học vụ
          </Button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            {isNew ? 'Thêm mới Bài tập / Học liệu' : 'Chỉnh sửa Bài tập / Học liệu'}
          </h1>
        </div>
      </header>

      {/* Main Workspace: Split View */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Pane: Live Preview */}
        <div className="h-[55vh] min-h-[500px] border-b border-slate-300 p-6 bg-slate-200/50 overflow-hidden shrink-0 shadow-inner">
          <div className="h-full w-full max-w-screen-2xl mx-auto">
            {renderLivePreview()}
          </div>
        </div>

        {/* Bottom Pane: Form Editor */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-5xl mx-auto">
            <GameAuthoringForm
              dangBaiId={dangBaiId}
              baiHocId={baiHocId}
              onSaveSuccess={() => navigate('/admin/academics')}
              onCancel={() => navigate('/admin/academics')}
              onPreviewUpdate={(payload) => setLivePayload(payload)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
