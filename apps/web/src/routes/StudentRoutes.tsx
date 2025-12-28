import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ModuleLibrary from '../pages/student/ModuleLibrary';
import ModuleReader from '../pages/student/ModuleReader';
import MyProgress from '../pages/student/MyProgress';

export default function StudentRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ModuleLibrary />} />
        <Route path="/module/:moduleId" element={<ModuleReader />} />
        <Route path="/progress" element={<MyProgress />} />
        <Route path="*" element={<Navigate to="/student" />} />
      </Routes>
    </Layout>
  );
}



