import { z } from 'zod';

// User Schemas
export const UserRoleSchema = z.enum(['state_director', 'school_coordinator', 'teacher', 'student', 'parent']);

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: UserRoleSchema,
  district_id: z.string().optional(),
  school_id: z.string().optional(),
  classes_taught: z.array(z.string()).optional(),
  children: z.array(z.string()).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Module Schemas
export const ChapterSchema = z.object({
  chapter_number: z.number(),
  title: z.string(),
  content: z.string(),
  activities: z.array(z.string()).optional(),
});

export const QuestionSchema = z.object({
  question_id: z.string(),
  question_text: z.string(),
  question_type: z.enum(['multiple_choice', 'short_answer', 'essay']),
  options: z.array(z.string()).optional(),
  correct_answer: z.string().optional(),
  points: z.number(),
});

export const ExitTicketSchema = z.object({
  questions: z.array(QuestionSchema),
});

export const QuizSchema = z.object({
  questions: z.array(QuestionSchema),
});

export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  rubric: z.object({
    criteria: z.array(z.object({
      criterion: z.string(),
      points: z.number(),
      description: z.string(),
    })),
  }),
});

export const ModuleCreateSchema = z.object({
  module_id: z.string(),
  title: z.string().min(1),
  grade: z.string(),
  subject: z.string(),
  pillar: z.string(),
  word_count: z.number(),
  estimated_time_minutes: z.number(),
  student_content: z.object({
    introduction: z.string(),
    chapters: z.array(ChapterSchema),
    summary: z.string(),
    readiness_accelerator: z.string().optional(),
  }),
  teacher_guide: z.object({
    objectives: z.array(z.string()),
    materials: z.array(z.string()),
    time_breakdown: z.string(),
    instructional_steps: z.array(z.string()),
    differentiation: z.string(),
    common_misconceptions: z.array(z.string()),
  }),
  assessments: z.object({
    exit_ticket: ExitTicketSchema,
    quiz: QuizSchema,
    project: ProjectSchema,
  }),
  federal_alignment: z.object({
    gear_up_objective: z.string(),
    standards: z.array(z.string()),
  }),
  published: z.boolean().default(false),
  version: z.number().default(1),
});

export const ModuleUpdateSchema = ModuleCreateSchema.partial();

export const ModuleQuerySchema = z.object({
  grade: z.string().optional(),
  subject: z.string().optional(),
  pillar: z.string().optional(),
  published: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

// Assignment Schemas
export const AssignmentCreateSchema = z.object({
  module_id: z.string(),
  assigned_to_type: z.enum(['student', 'class', 'cohort']),
  assigned_to_ids: z.array(z.string()).min(1),
  school_id: z.string(),
  grade: z.string().optional(),
  assigned_date: z.string().transform(str => new Date(str)),
  due_date: z.string().transform(str => new Date(str)),
  instructions: z.string().optional(),
});

export const AssignmentUpdateSchema = AssignmentCreateSchema.partial();

export const AssignmentQuerySchema = z.object({
  school_id: z.string().optional(),
  teacher_id: z.string().optional(),
  student_id: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

// Progress Update Schema
export const ProgressUpdateSchema = z.object({
  action: z.enum(['start_module', 'complete_chapter', 'submit_exit_ticket', 'submit_quiz', 'submit_project']),
  student_id: z.string(),
  module_id: z.string(),
  chapter_number: z.number().optional(),
  time_spent_minutes: z.number().optional(),
  exit_ticket_answers: z.record(z.any()).optional(),
  quiz_answers: z.record(z.any()).optional(),
  project_submission: z.object({
    rubric_scores: z.record(z.number()),
    notes: z.string().optional(),
  }).optional(),
});

// Alert Schemas
export const AlertCreateSchema = z.object({
  student_id: z.string(),
  parent_id: z.string().optional(),
  alert_type: z.enum(['academic', 'attendance', 'behavior', 'milestone', 'system']),
  message: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const AlertUpdateSchema = z.object({
  read_at: z.string().transform(str => new Date(str)).optional(),
  response_status: z.enum(['pending', 'acknowledged', 'resolved', 'dismissed']).optional(),
});

export const AlertQuerySchema = z.object({
  student_id: z.string().optional(),
  parent_id: z.string().optional(),
  alert_type: z.string().optional(),
  priority: z.string().optional(),
  response_status: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

// Report Query Schemas
export const APRReportQuerySchema = z.object({
  year: z.string(),
  district: z.string().optional(),
});

export const DataCompletenessQuerySchema = z.object({
  district: z.string().optional(),
});

