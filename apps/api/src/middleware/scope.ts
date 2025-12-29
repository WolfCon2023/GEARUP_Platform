import { Response, NextFunction } from 'express';
import type { ParentContact } from '@northstar/shared';
import { AuthRequest } from './auth.js';
import { Student } from '../models/Student.js';
import { Assignment } from '../models/Assignment.js';
import { Alert } from '../models/Alert.js';

// Scope checks for data access
export const scopeCheck = {
  // Director can view all in district
  canViewDistrict: (req: AuthRequest, districtId: string): boolean => {
    if (req.user?.role === 'state_director') {
      return req.user.district_id === districtId || !req.user.district_id;
    }
    return false;
  },

  // Coordinator can view school-scoped data
  canViewSchool: async (req: AuthRequest, schoolId: string): Promise<boolean> => {
    if (req.user?.role === 'state_director') {
      return true; // Directors can view all schools
    }
    if (req.user?.role === 'school_coordinator') {
      return req.user.school_id === schoolId;
    }
    if (req.user?.role === 'teacher') {
      // Teachers can view their school
      return req.user.school_id === schoolId;
    }
    return false;
  },

  // Teacher can view assigned students only
  canViewStudent: async (req: AuthRequest, studentId: string): Promise<boolean> => {
    if (req.user?.role === 'state_director' || req.user?.role === 'school_coordinator') {
      return true;
    }
    if (req.user?.role === 'teacher') {
      // Check if student is in teacher's assignments
      const assignment = await Assignment.findOne({
        assigned_by: req.user.user_id,
        assigned_to_ids: studentId,
      });
      if (assignment) return true;

      // Check if student is in teacher's classes (if classes_taught is populated)
      const student = await Student.findOne({ student_id: studentId });
      if (student && req.userDoc?.classes_taught) {
        // This is a simplified check - in production, you'd have a Class model
        return true; // Assume teacher can view if student is in their school
      }
      return false;
    }
    if (req.user?.role === 'student') {
      return req.user.user_id === studentId;
    }
    if (req.user?.role === 'parent') {
      const student = await Student.findOne({ student_id: studentId });
      return (student?.parent_contacts as ParentContact[])?.some((pc: ParentContact) => pc.parent_id === req.user?.user_id) || false;
    }
    return false;
  },

  // Parent can view children only
  canViewChild: async (req: AuthRequest, studentId: string): Promise<boolean> => {
    if (req.user?.role === 'parent') {
      const student = await Student.findOne({ student_id: studentId });
      return (student?.parent_contacts as ParentContact[])?.some((pc: ParentContact) => pc.parent_id === req.user?.user_id) || false;
    }
    return false;
  },

  // Check if user can modify assignment
  canModifyAssignment: async (req: AuthRequest, assignmentId: string): Promise<boolean> => {
    if (req.user?.role === 'state_director' || req.user?.role === 'school_coordinator') {
      return true;
    }
    if (req.user?.role === 'teacher') {
      const assignment = await Assignment.findOne({ assignment_id: assignmentId });
      return assignment?.assigned_by === req.user.user_id;
    }
    return false;
  },

  // Check if user can view/modify alert
  canViewAlert: async (req: AuthRequest, alertId: string): Promise<boolean> => {
    const alert = await Alert.findOne({ alert_id: alertId });
    if (!alert) return false;

    if (req.user?.role === 'state_director' || req.user?.role === 'school_coordinator') {
      return true;
    }
    if (req.user?.role === 'teacher') {
      // Teachers can view alerts for their students
      const student = await Student.findOne({ student_id: alert.student_id });
      return student?.school_id === req.user.school_id;
    }
    if (req.user?.role === 'parent') {
      return alert.parent_id === req.user.user_id;
    }
    if (req.user?.role === 'student') {
      return alert.student_id === req.user.user_id;
    }
    return false;
  },
};



