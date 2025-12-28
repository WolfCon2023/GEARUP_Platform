import mongoose, { Schema, Document } from 'mongoose';
import { School as ISchool } from '@northstar/shared';

export interface SchoolDocument extends Omit<ISchool, 'school_id'>, Document {
  school_id: string;
}

const CoordinatorSchema = new Schema({
  user_id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
});

const CompletionMetricsSchema = new Schema({
  total_modules_assigned: { type: Number, default: 0 },
  modules_completed: { type: Number, default: 0 },
  completion_rate: { type: Number, default: 0 },
  average_time_per_module: { type: Number, default: 0 },
});

const EquityMetricsSchema = new Schema({
  by_demographic: {
    type: Map,
    of: {
      completion_rate: Number,
      average_score: Number,
    },
    default: {},
  },
  gaps_identified: [String],
});

const TeacherEngagementSchema = new Schema({
  active_teachers: { type: Number, default: 0 },
  assignments_created: { type: Number, default: 0 },
  average_grading_time_hours: { type: Number, default: 0 },
});

const SchoolSchema = new Schema<SchoolDocument>(
  {
    school_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    district_id: {
      type: String,
      required: true,
      index: true,
    },
    state_director_id: {
      type: String,
      required: true,
      index: true,
    },
    school_name: { type: String, required: true },
    coordinator: { type: CoordinatorSchema, required: true },
    grades_served: [String],
    cohorts: [Number],
    counts: {
      students: { type: Number, default: 0 },
      teachers: { type: Number, default: 0 },
      classes: { type: Number, default: 0 },
    },
    completion_metrics: {
      type: CompletionMetricsSchema,
      default: {},
    },
    equity_metrics: {
      type: EquityMetricsSchema,
      default: {},
    },
    teacher_engagement: {
      type: TeacherEngagementSchema,
      default: {},
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const School = mongoose.model<SchoolDocument>('School', SchoolSchema);



