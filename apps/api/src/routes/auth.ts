import express from 'express';
import bcrypt from 'bcryptjs';
import { RegisterSchema, LoginSchema } from '@northstar/shared';
import { User } from '../models/User';
import { requireAuth, requireRole, generateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register (admin only or seed-only in production)
router.post('/register', requireAuth, requireRole('state_director'), async (req, res, next) => {
  try {
    const data = RegisterSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Generate user_id
    const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hash password
    const password_hash = await bcrypt.hash(data.password, 10);

    const user = new User({
      user_id,
      ...data,
      password_hash,
    });

    await user.save();

    // Generate token
    const token = generateToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      district_id: user.district_id,
      school_id: user.school_id,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          district_id: user.district_id,
          school_id: user.school_id,
        },
        token,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const data = LoginSchema.parse(req.body);
    
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Update last_login
    user.last_login = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      district_id: user.district_id,
      school_id: user.school_id,
    });

    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          district_id: user.district_id,
          school_id: user.school_id,
        },
        token,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

// Get current user
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findOne({ user_id: req.user!.user_id });
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({
    success: true,
    data: {
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        district_id: user.district_id,
        school_id: user.school_id,
        classes_taught: user.classes_taught,
        children: user.children,
      },
    },
  });
});

export default router;

