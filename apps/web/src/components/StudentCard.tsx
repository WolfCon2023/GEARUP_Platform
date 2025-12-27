interface StudentCardProps {
  student: {
    student_id: string;
    first_name: string;
    last_name: string;
    grade: string;
  };
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold">{student.first_name} {student.last_name}</h3>
      <p className="text-sm text-gray-600">Grade {student.grade}</p>
      <button className="mt-2 text-sm text-primary-600 hover:text-primary-800">
        View Details
      </button>
    </div>
  );
}

