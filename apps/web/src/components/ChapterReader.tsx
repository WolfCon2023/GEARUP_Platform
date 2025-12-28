interface ChapterReaderProps {
  chapter: {
    chapter_number: number;
    title: string;
    content: string;
    activities?: string[];
  };
  onComplete: () => void;
}

export default function ChapterReader({ chapter, onComplete }: ChapterReaderProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{chapter.title}</h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: chapter.content }}
      />
      
      {chapter.activities && chapter.activities.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Activities</h3>
          {chapter.activities.map((activity, idx) => (
            <div
              key={idx}
              className="mb-2"
              dangerouslySetInnerHTML={{ __html: activity }}
            />
          ))}
        </div>
      )}

      <button
        onClick={onComplete}
        className="mt-4 px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Mark Chapter Complete
      </button>
    </div>
  );
}



