import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsAPI } from '../../lib/api';

export default function AlertsMessages() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertsAPI.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => alertsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const handleAcknowledge = (alertId: string) => {
    updateMutation.mutate({
      id: alertId,
      data: {
        response_status: 'acknowledged',
        read_at: new Date().toISOString(),
      },
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading alerts...</div>;
  }

  const alerts = data?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Alerts & Messages</h1>
      
      <div className="space-y-4">
        {alerts.map((alert: any) => (
          <div
            key={alert.alert_id}
            className={`bg-white p-6 rounded-lg shadow border-l-4 ${
              alert.priority === 'urgent' ? 'border-red-500' :
              alert.priority === 'high' ? 'border-orange-500' :
              'border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{alert.alert_type}</p>
                <p className="text-gray-700 mt-2">{alert.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(alert.sent_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {alert.response_status === 'pending' && (
                  <button
                    onClick={() => handleAcknowledge(alert.alert_id)}
                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    Acknowledge
                  </button>
                )}
                <span className={`px-3 py-1 rounded text-sm ${
                  alert.response_status === 'acknowledged' ? 'bg-green-100 text-green-800' :
                  alert.response_status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {alert.response_status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

