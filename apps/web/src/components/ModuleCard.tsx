import { Link } from 'react-router-dom';

interface ModuleCardProps {
  module: {
    module_id: string;
    title: string;
    grade: string;
    subject: string;
    estimated_time_minutes: number;
  };
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
      <p className="text-sm text-gray-600 mb-2">Grade {module.grade} • {module.subject}</p>
      <p className="text-sm text-gray-500 mb-4">{module.estimated_time_minutes} minutes</p>
      <Link
        to={`/student/module/${module.module_id}`}
        className="text-primary-600 hover:text-primary-800 font-medium"
      >
        Open Module →
      </Link>
    </div>
  );
}



