import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { modulesAPI } from '../../lib/api';
import { cacheStore } from '../../store/offlineStore';
import ModuleCard from '../../components/ModuleCard';

export default function ModuleLibrary() {
  const [filters, setFilters] = useState({ grade: '', subject: '', pillar: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['modules', filters],
    queryFn: async () => {
      // Check cache first
      const cached = await cacheStore.getCachedModules();
      if (cached) {
        return { data: cached };
      }
      
      // Fetch from API
      const result = await modulesAPI.getAll({ published: true, ...filters });
      if (result.data) {
        await cacheStore.cacheModules(result.data);
      }
      return result;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Module Library</h1>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Subjects</option>
            <option value="College Readiness">College Readiness</option>
            <option value="Financial Aid">Financial Aid</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading modules...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((module: any) => (
            <ModuleCard key={module.module_id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}

