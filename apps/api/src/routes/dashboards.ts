import express, { type Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Student } from '../models/Student';
import { School } from '../models/School';
import { Assignment } from '../models/Assignment';
import { Alert } from '../models/Alert';
import { Module } from '../models/Module';
import { DistrictDashboard } from '../models/DistrictDashboard';

const router: Router = express.Router();

// District Dashboard (director)
router.get('/district', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'state_director') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const districtId = req.user.district_id;
    if (!districtId) {
      return res.status(400).json({ success: false, error: 'District ID required' });
    }

    // Get or generate current month dashboard
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    let dashboard = await DistrictDashboard.findOne({ district_id: districtId, month: currentMonth });

    if (!dashboard) {
      // Generate dashboard data
      const schools = await School.find({ district_id: districtId });
      const students = await Student.find({ district_id: districtId });
      
      // Calculate metrics
      const totalModulesAssigned = await Assignment.countDocuments({});
      const modulesCompleted = students.reduce((sum: number, s: any) => sum + s.modules_completed.length, 0);
      const completionRate = totalModulesAssigned > 0 ? (modulesCompleted / totalModulesAssigned) * 100 : 0;

      const avgTime = students.reduce((sum: number, s: any) => {
        const totalTime = (s.module_progress as any[]).reduce((t: number, p: any) => t + (p.time_spent_minutes || 0), 0);
        return sum + totalTime;
      }, 0) / (students.length || 1);

      // FAFSA completion (simplified)
      const fafsaEligible = students.length; // Assume all are eligible
      const fafsaCompleted = students.filter(s => s.fafsa_completion.completed).length;

      dashboard = new DistrictDashboard({
        district_id: districtId,
        month: currentMonth,
        students_served: students.length,
        schools_active: schools.length,
        completion_metrics: {
          total_modules_assigned: totalModulesAssigned,
          modules_completed: modulesCompleted,
          completion_rate: completionRate,
          average_time_per_module: avgTime,
        },
        equity_metrics: {
          by_demographic: {},
          gaps_identified: [],
        },
        fafsa_completion: {
          total_eligible: fafsaEligible,
          completed: fafsaCompleted,
          completion_rate: fafsaEligible > 0 ? (fafsaCompleted / fafsaEligible) * 100 : 0,
        },
        apr_readiness: {
          data_completeness: 85, // Simplified
          missing_demographics: 0,
          missing_parent_contacts: 0,
          missing_scores: 0,
        },
      });

      await dashboard.save();
    }

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
});

// School Dashboard (coordinator)
router.get('/school', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'school_coordinator') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const schoolId = req.user.school_id;
    if (!schoolId) {
      return res.status(400).json({ success: false, error: 'School ID required' });
    }

    const school = await School.findOne({ school_id: schoolId });
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    const students = await Student.find({ school_id: schoolId });
    const assignments = await Assignment.find({ school_id: schoolId });
    const alerts = await Alert.find({ student_id: { $in: students.map(s => s.student_id) } });

    res.json({
      success: true,
      data: {
        school,
        students_count: students.length,
        assignments_count: assignments.length,
        active_alerts: alerts.filter(a => a.response_status === 'pending').length,
        recent_activity: {
          assignments_created_this_week: assignments.filter(a => 
            a.created_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Teacher Dashboard
router.get('/teacher', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const assignments = await Assignment.find({ assigned_by: req.user.user_id });
    const studentIds = new Set<string>();
    assignments.forEach((a: any) => {
      (a.assigned_to_ids as string[]).forEach((id: string) => studentIds.add(id));
    });

    const students = await Student.find({ student_id: { $in: Array.from(studentIds) } });
    
    // Calculate completion stats
    let totalAssigned = 0;
    let completed = 0;
    assignments.forEach((a: any) => {
      totalAssigned += a.assigned_to_ids.length;
      (a.assigned_to_ids as string[]).forEach((studentId: string) => {
        const student = students.find((s: any) => s.student_id === studentId);
        if (student && student.modules_completed.includes(a.module_id)) {
          completed++;
        }
      });
    });

    res.json({
      success: true,
      data: {
        assignments_count: assignments.length,
        students_count: students.length,
        completion_rate: totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0,
        recent_assignments: assignments.slice(0, 5),
        pending_grading: assignments.filter(a => {
          // Simplified - in production, check actual submission status
          return true;
        }).length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Student Dashboard
router.get('/student', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const student = await Student.findOne({ student_id: req.user.user_id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const assignments = await Assignment.find({ assigned_to_ids: req.user.user_id });
    const modules = await Module.find({ module_id: { $in: student.modules_in_progress.concat(student.modules_completed) } });

    res.json({
      success: true,
      data: {
        student,
        modules_completed: student.modules_completed.length,
        modules_in_progress: student.modules_in_progress.length,
        assignments_pending: assignments.filter(a => {
          return !student.modules_completed.includes(a.module_id);
        }).length,
        recent_modules: modules.slice(0, 5),
        milestones: student.milestones,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Parent Dashboard
router.get('/parent', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const students = await Student.find({
      'parent_contacts.parent_id': req.user.user_id,
    });

    const studentIds = students.map(s => s.student_id);
    const alerts = await Alert.find({
      student_id: { $in: studentIds },
      parent_id: req.user.user_id,
    });

    res.json({
      success: true,
      data: {
        children: students.map((s: any) => ({
          student_id: s.student_id,
          first_name: s.first_name,
          last_name: s.last_name,
          grade: s.grade,
          modules_completed: s.modules_completed.length,
          recent_scores: (s.module_progress as any[])
            .filter((p: any) => p.quiz_score !== undefined)
            .slice(-5)
            .map((p: any) => ({
              module_id: p.module_id,
              quiz_score: p.quiz_score,
            })),
        })),
        active_alerts: alerts.filter(a => a.response_status === 'pending').length,
        recent_alerts: alerts.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;



