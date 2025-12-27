import express from 'express';
import { AssignmentCreateSchema, AssignmentUpdateSchema, AssignmentQuerySchema } from '@northstar/shared';
import { Assignment } from '../models/Assignment';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { scopeCheck } from '../middleware/scope';

const router = express.Router();

// Get all assignments (with filters and scoping)
router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const query = AssignmentQuerySchema.parse(req.query);
    const filter: any = {};

    // Apply role-based scoping
    if (req.user?.role === 'teacher') {
      filter.assigned_by = req.user.user_id;
    } else if (req.user?.role === 'school_coordinator') {
      filter.school_id = req.user.school_id;
    } else if (req.user?.role === 'state_director') {
      if (req.user.district_id) {
        // Filter by district if director has one
        // In production, you'd join with School model
      }
    } else if (req.user?.role === 'student') {
      filter.assigned_to_ids = req.user.user_id;
    }

    if (query.school_id) filter.school_id = query.school_id;
    if (query.teacher_id) filter.assigned_by = query.teacher_id;
    if (query.student_id) filter.assigned_to_ids = query.student_id;

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const assignments = await Assignment.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Assignment.countDocuments(filter);

    res.json({
      success: true,
      data: assignments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

// Get single assignment
router.get('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const assignment = await Assignment.findOne({ assignment_id: req.params.id });
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    // Check scope
    const canView = await scopeCheck.canViewSchool(req, assignment.school_id);
    if (!canView && req.user?.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
});

// Create assignment (teacher/coordinator/director)
router.post('/', requireAuth, requireRole('teacher', 'school_coordinator', 'state_director'), async (req: AuthRequest, res, next) => {
  try {
    const data = AssignmentCreateSchema.parse(req.body);
    
    // Verify school access
    const canView = await scopeCheck.canViewSchool(req, data.school_id);
    if (!canView) {
      return res.status(403).json({ success: false, error: 'Access denied to school' });
    }

    const assignment_id = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const assignment = new Assignment({
      assignment_id,
      ...data,
      assigned_by: req.user!.user_id,
    });

    await assignment.save();

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

// Update assignment
router.put('/:id', requireAuth, requireRole('teacher', 'school_coordinator', 'state_director'), async (req: AuthRequest, res, next) => {
  try {
    const canModify = await scopeCheck.canModifyAssignment(req, req.params.id);
    if (!canModify) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const data = AssignmentUpdateSchema.parse(req.body);
    
    const assignment = await Assignment.findOneAndUpdate(
      { assignment_id: req.params.id },
      { ...data, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

// Delete assignment (teacher can delete only own)
router.delete('/:id', requireAuth, requireRole('teacher', 'school_coordinator', 'state_director'), async (req: AuthRequest, res, next) => {
  try {
    const canModify = await scopeCheck.canModifyAssignment(req, req.params.id);
    if (!canModify) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const assignment = await Assignment.findOneAndDelete({ assignment_id: req.params.id });
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    res.json({
      success: true,
      message: 'Assignment deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

