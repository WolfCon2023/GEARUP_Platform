import { useState } from 'react';

interface QuizPlayerProps {
  questions: Array<{
    question_id: string;
    question_text: string;
    question_type: string;
    options?: string[];
    points: number;
  }>;
  onSubmit: (answers: Record<string, any>) => void;
}

export default function QuizPlayer({ questions, onSubmit }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <div key={question.question_id} className="bg-white p-4 rounded-lg shadow">
          <p className="font-semibold mb-2">{question.question_text}</p>
          {question.question_type === 'multiple_choice' && question.options ? (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="radio"
                    name={question.question_id}
                    value={option}
                    onChange={(e) => setAnswers({ ...answers, [question.question_id]: e.target.value })}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              value={answers[question.question_id] || ''}
              onChange={(e) => setAnswers({ ...answers, [question.question_id]: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Submit Quiz
      </button>
    </form>
  );
}

