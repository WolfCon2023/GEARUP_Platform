import express, { type Router } from 'express';
import { AlertCreateSchema, AlertUpdateSchema, AlertQuerySchema } from '@northstar/shared';
import { Alert } from '../models/Alert.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { scopeCheck } from '../middleware/scope.js';

const router: Router = express.Router();

// Get all alerts (role scoped)
router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const query = AlertQuerySchema.parse(req.query);
    const filter: any = {};

    // Apply role-based scoping
    if (req.user?.role === 'parent') {
      filter.parent_id = req.user.user_id;
    } else if (req.user?.role === 'student') {
      filter.student_id = req.user.user_id;
    } else if (req.user?.role === 'teacher') {
      // Teachers see alerts for their students (simplified - would need join in production)
      // For now, filter by school_id via student lookup
    }

    if (query.student_id) filter.student_id = query.student_id;
    if (query.parent_id) filter.parent_id = query.parent_id;
    if (query.alert_type) filter.alert_type = query.alert_type;
    if (query.priority) filter.priority = query.priority;
    if (query.response_status) filter.response_status = query.response_status;

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const alerts = await Alert.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Alert.countDocuments(filter);

    res.json({
      success: true,
      data: alerts,
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

// Get single alert
router.get('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const canView = await scopeCheck.canViewAlert(req, req.params.id);
    if (!canView) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const alert = await Alert.findOne({ alert_id: req.params.id });
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
});

// Create alert (teacher/coordinator/director)
router.post('/', requireAuth, requireRole('teacher', 'school_coordinator', 'state_director'), async (req: AuthRequest, res, next) => {
  try {
    const data = AlertCreateSchema.parse(req.body);
    
    // Verify student access
    const canView = await scopeCheck.canViewStudent(req, data.student_id);
    if (!canView) {
      return res.status(403).json({ success: false, error: 'Access denied to student' });
    }

    const alert_id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert = new Alert({
      alert_id,
      ...data,
      sent_at: new Date(),
      delivery_status: 'sent',
    });

    await alert.save();

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

// Update alert (parent can acknowledge)
router.put('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const canView = await scopeCheck.canViewAlert(req, req.params.id);
    if (!canView) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const data = AlertUpdateSchema.parse(req.body);
    
    const update: any = {};
    if (data.read_at) update.read_at = data.read_at;
    if (data.response_status) update.response_status = data.response_status;

    const alert = await Alert.findOneAndUpdate(
      { alert_id: req.params.id },
      { ...update, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

export default router;



