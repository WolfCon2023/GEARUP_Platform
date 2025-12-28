import express, { type Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { APRReportQuerySchema, DataCompletenessQuerySchema } from '@northstar/shared';
import { Student } from '../models/Student';
import { School } from '../models/School';
import { Assignment } from '../models/Assignment';

const router: Router = express.Router();

// APR Export (CSV)
router.get('/apr', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'state_director') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const query = APRReportQuerySchema.parse(req.query);
    const districtId = query.district || req.user.district_id;

    if (!districtId) {
      return res.status(400).json({ success: false, error: 'District ID required' });
    }

    const students = await Student.find({ district_id: districtId });
    const schools = await School.find({ district_id: districtId });
    const assignments = await Assignment.find({});

    // Generate CSV
    const csvRows: string[] = [];
    
    // Header
    csvRows.push([
      'Student ID',
      'First Name',
      'Last Name',
      'Grade',
      'School ID',
      'Cohort Year',
      'Modules Completed',
      'Completion Rate',
      'FAFSA Completed',
      'Average Score',
    ].join(','));

    // Data rows
    students.forEach(student => {
      const studentAssignments = assignments.filter(a => 
        a.assigned_to_ids.includes(student.student_id)
      );
      const completionRate = studentAssignments.length > 0
        ? (student.modules_completed.length / studentAssignments.length) * 100
        : 0;
      
      const avgScore = student.module_progress.length > 0
        ? student.module_progress
            .filter((p: any) => p.quiz_score !== undefined)
            .reduce((sum: number, p: any) => sum + (p.quiz_score || 0), 0) / 
          student.module_progress.filter((p: any) => p.quiz_score !== undefined).length
        : 0;

      csvRows.push([
        student.student_id,
        student.first_name,
        student.last_name,
        student.grade,
        student.school_id,
        student.cohort_year.toString(),
        student.modules_completed.length.toString(),
        completionRate.toFixed(2),
        student.fafsa_completion.completed ? 'Yes' : 'No',
        avgScore.toFixed(2),
      ].join(','));
    });

    const csv = csvRows.join('\n');

    // Calculate completeness summary
    const totalStudents = students.length;
    const missingDemographics = students.filter(s => 
      !s.demographics || Object.keys(s.demographics).length === 0
    ).length;
    const missingParentContacts = students.filter(s => 
      !s.parent_contacts || s.parent_contacts.length === 0
    ).length;
    const missingScores = students.filter(s => 
      s.module_progress.every(p => p.quiz_score === undefined)
    ).length;

    const completeness = {
      total_students: totalStudents,
      missing_demographics: missingDemographics,
      missing_parent_contacts: missingParentContacts,
      missing_scores: missingScores,
      data_completeness_rate: totalStudents > 0
        ? ((totalStudents - missingDemographics - missingParentContacts - missingScores) / totalStudents) * 100
        : 0,
    };

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=apr_export_${query.year}_${districtId}.csv`);
    res.send(csv + '\n\n' + JSON.stringify(completeness, null, 2));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

// Data Completeness Report
router.get('/data-completeness', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'state_director' && req.user?.role !== 'school_coordinator') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const query = DataCompletenessQuerySchema.parse(req.query);
    let districtId = query.district || req.user.district_id;
    let schoolId = req.user.school_id;

    const filter: any = {};
    if (districtId) filter.district_id = districtId;
    if (schoolId && req.user.role === 'school_coordinator') filter.school_id = schoolId;

    const students = await Student.find(filter);
    const schools = await School.find(filter);

    const report = {
      district_id: districtId,
      school_id: schoolId,
      total_students: students.length,
      total_schools: schools.length,
      missing_data: {
        demographics: students.filter((s: any) => 
          !s.demographics || Object.keys(s.demographics).length === 0
        ).length,
        parent_contacts: students.filter((s: any) => 
          !s.parent_contacts || s.parent_contacts.length === 0
        ).length,
        module_progress: students.filter((s: any) => 
          !s.module_progress || s.module_progress.length === 0
        ).length,
        fafsa_status: students.filter((s: any) => 
          !s.fafsa_completion || s.fafsa_completion.completed === undefined
        ).length,
      },
      completeness_rates: {
        demographics: students.length > 0
          ? ((students.length - students.filter(s => !s.demographics || Object.keys(s.demographics).length === 0).length) / students.length) * 100
          : 0,
        parent_contacts: students.length > 0
          ? ((students.length - students.filter(s => !s.parent_contacts || s.parent_contacts.length === 0).length) / students.length) * 100
          : 0,
        overall: students.length > 0
          ? ((students.length - 
              students.filter(s => !s.demographics || Object.keys(s.demographics).length === 0).length -
              students.filter(s => !s.parent_contacts || s.parent_contacts.length === 0).length
            ) / students.length) * 100
          : 0,
      },
    };

    res.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    next(error);
  }
});

export default router;



