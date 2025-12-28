import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesAPI, assignmentsAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function ModuleAssignment() {
  const [selectedModule, setSelectedModule] = useState('');
  const [assignedToType, setAssignedToType] = useState<'student' | 'class' | 'cohort'>('student');
  const [assignedToIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: modulesData } = useQuery({
    queryKey: ['modules'],
    queryFn: () => modulesAPI.getAll({ published: true }),
  });

  const createMutation = useMutation({
    mutationFn: assignmentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      alert('Assignment created successfully!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.school_id) {
      alert('School ID required');
      return;
    }

    createMutation.mutate({
      module_id: selectedModule,
      assigned_to_type: assignedToType,
      assigned_to_ids: assignedToIds,
      school_id: user.school_id,
      assigned_date: new Date().toISOString(),
      due_date: dueDate,
      instructions,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Module Assignment</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select a module</option>
            {modulesData?.data?.map((m: any) => (
              <option key={m.module_id} value={m.module_id}>{m.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
          <select
            value={assignedToType}
            onChange={(e) => setAssignedToType(e.target.value as any)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="class">Class</option>
            <option value="cohort">Cohort</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Assignment'}
        </button>
      </form>
    </div>
  );
}



