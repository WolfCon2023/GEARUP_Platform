interface APRDataTableProps {
  data: any[];
}

export default function APRDataTable({ data }: APRDataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">FAFSA</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.student_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.grade}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.completion_rate}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{row.fafsa_completed ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



