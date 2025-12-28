import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesAPI, progressAPI } from '../../lib/api';
import { offlineStore } from '../../store/offlineStore';
import { useAuthStore } from '../../store/authStore';
import ChapterReader from '../../components/ChapterReader';

export default function ModuleReader() {
  const { moduleId } = useParams();
  const { user } = useAuthStore();
  const [currentChapter, setCurrentChapter] = useState(1);
  const queryClient = useQueryClient();

  const { data: moduleData } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => modulesAPI.getById(moduleId!),
  });

  const progressMutation = useMutation({
    mutationFn: progressAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
    },
  });

  const handleChapterComplete = async () => {
    if (!user || !moduleId) return;

    const updateData = {
      action: 'complete_chapter' as const,
      student_id: user.user_id,
      module_id: moduleId,
      chapter_number: currentChapter,
      time_spent_minutes: 10, // In production, track actual time
    };

    try {
      if (navigator.onLine) {
        await progressMutation.mutateAsync(updateData);
      } else {
        await offlineStore.queueAction({ type: 'progress_update', data: updateData });
      }
    } catch (error) {
      // Queue for retry if online
      await offlineStore.queueAction({ type: 'progress_update', data: updateData });
    }
  };

  const module = moduleData?.data;
  if (!module) {
    return <div className="text-center py-8">Loading module...</div>;
  }

  const chapter = module.student_content.chapters.find((c: any) => c.chapter_number === currentChapter);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{module.title}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Chapters</h2>
          <div className="flex gap-2">
            {module.student_content.chapters.map((ch: any) => (
              <button
                key={ch.chapter_number}
                onClick={() => setCurrentChapter(ch.chapter_number)}
                className={`px-4 py-2 rounded ${
                  currentChapter === ch.chapter_number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Chapter {ch.chapter_number}
              </button>
            ))}
          </div>
        </div>

        {chapter && (
          <ChapterReader
            chapter={chapter}
            onComplete={handleChapterComplete}
          />
        )}
      </div>
    </div>
  );
}

