import mongoose, { Schema, Document } from 'mongoose';
import { Alert as IAlert } from '@northstar/shared';

export interface AlertDocument extends Omit<IAlert, 'alert_id'>, Document {
  alert_id: string;
}

const AlertSchema = new Schema<AlertDocument>(
  {
    alert_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    student_id: {
      type: String,
      required: true,
      index: true,
    },
    parent_id: {
      type: String,
      index: true,
    },
    alert_type: {
      type: String,
      enum: ['academic', 'attendance', 'behavior', 'milestone', 'system'],
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    sent_at: { type: Date, default: Date.now },
    read_at: Date,
    response_status: {
      type: String,
      enum: ['pending', 'acknowledged', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
    delivery_status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

AlertSchema.index({ student_id: 1, parent_id: 1 });
AlertSchema.index({ response_status: 1, priority: 1 });

export const Alert = mongoose.model<AlertDocument>('Alert', AlertSchema);

