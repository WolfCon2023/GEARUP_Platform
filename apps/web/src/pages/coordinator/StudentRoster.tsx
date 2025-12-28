import { useState } from 'react';
import StudentCard from '../../components/StudentCard';

export default function StudentRoster() {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  // In production, this would fetch students from API
  const students = [
    { student_id: 'student_001', first_name: 'Jane', last_name: 'Student', grade: '10' },
  ];

  const filtered = students.filter(s => {
    const matchesSearch = !search || 
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = !gradeFilter || s.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Roster</h1>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((student) => (
          <StudentCard key={student.student_id} student={student} />
        ))}
      </div>
    </div>
  );
}



