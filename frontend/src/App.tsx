import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import ParentLayout from './layouts/ParentLayout';

// Pages - Auth
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForceChangePassword from './pages/auth/ForceChangePassword';
import SelectChild from './pages/auth/SelectChild';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTickets from './pages/admin/AdminSupport';
import AdminClasses from './pages/admin/AdminClasses';
import ClassDetails from './pages/admin/AdminClassDetail';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCurriculum from './pages/admin/Curriculum';

// Pages - Teacher
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/MyClasses';
import TeacherClassDetails from './pages/teacher/ClassDetail';
import TeacherMaterials from './pages/teacher/Materials';
import TeacherMaterialDetail from './pages/teacher/MaterialDetail';
import TeacherKetQuaCuoiNam from './pages/teacher/KetQuaCuoiNam';
import AdminKetQuaCuoiNam from './pages/admin/KetQuaCuoiNam';
import TeacherGrading from './pages/teacher/GradingWorkspace';
import TeacherGradingDetail from './pages/teacher/GradingDetail';
import TeacherReports from './pages/teacher/Gradebook';
import TeacherAnnouncements from './pages/teacher/Announcements';
import TeacherEditor from './pages/teacher/Editor';
import TeacherTickets from './pages/teacher/Notifications';
import TeacherProfile from './pages/teacher/TeacherProfile';

// Pages - Parent
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentChildren from './pages/parent/ParentAchievements';
import ParentGrades from './pages/parent/ParentGrades';
import ParentAssignments from './pages/parent/ParentAssignments';
import ParentNotifications from './pages/parent/ParentSupport';
import ParentRewards from './pages/parent/ParentAchievements';
import ParentSubjectTree from './pages/parent/SubjectTree';
import ParentProfile from './pages/parent/ParentSupport';

// Pages - Student (Bright Theme)
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import SubjectTree from './pages/student/SubjectTree';
import AdventureMap from './pages/student/AdventureMap';
import LessonPlayer from './pages/student/LessonPlayer';
import AssignmentH5PPlayer from './pages/student/AssignmentH5PPlayer';
import AssignmentQuizPlayer from './pages/student/AssignmentQuizPlayer';
import StudentRewards from './pages/student/Rewards';
import StudentAssignments from './pages/student/Assignments';
import StudentNotifications from './pages/student/Notifications';
import StudentProfile from './pages/student/Profile';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/force-change-password" element={<ForceChangePassword />} />
          <Route path="/select-child" element={<SelectChild />} />
        </Route>

        {/* Student Routes (Bright Theme) */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="subject/:subjectId" element={<SubjectTree />} />
          <Route path="subject/:subjectId/map" element={<AdventureMap />} />
          <Route path="lesson/:lessonId" element={<LessonPlayer />} />
          <Route path="rewards" element={<StudentRewards />} />
          <Route path="tasks" element={<StudentAssignments />} />
          <Route path="tasks/:assignmentId/play" element={<AssignmentH5PPlayer />} />
          <Route path="tasks/:assignmentId/quiz" element={<AssignmentQuizPlayer />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="classes/:id" element={<ClassDetails />} />
          <Route path="curriculum" element={<AdminCurriculum />} />
          <Route path="ket-qua-cuoi-nam" element={<AdminKetQuaCuoiNam />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="classes/:classId" element={<TeacherClassDetails />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="materials" element={<TeacherMaterials />} />
          <Route path="materials/:materialId" element={<TeacherMaterialDetail />} />
          <Route path="editor" element={<TeacherEditor />} />
          <Route path="editor/:contentId" element={<TeacherEditor />} />
          <Route path="ket-qua-cuoi-nam" element={<TeacherKetQuaCuoiNam />} />
          <Route path="grading" element={<TeacherGrading />} />
          <Route path="grading/:submissionId" element={<TeacherGradingDetail />} />
          <Route path="reports" element={<TeacherReports />} />
          <Route path="tickets" element={<TeacherTickets />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Parent Routes */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="children" element={<ParentChildren />} />
          <Route path="grades" element={<ParentGrades />} />
          <Route path="assignments" element={<ParentAssignments />} />
          <Route path="notifications" element={<ParentNotifications />} />
          <Route path="rewards" element={<ParentRewards />} />
          <Route path="subject-tree" element={<ParentSubjectTree />} />
          <Route path="profile" element={<ParentProfile />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
