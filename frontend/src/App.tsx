import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Auth
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForceChangePassword from './pages/auth/ForceChangePassword';
import SelectChild from './pages/auth/SelectChild';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTickets from './pages/admin/Tickets';
import AdminImport from './pages/admin/ExcelImport';
import AdminClasses from './pages/admin/Classes';
import ClassDetails from './pages/admin/ClassDetails';
import AdminSettings from './pages/admin/Settings';

// Pages - Teacher
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/Classes';
import TeacherClassDetails from './pages/teacher/ClassDetails';
import TeacherMaterials from './pages/teacher/Materials';
import TeacherMaterialDetail from './pages/teacher/MaterialDetail';
import BoSachLessonDetail from './pages/teacher/BoSachLessonDetail';
import TeacherAssignments from './pages/teacher/Assignments';
import QuizAuthoring from './pages/teacher/QuizAuthoring';
import TeacherKetQuaCuoiNam from './pages/teacher/KetQuaCuoiNam';
import AdminKetQuaCuoiNam from './pages/admin/KetQuaCuoiNam';
import TeacherGrading from './pages/teacher/Grading';
import TeacherGradingDetail from './pages/teacher/GradingDetail';
import TeacherReports from './pages/teacher/Reports';
import TeacherAnnouncements from './pages/teacher/Announcements';
import TeacherEditor from './pages/teacher/Editor';
import TeacherTickets from './pages/teacher/Tickets';
import TeacherProfile from './pages/teacher/Profile';

// Pages - Parent
import ParentDashboard from './pages/parent/Dashboard';
import ParentChildren from './pages/parent/Children';
import ParentGrades from './pages/parent/Grades';
import ParentAssignments from './pages/parent/Assignments';
import ParentNotifications from './pages/parent/Notifications';
import ParentRewards from './pages/parent/Rewards';
import ParentSubjectTree from './pages/parent/SubjectTree';
import ParentProfile from './pages/parent/Profile';

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
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="import" element={<AdminImport />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="classes/:id" element={<ClassDetails />} />
          <Route path="quiz-authoring" element={<QuizAuthoring />} />
          <Route path="ket-qua-cuoi-nam" element={<AdminKetQuaCuoiNam />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<DashboardLayout role="teacher" />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="classes/:classId" element={<TeacherClassDetails />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="materials" element={<TeacherMaterials />} />
          <Route path="materials/bo-sach/:baiHocId" element={<BoSachLessonDetail />} />
          <Route path="materials/:materialId" element={<TeacherMaterialDetail />} />
          <Route path="editor" element={<TeacherEditor />} />
          <Route path="editor/:contentId" element={<TeacherEditor />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="quiz-authoring" element={<QuizAuthoring />} />
          <Route path="ket-qua-cuoi-nam" element={<TeacherKetQuaCuoiNam />} />
          <Route path="grading" element={<TeacherGrading />} />
          <Route path="grading/:submissionId" element={<TeacherGradingDetail />} />
          <Route path="reports" element={<TeacherReports />} />
          <Route path="tickets" element={<TeacherTickets />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Parent Routes */}
        <Route path="/parent" element={<DashboardLayout role="parent" />}>
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
