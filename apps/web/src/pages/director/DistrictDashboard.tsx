import { useQuery } from '@tanstack/react-query';
import { dashboardsAPI } from '../../lib/api';

export default function DistrictDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['district-dashboard'],
    queryFn: () => dashboardsAPI.district(),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">District Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Students Served</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard?.students_served || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Schools</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard?.schools_active || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {dashboard?.completion_metrics?.completion_rate?.toFixed(1) || 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">FAFSA Completion</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {dashboard?.fafsa_completion?.completion_rate?.toFixed(1) || 0}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Completion Metrics</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Modules Assigned</span>
            <span className="font-semibold">{dashboard?.completion_metrics?.total_modules_assigned || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Modules Completed</span>
            <span className="font-semibold">{dashboard?.completion_metrics?.modules_completed || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Time per Module</span>
            <span className="font-semibold">{dashboard?.completion_metrics?.average_time_per_module?.toFixed(0) || 0} min</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">APR Readiness</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Data Completeness</span>
            <span className="font-semibold">{dashboard?.apr_readiness?.data_completeness || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span>Missing Demographics</span>
            <span className="font-semibold">{dashboard?.apr_readiness?.missing_demographics || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Missing Parent Contacts</span>
            <span className="font-semibold">{dashboard?.apr_readiness?.missing_parent_contacts || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

