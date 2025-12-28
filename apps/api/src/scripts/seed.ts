import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { School } from '../models/School';
import { Student } from '../models/Student';
import { Module } from '../models/Module';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/northstar';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
    // await User.deleteMany({});
    // await School.deleteMany({});
    // await Student.deleteMany({});
    // await Module.deleteMany({});

    // Create State Director
    const directorPassword = await bcrypt.hash('director123', 10);
    const director = await User.findOneAndUpdate(
      { email: 'director@northstar.edu' },
      {
        user_id: 'director_001',
        email: 'director@northstar.edu',
        password_hash: directorPassword,
        first_name: 'State',
        last_name: 'Director',
        role: 'state_director',
        district_id: 'district_001',
      },
      { upsert: true, new: true }
    );
    console.log('Created director:', director.email);

    // Create School
    const school = await School.findOneAndUpdate(
      { school_id: 'school_001' },
      {
        school_id: 'school_001',
        district_id: 'district_001',
        state_director_id: director.user_id,
        school_name: 'North Star High School',
        coordinator: {
          user_id: 'coordinator_001',
          first_name: 'School',
          last_name: 'Coordinator',
          email: 'coordinator@northstar.edu',
        },
        grades_served: ['9', '10', '11', '12'],
        cohorts: [2024, 2025, 2026, 2027],
        counts: {
          students: 0,
          teachers: 0,
          classes: 0,
        },
        completion_metrics: {
          total_modules_assigned: 0,
          modules_completed: 0,
          completion_rate: 0,
          average_time_per_module: 0,
        },
        equity_metrics: {
          by_demographic: {},
          gaps_identified: [],
        },
        teacher_engagement: {
          active_teachers: 0,
          assignments_created: 0,
          average_grading_time_hours: 0,
        },
      },
      { upsert: true, new: true }
    );
    console.log('Created school:', school.school_name);

    // Create Coordinator
    const coordinatorPassword = await bcrypt.hash('coordinator123', 10);
    const coordinator = await User.findOneAndUpdate(
      { email: 'coordinator@northstar.edu' },
      {
        user_id: 'coordinator_001',
        email: 'coordinator@northstar.edu',
        password_hash: coordinatorPassword,
        first_name: 'School',
        last_name: 'Coordinator',
        role: 'school_coordinator',
        district_id: 'district_001',
        school_id: 'school_001',
      },
      { upsert: true, new: true }
    );
    console.log('Created coordinator:', coordinator.email);

    // Create Teacher
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher = await User.findOneAndUpdate(
      { email: 'teacher@northstar.edu' },
      {
        user_id: 'teacher_001',
        email: 'teacher@northstar.edu',
        password_hash: teacherPassword,
        first_name: 'John',
        last_name: 'Teacher',
        role: 'teacher',
        district_id: 'district_001',
        school_id: 'school_001',
        classes_taught: ['class_001', 'class_002'],
      },
      { upsert: true, new: true }
    );
    console.log('Created teacher:', teacher.email);

    // Create Student
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentUser = await User.findOneAndUpdate(
      { email: 'student@northstar.edu' },
      {
        user_id: 'student_001',
        email: 'student@northstar.edu',
        password_hash: studentPassword,
        first_name: 'Jane',
        last_name: 'Student',
        role: 'student',
        district_id: 'district_001',
        school_id: 'school_001',
      },
      { upsert: true, new: true }
    );
    console.log('Created student user:', studentUser.email);

    const student = await Student.findOneAndUpdate(
      { student_id: 'student_001' },
      {
        student_id: 'student_001',
        school_id: 'school_001',
        district_id: 'district_001',
        first_name: 'Jane',
        last_name: 'Student',
        grade: '10',
        cohort_year: 2026,
        demographics: {
          race_ethnicity: ['Hispanic/Latino'],
          gender: 'Female',
          first_generation: true,
          low_income: true,
        },
        parent_contacts: [
          {
            parent_id: 'parent_001',
            relationship: 'Mother',
            email: 'parent@northstar.edu',
            phone: '555-0100',
            opt_in_alerts: true,
            opt_in_messages: true,
          },
        ],
        modules_completed: [],
        modules_in_progress: [],
        module_progress: [],
        milestones: {},
        fafsa_completion: {
          completed: false,
        },
      },
      { upsert: true, new: true }
    );
    console.log('Created student:', student.first_name, student.last_name);

    // Create Parent
    const parentPassword = await bcrypt.hash('parent123', 10);
    const parent = await User.findOneAndUpdate(
      { email: 'parent@northstar.edu' },
      {
        user_id: 'parent_001',
        email: 'parent@northstar.edu',
        password_hash: parentPassword,
        first_name: 'Parent',
        last_name: 'User',
        role: 'parent',
        children: ['student_001'],
      },
      { upsert: true, new: true }
    );
    console.log('Created parent:', parent.email);

    // Create Sample Modules
    const module1 = await Module.findOneAndUpdate(
      { module_id: 'module_001' },
      {
        module_id: 'module_001',
        title: 'Introduction to College Planning',
        grade: '10',
        subject: 'College Readiness',
        pillar: 'Academic Excellence',
        word_count: 5000,
        estimated_time_minutes: 60,
        student_content: {
          introduction: '<p>Welcome to college planning! This module will help you understand the steps to prepare for college.</p>',
          chapters: [
            {
              chapter_number: 1,
              title: 'Understanding College Options',
              content: '<p>There are many types of colleges: community colleges, four-year universities, and trade schools.</p>',
              activities: ['<p>Research three colleges that interest you.</p>'],
            },
            {
              chapter_number: 2,
              title: 'Financial Aid Basics',
              content: '<p>Financial aid can help make college affordable. Learn about grants, loans, and scholarships.</p>',
              activities: ['<p>Calculate your estimated financial need.</p>'],
            },
          ],
          summary: '<p>You have learned about college options and financial aid basics.</p>',
        },
        teacher_guide: {
          objectives: ['Students will understand different college options', 'Students will learn about financial aid'],
          materials: ['Computer with internet access', 'Financial aid calculator'],
          time_breakdown: '60 minutes total: 20 min introduction, 30 min activities, 10 min assessment',
          instructional_steps: ['Introduce module', 'Guide through chapters', 'Facilitate activities'],
          differentiation: 'Provide additional support for students with limited internet access',
          common_misconceptions: ['All colleges are expensive', 'Financial aid is only for low-income students'],
        },
        assessments: {
          exit_ticket: {
            questions: [
              {
                question_id: 'q1',
                question_text: 'What are three types of colleges?',
                question_type: 'short_answer',
                points: 10,
              },
            ],
          },
          quiz: {
            questions: [
              {
                question_id: 'q2',
                question_text: 'What is the main purpose of financial aid?',
                question_type: 'multiple_choice',
                options: ['To pay for everything', 'To make college affordable', 'To avoid loans', 'To get scholarships'],
                correct_answer: 'To make college affordable',
                points: 20,
              },
            ],
          },
          project: {
            title: 'College Research Project',
            description: 'Research and present on a college of your choice',
            rubric: {
              criteria: [
                {
                  criterion: 'Research Quality',
                  points: 30,
                  description: 'Thorough research with multiple sources',
                },
                {
                  criterion: 'Presentation',
                  points: 20,
                  description: 'Clear and organized presentation',
                },
              ],
            },
          },
        },
        federal_alignment: {
          gear_up_objective: 'Increase college enrollment rates',
          standards: ['College and Career Readiness Standard 1'],
        },
        published: true,
        version: 1,
      },
      { upsert: true, new: true }
    );
    console.log('Created module:', module1.title);

    const module2 = await Module.findOneAndUpdate(
      { module_id: 'module_002' },
      {
        module_id: 'module_002',
        title: 'FAFSA Completion Guide',
        grade: '12',
        subject: 'Financial Aid',
        pillar: 'College Access',
        word_count: 3000,
        estimated_time_minutes: 45,
        student_content: {
          introduction: '<p>Learn how to complete the FAFSA form step by step.</p>',
          chapters: [
            {
              chapter_number: 1,
              title: 'FAFSA Basics',
              content: '<p>The FAFSA is the Free Application for Federal Student Aid.</p>',
              activities: [],
            },
          ],
          summary: '<p>You now know how to complete the FAFSA.</p>',
        },
        teacher_guide: {
          objectives: ['Students will complete the FAFSA'],
          materials: ['FAFSA website access'],
          time_breakdown: '45 minutes',
          instructional_steps: ['Guide through FAFSA completion'],
          differentiation: 'Provide one-on-one support',
          common_misconceptions: ['FAFSA is only for low-income students'],
        },
        assessments: {
          exit_ticket: {
            questions: [
              {
                question_id: 'q3',
                question_text: 'What does FAFSA stand for?',
                question_type: 'short_answer',
                points: 10,
              },
            ],
          },
          quiz: {
            questions: [
              {
                question_id: 'q4',
                question_text: 'When should you submit the FAFSA?',
                question_type: 'multiple_choice',
                options: ['After graduation', 'As early as possible', 'Never', 'Only if needed'],
                correct_answer: 'As early as possible',
                points: 20,
              },
            ],
          },
          project: {
            title: 'FAFSA Completion',
            description: 'Complete the FAFSA form',
            rubric: {
              criteria: [
                {
                  criterion: 'Completion',
                  points: 50,
                  description: 'FAFSA form fully completed',
                },
              ],
            },
          },
        },
        federal_alignment: {
          gear_up_objective: 'Increase FAFSA completion rates',
          standards: ['Financial Aid Standard 1'],
        },
        published: true,
        version: 1,
      },
      { upsert: true, new: true }
    );
    console.log('Created module:', module2.title);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest accounts:');
    console.log('Director: director@northstar.edu / director123');
    console.log('Coordinator: coordinator@northstar.edu / coordinator123');
    console.log('Teacher: teacher@northstar.edu / teacher123');
    console.log('Student: student@northstar.edu / student123');
    console.log('Parent: parent@northstar.edu / parent123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();



