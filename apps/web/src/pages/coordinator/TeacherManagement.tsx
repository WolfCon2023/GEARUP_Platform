export default function TeacherManagement() {
  // Placeholder - in production, this would fetch teachers from API
  const teachers = [
    { user_id: 'teacher_001', first_name: 'John', last_name: 'Teacher', email: 'teacher@northstar.edu' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Teacher Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.user_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {teacher.first_name} {teacher.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-primary-600 hover:text-primary-800">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



