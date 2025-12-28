import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser, UserRole } from '@northstar/shared';

export interface UserDocument extends Omit<IUser, 'user_id'>, Document {
  user_id: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['state_director', 'school_coordinator', 'teacher', 'student', 'parent'],
      required: true,
      index: true,
    },
    district_id: {
      type: String,
      index: true,
    },
    school_id: {
      type: String,
      index: true,
    },
    classes_taught: [String],
    children: [String], // student_ids for parents
    permissions: {
      type: Map,
      of: Boolean,
      default: {},
    },
    last_login: Date,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const User = mongoose.model<UserDocument>('User', UserSchema);



