import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SchoolDashboard from '../pages/coordinator/SchoolDashboard';
import StudentRoster from '../pages/coordinator/StudentRoster';
import TeacherManagement from '../pages/coordinator/TeacherManagement';
import ParentCommunication from '../pages/coordinator/ParentCommunication';
import ProgressReports from '../pages/coordinator/ProgressReports';

export default function CoordinatorRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SchoolDashboard />} />
        <Route path="/students" element={<StudentRoster />} />
        <Route path="/teachers" element={<TeacherManagement />} />
        <Route path="/parents" element={<ParentCommunication />} />
        <Route path="/reports" element={<ProgressReports />} />
        <Route path="*" element={<Navigate to="/coordinator" />} />
      </Routes>
    </Layout>
  );
}

