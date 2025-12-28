import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DistrictDashboard from '../pages/director/DistrictDashboard';
import SchoolComparison from '../pages/director/SchoolComparison';
import APRExport from '../pages/director/APRExport';
import EquityHeatmap from '../pages/director/EquityHeatmap';

export default function StateDirectorRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DistrictDashboard />} />
        <Route path="/schools" element={<SchoolComparison />} />
        <Route path="/apr" element={<APRExport />} />
        <Route path="/equity" element={<EquityHeatmap />} />
        <Route path="*" element={<Navigate to="/director" />} />
      </Routes>
    </Layout>
  );
}



