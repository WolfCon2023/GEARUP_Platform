import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ChildDashboard from '../pages/parent/ChildDashboard';
import AlertsMessages from '../pages/parent/AlertsMessages';

export default function ParentRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ChildDashboard />} />
        <Route path="/alerts" element={<AlertsMessages />} />
        <Route path="*" element={<Navigate to="/parent" />} />
      </Routes>
    </Layout>
  );
}

