import express, { type Router } from 'express';
import { ProgressUpdateSchema } from '@northstar/shared';
import { Student } from '../models/Student';
import { Module } from '../models/Module';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { scopeCheck } from '../middleware/scope';

const router: Router = express.Router();

// Update progress
router.post('/update', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = ProgressUpdateSchema.parse(req.body);
    
    // Verify student access
    const canView = await scopeCheck.canViewStudent(req, data.student_id);
    if (!canView && req.user?.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const student = await Student.findOne({ student_id: data.student_id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Find or create module progress entry
    let progressEntry = student.module_progress.find((p: any) => p.module_id === data.module_id);
    
    if (!progressEntry) {
      progressEntry = {
        module_id: data.module_id,
        started_at: new Date(),
        time_spent_minutes: 0,
        chapters_completed: [],
        last_accessed_at: new Date(),
      };
      student.module_progress.push(progressEntry);
      
      // Add to in_progress if not already there
      if (!student.modules_in_progress.includes(data.module_id)) {
        student.modules_in_progress.push(data.module_id);
      }
    }

    // At this point, progressEntry is guaranteed to be defined

    // Handle different actions
    switch (data.action) {
      case 'start_module':
        progressEntry.started_at = new Date();
        progressEntry.last_accessed_at = new Date();
        break;

      case 'complete_chapter':
        if (data.chapter_number !== undefined) {
          if (!progressEntry.chapters_completed.includes(data.chapter_number)) {
            progressEntry.chapters_completed.push(data.chapter_number);
          }
          progressEntry.last_accessed_at = new Date();
        }
        if (data.time_spent_minutes) {
          progressEntry.time_spent_minutes += data.time_spent_minutes;
        }
        break;

      case 'submit_exit_ticket':
        if (data.exit_ticket_answers) {
          // Calculate score (simplified - in production, use module's questions)
          const module = await Module.findOne({ module_id: data.module_id });
          if (module && data.exit_ticket_answers) {
            let score = 0;
            let totalPoints = 0;
            module.assessments.exit_ticket.questions.forEach((q: any) => {
              totalPoints += q.points;
              // Simplified scoring - in production, check answers properly
              if (data.exit_ticket_answers![q.question_id] !== undefined) {
                score += q.points * 0.8; // Assume 80% correct for now
              }
            });
            progressEntry.exit_ticket_score = Math.round((score / totalPoints) * 100);
          }
        }
        progressEntry.last_accessed_at = new Date();
        break;

      case 'submit_quiz':
        if (data.quiz_answers) {
          const module = await Module.findOne({ module_id: data.module_id });
          if (module && data.quiz_answers) {
            let score = 0;
            let totalPoints = 0;
            module.assessments.quiz.questions.forEach((q: any) => {
              totalPoints += q.points;
              if (data.quiz_answers![q.question_id] !== undefined) {
                score += q.points * 0.85; // Assume 85% correct for now
              }
            });
            progressEntry.quiz_score = Math.round((score / totalPoints) * 100);
          }
        }
        progressEntry.last_accessed_at = new Date();
        break;

      case 'submit_project':
        if (data.project_submission) {
          progressEntry.project_submitted = true;
          // Calculate project score from rubric
          const module = await Module.findOne({ module_id: data.module_id });
          if (module) {
            let totalScore = 0;
            let maxScore = 0;
            module.assessments.project.rubric.criteria.forEach((c: any) => {
              maxScore += c.points;
              const studentScore = data.project_submission!.rubric_scores[c.criterion] || 0;
              totalScore += Math.min(studentScore, c.points);
            });
            progressEntry.project_score = Math.round((totalScore / maxScore) * 100);
          }
        }
        progressEntry.last_accessed_at = new Date();
        break;
    }

    // Check if module is completed (all chapters done)
    const module = await Module.findOne({ module_id: data.module_id });
    if (module && progressEntry.chapters_completed.length === module.student_content.chapters.length) {
      progressEntry.completed_at = new Date();
      
      // Move from in_progress to completed
      student.modules_in_progress = student.modules_in_progress.filter((id: string) => id !== data.module_id);
      if (!student.modules_completed.includes(data.module_id)) {
        student.modules_completed.push(data.module_id);
      }
    }

    await student.save();

    res.json({
      success: true,
      data: {
        student_id: student.student_id,
        module_id: data.module_id,
        progress: progressEntry,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

export default router;



