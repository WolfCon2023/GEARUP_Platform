import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { assignmentsAPI } from '../../lib/api';
import StudentCard from '../../components/StudentCard';

export default function ClassRoster() {
  const { data, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentsAPI.getAll(),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // In production, this would fetch actual students from assignments
  const students = [
    { student_id: 'student_001', first_name: 'Jane', last_name: 'Student', grade: '10' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Class Roster</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Link key={student.student_id} to={`/teacher/student/${student.student_id}`}>
            <StudentCard student={student} />
          </Link>
        ))}
      </div>
    </div>
  );
}



