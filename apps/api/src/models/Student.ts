import mongoose, { Schema, Document } from 'mongoose';
import { Student as IStudent } from '@northstar/shared';

export interface StudentDocument extends Omit<IStudent, 'student_id'>, Document {
  student_id: string;
}

const ParentContactSchema = new Schema({
  parent_id: { type: String, required: true },
  relationship: { type: String, required: true },
  email: String,
  phone: String,
  opt_in_alerts: { type: Boolean, default: true },
  opt_in_messages: { type: Boolean, default: true },
});

const ModuleProgressEntrySchema = new Schema({
  module_id: { type: String, required: true, index: true },
  started_at: { type: Date, required: true },
  completed_at: Date,
  time_spent_minutes: { type: Number, default: 0 },
  chapters_completed: [Number],
  exit_ticket_score: Number,
  quiz_score: Number,
  project_submitted: Boolean,
  project_score: Number,
  last_accessed_at: { type: Date, default: Date.now },
});

const MilestonesSchema = new Schema({
  // Dynamic structure: grade -> { completed_modules, badges, achievements }
}, { strict: false });

const FAFSACompletionSchema = new Schema({
  completed: { type: Boolean, default: false },
  completed_date: Date,
  notes: String,
});

const StudentSchema = new Schema<StudentDocument>(
  {
    student_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    school_id: {
      type: String,
      required: true,
      index: true,
    },
    district_id: {
      type: String,
      required: true,
      index: true,
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    grade: { type: String, required: true, index: true },
    cohort_year: { type: Number, required: true },
    demographics: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    parent_contacts: [ParentContactSchema],
    modules_completed: [String],
    modules_in_progress: [String],
    module_progress: [ModuleProgressEntrySchema],
    milestones: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    fafsa_completion: {
      type: FAFSACompletionSchema,
      default: {},
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

StudentSchema.index({ school_id: 1, grade: 1 });
StudentSchema.index({ district_id: 1 });

export const Student = mongoose.model<StudentDocument>('Student', StudentSchema);

