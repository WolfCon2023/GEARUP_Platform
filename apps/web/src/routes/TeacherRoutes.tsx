import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ClassRoster from '../pages/teacher/ClassRoster';
import ModuleAssignment from '../pages/teacher/ModuleAssignment';
import StudentDetail from '../pages/teacher/StudentDetail';
import Gradebook from '../pages/teacher/Gradebook';

export default function TeacherRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ClassRoster />} />
        <Route path="/assign" element={<ModuleAssignment />} />
        <Route path="/student/:studentId" element={<StudentDetail />} />
        <Route path="/gradebook" element={<Gradebook />} />
        <Route path="*" element={<Navigate to="/teacher" />} />
      </Routes>
    </Layout>
  );
}



