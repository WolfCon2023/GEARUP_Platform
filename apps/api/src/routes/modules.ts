import express, { type Router } from 'express';
import { ModuleQuerySchema, ModuleCreateSchema, ModuleUpdateSchema } from '@northstar/shared';
import { Module } from '../models/Module.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// Get all modules (with filters)
router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const query = ModuleQuerySchema.parse(req.query);
    const filter: any = {};

    if (query.grade) filter.grade = query.grade;
    if (query.subject) filter.subject = query.subject;
    if (query.pillar) filter.pillar = query.pillar;
    if (query.published !== undefined) filter.published = query.published;

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const modules = await Module.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Module.countDocuments(filter);

    res.json({
      success: true,
      data: modules,
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

// Get single module
router.get('/:moduleId', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const module = await Module.findOne({ module_id: req.params.moduleId });
    if (!module) {
      return res.status(404).json({ success: false, error: 'Module not found' });
    }

    res.json({
      success: true,
      data: module,
    });
  } catch (error) {
    next(error);
  }
});

// Create module (state_director only)
router.post('/', requireAuth, requireRole('state_director'), async (req, res, next) => {
  try {
    const data = ModuleCreateSchema.parse(req.body);
    
    // Check if module_id already exists
    const existing = await Module.findOne({ module_id: data.module_id });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Module ID already exists' });
    }

    const module = new Module(data);
    await module.save();

    res.status(201).json({
      success: true,
      data: module,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Module ID already exists' });
    }
    next(error);
  }
});

// Update module (state_director only)
router.put('/:moduleId', requireAuth, requireRole('state_director'), async (req, res, next) => {
  try {
    const data = ModuleUpdateSchema.parse(req.body);
    
    const module = await Module.findOneAndUpdate(
      { module_id: req.params.moduleId },
      { ...data, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!module) {
      return res.status(404).json({ success: false, error: 'Module not found' });
    }

    res.json({
      success: true,
      data: module,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

export default router;



