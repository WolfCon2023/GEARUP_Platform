import { useQuery } from '@tanstack/react-query';
import { dashboardsAPI } from '../../lib/api';
import ProgressRing from '../../components/ProgressRing';

export default function ChildDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['parent-dashboard'],
    queryFn: () => dashboardsAPI.parent(),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Child Dashboard</h1>
      
      {dashboard?.children?.map((child: any) => (
        <div key={child.student_id} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            {child.first_name} {child.last_name} - Grade {child.grade}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Modules Completed</p>
              <p className="text-2xl font-bold">{child.modules_completed || 0}</p>
            </div>
            <div>
              <ProgressRing progress={child.modules_completed * 10} />
            </div>
          </div>

          {child.recent_scores && child.recent_scores.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Recent Scores</h3>
              <div className="space-y-2">
                {child.recent_scores.map((score: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>Module {score.module_id}</span>
                    <span className="font-semibold">{score.quiz_score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}



