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
import ClassDetails from './pages/admin/AdminClassDetail';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminAcademics from './pages/admin/AdminAcademics';
import AdminOperations from './pages/admin/AdminOperations';
import AdminThongBao from './pages/admin/AdminThongBao';

// Pages - Teacher
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/MyClasses';
import TeacherClassDetails from './pages/teacher/ClassDetail';
import TeacherCreateAssignment from './pages/teacher/CreateAssignment';
import MaterialWorkspaceLayout from './layouts/MaterialWorkspaceLayout';
import TeacherMaterials from './pages/teacher/Materials';
import TeacherMaterialDetail from './pages/teacher/MaterialDetail';
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
import ParentNotifications from './pages/parent/ParentNotifications';
import ParentRewards from './pages/parent/ParentAchievements';
import ParentSubjectTree from './pages/parent/SubjectTree';
import ParentSupport from './pages/parent/ParentSupport';
import ParentProfile from './pages/parent/ParentProfile';

// Pages - Student (Bright Theme)
import StudentLayout from './layouts/StudentLayout';
import DashboardRouter from './pages/student/DashboardRouter';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentGameWorkspace from './pages/student/StudentGameWorkspace';
import StudentMatchGame from './pages/student/StudentMatchGame';
import StudentFillBlankGame from './pages/student/StudentFillBlankGame';
import StudentLibrary from './pages/student/StudentLibrary';
import StudentBookRoadmap from './pages/student/StudentBookRoadmap';
import StudentBookReader from './pages/student/StudentBookReader';
import StudentEssayWorkspace from './pages/student/StudentEssayWorkspace';
import StudentExamWorkspace from './pages/student/StudentExamWorkspace';
import TrophyRouter from './pages/student/TrophyRouter';

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
          <Route index element={<DashboardRouter />} />
          <Route path="game" element={<StudentGameWorkspace />} />
          <Route path="match-game" element={<StudentMatchGame />} />
          <Route path="fill-blank" element={<StudentFillBlankGame />} />
          <Route path="library" element={<StudentLibrary />} />
          <Route path="roadmap" element={<StudentBookRoadmap />} />
          <Route path="book-reader" element={<StudentBookReader />} />
          <Route path="essay" element={<StudentEssayWorkspace />} />
          <Route path="exam" element={<StudentExamWorkspace />} />
          <Route path="trophy" element={<TrophyRouter />} />
          
          {/* Legacy Routes (Keep for compatibility if needed) */}
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
          <Route path="users/:userId" element={<AdminUserDetail />} />
          <Route path="classes/:id" element={<ClassDetails />} />
          <Route path="academics" element={<AdminAcademics />} />
          <Route path="operations" element={<AdminOperations />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="announcements" element={<AdminThongBao />} />
        </Route>

          {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="classes/:classId" element={<TeacherClassDetails />} />
          <Route path="classes/:classId/grades" element={<TeacherReports />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          
          <Route path="materials" element={<MaterialWorkspaceLayout />}>
            <Route index element={<Navigate to="library" replace />} />
            <Route path="library" element={<TeacherMaterials />} />
            <Route path="library/:materialId" element={<TeacherMaterialDetail />} />
            <Route path="assignments" element={<TeacherCreateAssignment />} />
            <Route path="grading" element={<TeacherGrading />} />
            <Route path="grading/:submissionId" element={<TeacherGradingDetail />} />
          </Route>
          
          <Route path="editor" element={<TeacherEditor />} />
          <Route path="editor/:contentId" element={<TeacherEditor />} />
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
          <Route path="support" element={<ParentSupport />} />
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
