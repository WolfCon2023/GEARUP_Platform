import mongoose, { Schema, Document } from 'mongoose';
import { Module as IModule } from '@northstar/shared';

export interface ModuleDocument extends Omit<IModule, 'module_id'>, Document {
  module_id: string;
}

const ChapterSchema = new Schema({
  chapter_number: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  activities: [String],
});

const QuestionSchema = new Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },
  question_type: { type: String, enum: ['multiple_choice', 'short_answer', 'essay'], required: true },
  options: [String],
  correct_answer: String,
  points: { type: Number, required: true },
});

const ExitTicketSchema = new Schema({
  questions: [QuestionSchema],
});

const QuizSchema = new Schema({
  questions: [QuestionSchema],
});

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rubric: {
    criteria: [{
      criterion: { type: String, required: true },
      points: { type: Number, required: true },
      description: { type: String, required: true },
    }],
  },
});

const ModuleSchema = new Schema<ModuleDocument>(
  {
    module_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    pillar: { type: String, required: true },
    word_count: { type: Number, required: true },
    estimated_time_minutes: { type: Number, required: true },
    student_content: {
      introduction: { type: String, required: true },
      chapters: [ChapterSchema],
      summary: { type: String, required: true },
      readiness_accelerator: String,
    },
    teacher_guide: {
      objectives: [String],
      materials: [String],
      time_breakdown: { type: String, required: true },
      instructional_steps: [String],
      differentiation: { type: String, required: true },
      common_misconceptions: [String],
    },
    assessments: {
      exit_ticket: ExitTicketSchema,
      quiz: QuizSchema,
      project: ProjectSchema,
    },
    federal_alignment: {
      gear_up_objective: { type: String, required: true },
      standards: [String],
    },
    published: { type: Boolean, default: false, index: true },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

ModuleSchema.index({ grade: 1, subject: 1, pillar: 1 });

export const Module = mongoose.model<ModuleDocument>('Module', ModuleSchema);



