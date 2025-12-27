import mongoose, { Schema, Document } from 'mongoose';
import { DistrictDashboard as IDistrictDashboard } from '@northstar/shared';

export interface DistrictDashboardDocument extends Omit<IDistrictDashboard, 'district_id' | 'month'>, Document {
  district_id: string;
  month: string;
}

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

const FAFSACompletionSchema = new Schema({
  total_eligible: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
  completion_rate: { type: Number, default: 0 },
});

const APRReadinessSchema = new Schema({
  data_completeness: { type: Number, default: 0 },
  missing_demographics: { type: Number, default: 0 },
  missing_parent_contacts: { type: Number, default: 0 },
  missing_scores: { type: Number, default: 0 },
});

const DistrictDashboardSchema = new Schema<DistrictDashboardDocument>(
  {
    district_id: {
      type: String,
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },
    students_served: { type: Number, default: 0 },
    schools_active: { type: Number, default: 0 },
    completion_metrics: {
      type: CompletionMetricsSchema,
      default: {},
    },
    equity_metrics: {
      type: EquityMetricsSchema,
      default: {},
    },
    fafsa_completion: {
      type: FAFSACompletionSchema,
      default: {},
    },
    apr_readiness: {
      type: APRReadinessSchema,
      default: {},
    },
    generated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

DistrictDashboardSchema.index({ district_id: 1, month: 1 }, { unique: true });

export const DistrictDashboard = mongoose.model<DistrictDashboardDocument>('DistrictDashboard', DistrictDashboardSchema);

