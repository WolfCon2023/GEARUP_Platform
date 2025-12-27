// User and Auth Types
export type UserRole = 'state_director' | 'school_coordinator' | 'teacher' | 'student' | 'parent';

export interface User {
  user_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  district_id?: string;
  school_id?: string;
  classes_taught?: string[];
  children?: string[]; // student_ids for parents
  permissions?: Record<string, boolean>;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  user_id: string;
  email: string;
  role: UserRole;
  district_id?: string;
  school_id?: string;
}

// Module Types
export interface Chapter {
  chapter_number: number;
  title: string;
  content: string; // HTML
  activities?: string[]; // HTML
}

export interface Question {
  question_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'short_answer' | 'essay';
  options?: string[];
  correct_answer?: string;
  points: number;
}

export interface ExitTicket {
  questions: Question[];
}

export interface Quiz {
  questions: Question[];
}

export interface Project {
  title: string;
  description: string;
  rubric: {
    criteria: Array<{
      criterion: string;
      points: number;
      description: string;
    }>;
  };
}

export interface Module {
  module_id: string;
  title: string;
  grade: string;
  subject: string;
  pillar: string;
  word_count: number;
  estimated_time_minutes: number;
  student_content: {
    introduction: string; // HTML
    chapters: Chapter[];
    summary: string; // HTML
    readiness_accelerator?: string; // HTML
  };
  teacher_guide: {
    objectives: string[];
    materials: string[];
    time_breakdown: string;
    instructional_steps: string[];
    differentiation: string;
    common_misconceptions: string[];
  };
  assessments: {
    exit_ticket: ExitTicket;
    quiz: Quiz;
    project: Project;
  };
  federal_alignment: {
    gear_up_objective: string;
    standards: string[];
  };
  published: boolean;
  version: number;
  created_at: Date;
  updated_at: Date;
}

// Student Types
export interface Demographics {
  race_ethnicity?: string[];
  gender?: string;
  first_generation?: boolean;
  low_income?: boolean;
  [key: string]: any;
}

export interface ParentContact {
  parent_id: string;
  relationship: string;
  email?: string;
  phone?: string;
  opt_in_alerts: boolean;
  opt_in_messages: boolean;
}

export interface ModuleProgressEntry {
  module_id: string;
  started_at: Date;
  completed_at?: Date;
  time_spent_minutes: number;
  chapters_completed: number[];
  exit_ticket_score?: number;
  quiz_score?: number;
  project_submitted?: boolean;
  project_score?: number;
  last_accessed_at: Date;
}

export interface Milestones {
  [grade: string]: {
    completed_modules: number;
    badges: string[];
    achievements: string[];
  };
}

export interface FAFSACompletion {
  completed: boolean;
  completed_date?: Date;
  notes?: string;
}

export interface Student {
  student_id: string;
  school_id: string;
  district_id: string;
  first_name: string;
  last_name: string;
  grade: string;
  cohort_year: number;
  demographics: Demographics;
  parent_contacts: ParentContact[];
  modules_completed: string[]; // module_ids
  modules_in_progress: string[]; // module_ids
  module_progress: ModuleProgressEntry[];
  milestones: Milestones;
  fafsa_completion: FAFSACompletion;
  created_at: Date;
  updated_at: Date;
}

// School Types
export interface CompletionMetrics {
  total_modules_assigned: number;
  modules_completed: number;
  completion_rate: number;
  average_time_per_module: number;
}

export interface EquityMetrics {
  by_demographic: Record<string, {
    completion_rate: number;
    average_score: number;
  }>;
  gaps_identified: string[];
}

export interface TeacherEngagement {
  active_teachers: number;
  assignments_created: number;
  average_grading_time_hours: number;
}

export interface School {
  school_id: string;
  district_id: string;
  state_director_id: string;
  school_name: string;
  coordinator: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  grades_served: string[];
  cohorts: number[];
  counts: {
    students: number;
    teachers: number;
    classes: number;
  };
  completion_metrics: CompletionMetrics;
  equity_metrics: EquityMetrics;
  teacher_engagement: TeacherEngagement;
  created_at: Date;
  updated_at: Date;
}

// Assignment Types
export type AssignedToType = 'student' | 'class' | 'cohort';

export interface Assignment {
  assignment_id: string;
  module_id: string;
  assigned_by: string; // user_id
  assigned_to_type: AssignedToType;
  assigned_to_ids: string[];
  school_id: string;
  grade?: string;
  assigned_date: Date;
  due_date: Date;
  instructions?: string;
  completion_status?: {
    total: number;
    completed: number;
    in_progress: number;
    not_started: number;
  };
  created_at: Date;
  updated_at: Date;
}

// Alert Types
export type AlertType = 'academic' | 'attendance' | 'behavior' | 'milestone' | 'system';
export type AlertPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ResponseStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed';
export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface Alert {
  alert_id: string;
  student_id: string;
  parent_id?: string;
  alert_type: AlertType;
  message: string;
  priority: AlertPriority;
  sent_at: Date;
  read_at?: Date;
  response_status: ResponseStatus;
  delivery_status: DeliveryStatus;
  created_at: Date;
  updated_at: Date;
}

// Dashboard Types
export interface DistrictDashboard {
  district_id: string;
  month: string; // YYYY-MM
  students_served: number;
  schools_active: number;
  completion_metrics: CompletionMetrics;
  equity_metrics: EquityMetrics;
  fafsa_completion: {
    total_eligible: number;
    completed: number;
    completion_rate: number;
  };
  apr_readiness: {
    data_completeness: number;
    missing_demographics: number;
    missing_parent_contacts: number;
    missing_scores: number;
  };
  generated_at: Date;
}

// Progress Update Actions
export type ProgressAction =
  | 'start_module'
  | 'complete_chapter'
  | 'submit_exit_ticket'
  | 'submit_quiz'
  | 'submit_project';

export interface ProgressUpdateRequest {
  action: ProgressAction;
  student_id: string;
  module_id: string;
  chapter_number?: number;
  time_spent_minutes?: number;
  exit_ticket_answers?: Record<string, any>;
  quiz_answers?: Record<string, any>;
  project_submission?: {
    rubric_scores: Record<string, number>;
    notes?: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

