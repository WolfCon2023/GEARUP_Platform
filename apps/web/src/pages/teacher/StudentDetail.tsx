import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { modulesAPI } from '../../lib/api';
import ProgressRing from '../../components/ProgressRing';

export default function StudentDetail() {
  const { studentId } = useParams();
  
  // In production, fetch student data
  const student = {
    student_id: studentId,
    first_name: 'Jane',
    last_name: 'Student',
    grade: '10',
    modules_completed: ['module_001'],
    modules_in_progress: [],
    module_progress: [
      {
        module_id: 'module_001',
        started_at: new Date(),
        completed_at: new Date(),
        time_spent_minutes: 60,
        quiz_score: 85,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {student.first_name} {student.last_name}
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Module History</h2>
        <div className="space-y-4">
          {student.module_progress.map((progress: any) => (
            <div key={progress.module_id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Module {progress.module_id}</p>
                  <p className="text-sm text-gray-600">
                    Time: {progress.time_spent_minutes} minutes
                  </p>
                </div>
                {progress.quiz_score !== undefined && (
                  <ProgressRing progress={progress.quiz_score} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



