import { useState } from 'react';

export default function SchoolComparison() {
  const [filters, setFilters] = useState({ grade: '', subject: '' });

  // In production, this would fetch schools data
  const schools = [
    { school_id: 'school_001', school_name: 'North Star High School', completion_rate: 75, students: 150 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">School Comparison</h1>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 mb-4">
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.school_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{school.school_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{school.students}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{school.completion_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



