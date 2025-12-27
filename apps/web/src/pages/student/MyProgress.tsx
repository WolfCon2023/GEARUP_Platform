import { useQuery } from '@tanstack/react-query';
import { dashboardsAPI } from '../../lib/api';
import ProgressRing from '../../components/ProgressRing';

export default function MyProgress() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => dashboardsAPI.student(),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading progress...</div>;
  }

  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Progress</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <ProgressRing progress={(dashboard?.modules_completed || 0) * 10} />
          <p className="mt-4 font-semibold">Modules Completed</p>
          <p className="text-2xl">{dashboard?.modules_completed || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <ProgressRing progress={(dashboard?.modules_in_progress || 0) * 20} />
          <p className="mt-4 font-semibold">In Progress</p>
          <p className="text-2xl">{dashboard?.modules_in_progress || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-3xl font-bold">{dashboard?.assignments_pending || 0}</p>
          <p className="mt-2 font-semibold">Pending Assignments</p>
        </div>
      </div>

      {dashboard?.milestones && Object.keys(dashboard.milestones).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Milestones</h2>
          <div className="space-y-2">
            {Object.entries(dashboard.milestones).map(([grade, data]: [string, any]) => (
              <div key={grade} className="border-b pb-2">
                <p className="font-semibold">Grade {grade}</p>
                <p className="text-sm text-gray-600">
                  {data.completed_modules || 0} modules completed
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

