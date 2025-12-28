export default function Gradebook() {
  // Placeholder data
  const grades = [
    {
      student_id: 'student_001',
      student_name: 'Jane Student',
      module_id: 'module_001',
      exit_ticket_score: 90,
      quiz_score: 85,
      project_score: null,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gradebook</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grades.map((grade) => (
              <tr key={grade.student_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{grade.student_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{grade.exit_ticket_score || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{grade.quiz_score || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {grade.project_score || (
                    <button className="text-primary-600 hover:text-primary-800">Grade</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



