import { useQuery } from '@tanstack/react-query';
import { dashboardsAPI } from '../../lib/api';

export default function SchoolDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['school-dashboard'],
    queryFn: () => dashboardsAPI.school(),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">School Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Students</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard?.students_count || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Assignments</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard?.assignments_count || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Alerts</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard?.active_alerts || 0}</p>
        </div>
      </div>

      {dashboard?.school && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">School Information</h2>
          <p className="text-lg">{dashboard.school.school_name}</p>
          <p className="text-sm text-gray-600">Grades: {dashboard.school.grades_served?.join(', ')}</p>
        </div>
      )}
    </div>
  );
}



