interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
}

export default function ProgressRing({ progress, size = 100 }: ProgressRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary-600 transition-all duration-300"
        />
      </svg>
      <span className="absolute text-lg font-semibold">{Math.round(progress)}%</span>
    </div>
  );
}

