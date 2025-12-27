import mongoose, { Schema, Document } from 'mongoose';
import { Assignment as IAssignment } from '@northstar/shared';

export interface AssignmentDocument extends Omit<IAssignment, 'assignment_id'>, Document {
  assignment_id: string;
}

const CompletionStatusSchema = new Schema({
  total: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
  in_progress: { type: Number, default: 0 },
  not_started: { type: Number, default: 0 },
});

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    assignment_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    module_id: {
      type: String,
      required: true,
      index: true,
    },
    assigned_by: {
      type: String,
      required: true,
      index: true,
    },
    assigned_to_type: {
      type: String,
      enum: ['student', 'class', 'cohort'],
      required: true,
    },
    assigned_to_ids: [String],
    school_id: {
      type: String,
      required: true,
      index: true,
    },
    grade: String,
    assigned_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    instructions: String,
    completion_status: CompletionStatusSchema,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

AssignmentSchema.index({ school_id: 1, assigned_by: 1 });
AssignmentSchema.index({ module_id: 1 });

export const Assignment = mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);

