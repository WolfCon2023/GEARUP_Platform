# SC GEAR UP DIGITAL CURRICULUM PLATFORM
## COMPLETE DEVELOPER SPECIFICATION
### All 9 Phases - Production Ready

**Document Version:** 1.0
**Last Updated:** December 19, 2024
**Status:** READY FOR DEVELOPMENT
**Target Launch:** January 2025 Pilot

═══════════════════════════════════════════════════════════════════

## PHASE 0: PRODUCT DEFINITION

### 1.1 Role & Outcome Mapping

```
┌────────────────┬─────────────────────────────┬───────────────────────────┬───────────┐
│ Role           │ Primary Goal                │ Success Metric            │ Frequency │
├────────────────┼─────────────────────────────┼───────────────────────────┼───────────┤
│ State Director │ Hit federal APR targets     │ 95%+ data completeness    │ Monthly   │
│ (Dr. Parham)   │ Scale to 21,868 students    │ 80%+ module completion    │           │
│                │ across 36 schools           │ FAFSA completion >92%     │           │
├────────────────┼─────────────────────────────┼───────────────────────────┼───────────┤
│ School         │ Support students through    │ 85%+ student engagement   │ Weekly    │
│ Coordinator    │ college readiness pathway   │ All Tier 2 assigned <7d   │           │
│                │                             │ Parent contact >75%       │           │
├────────────────┼─────────────────────────────┼───────────────────────────┼───────────┤
│ Teacher        │ Deliver GEAR UP curriculum  │ 90%+ students complete    │ Daily     │
│                │ Integrate with core classes │ 3+ modules per semester   │           │
│                │                             │ <10 min daily prep        │           │
├────────────────┼─────────────────────────────┼───────────────────────────┼───────────┤
│ Student        │ Complete college prep       │ Complete 10 modules/year  │ Weekly    │
│ (Grades 7-12)  │ pathway & build aspiration  │ Pass all exit tickets     │           │
│                │                             │ Self-efficacy growth      │           │
├────────────────┼─────────────────────────────┼───────────────────────────┼───────────┤
│ Parent/        │ Support child's college     │ 81%+ alert response       │ Real-time │
│ Guardian       │ pathway & stay informed     │ View progress monthly     │           │
│                │                             │ FAFSA completion support  │           │
└────────────────┴─────────────────────────────┴───────────────────────────┴───────────┘
```

### **Daily/Weekly Actions by Role:**

**State Director (3 weekly actions):**
1. Check district-wide completion dashboard (APR metric tracking)
2. Review equity gap reports (subgroup participation rates)
3. Monitor pilot school metrics vs benchmarks

**School Coordinator (3 daily actions):**
1. Review student completion status (flag students falling behind)
2. Check teacher dashboard (module assignments, student progress)
3. Respond to parent questions via messaging system

**Teacher (3 daily actions):**
1. Assign module to student or class (aligned with lesson plan)
2. Review student exit ticket/quiz results
3. Quick-conference flagged students (5-min check-ins)

**Student (3 weekly actions):**
1. Complete assigned module (45-60 min reading + activities)
2. Take exit ticket and quiz (auto-graded)
3. Track progress toward grade-level completion badge

**Parent (3 monthly actions):**
1. Review child's module completion dashboard
2. Respond to alerts (module not started, quiz score <70%)
3. Review college readiness pathway milestones

---

### 1.2 Federal GEAR UP Requirements (34 CFR § 694.21)

**Four Statutory Objectives:**

```
1. INCREASE ACADEMIC PERFORMANCE & PREPARATION
   → Modules: Algebra I Foundations, College Essay Writing, Scientific Method
   → Metric: % students completing academic prep modules
   
2. INCREASE HIGH SCHOOL GRADUATION & POSTSECONDARY ENROLLMENT
   → Modules: Mapping Your Rigor, Understanding Gateway Courses, Academic Rigor (AP/IB/DE)
   → Metric: Cohort graduation rate, college enrollment rate
   
3. INCREASE EDUCATIONAL EXPECTATIONS & KNOWLEDGE
   → Modules: Career Exploration, SC Scholarship Guide, FAFSA Workshop, College Application
   → Metric: % students completing college entry modules, FAFSA completion rate
   
4. INCREASE TEACHER/STAFF PREPARATION
   → Feature: Every module includes comprehensive teacher guide
   → Metric: Teacher satisfaction score, hours saved on lesson prep
```

**Annual Performance Report (APR) Data Requirements:**
- Number of students served (by grade, demographics)
- Module completion rates (by subject, grade level)
- Assessment scores (exit tickets, quizzes)
- FAFSA completion rate (Grade 12 students)
- College enrollment rate (cohort tracking)
- Equity metrics (subgroup participation parity)

**Platform must generate APR-ready exports automatically.**

---

### 1.3 The 10 Core Modules (Pilot Phase)

```
ACADEMIC PREPARATION (Pillar 1)
1. Grade 9 Math: Algebra I Foundations
   - 2,800 words | 3 chapters | Gateway course emphasis
2. Grade 11 ELA: College Essay Writing Workshop
   - 3,000 words | 5 chapters | Common App focus
3. Grade 10 Science: Scientific Method & Lab Skills
   - 2,600 words | 4 chapters | Experimental design

COLLEGE ASPIRATION (Pillar 2)
4. Grade 7: Career Exploration & Interest Assessment
   - 2,400 words | 4 chapters | 16 career clusters
5. Grade 8: Understanding Gateway Courses
   - 2,500 words | 4 chapters | Algebra I importance
6. Grade 9: Academic Rigor (AP/IB/Dual Enrollment)
   - 2,800 words | 5 chapters | Comparing options
7. Grade 10: Mapping Your Rigor ✅ (COMPLETE)
   - 3,000 words | 4 chapters | Lifetime income connection

COLLEGE ENTRY (Pillar 3)
8. Grade 11: SC Scholarship Guide
   - 2,800 words | 6 chapters | LIFE, Palmetto Fellows, HOPE
9. Grade 12: FAFSA Completion Workshop
   - 2,900 words | 5 chapters | Step-by-step walkthrough
10. Grade 12: College Application Strategy
    - 3,200 words | 5 chapters | Common App, balanced list
```

**Each module includes:**
- Student Edition (interactive HTML with embedded activities)
- Teacher Edition (50-min lesson plan, differentiation strategies)
- Exit Ticket (3 questions, auto-graded)
- Multiple Choice Quiz (5 questions, auto-graded)
- Project/Performance Task (rubric provided)
- Readiness Accelerator (scaffolding for struggling readers)

---

═══════════════════════════════════════════════════════════════════

## PHASE 1: DATA MODEL (Server & Client Schema)

### 2.1 Core Firestore Collections

**Collection: `modules`**
```javascript
{
  module_id: "mod_algebra1_foundations",
  title: "Algebra I Foundations",
  grade: 9,
  subject: "Math",
  pillar: "Academic Preparation", // or "College Aspiration" or "College Entry"
  word_count: 2800,
  estimated_time_minutes: 60,
  
  student_content: {
    introduction: "string (HTML)",
    chapters: [
      {
        chapter_number: 1,
        title: "What Makes Algebra I a Gateway Course?",
        content: "string (HTML with embedded images, videos)",
        word_count: 400,
        activities: [
          {
            activity_id: "act_1_1",
            type: "text_response",
            prompt: "Calculate if you're on track for Algebra I...",
            rubric: "string"
          }
        ]
      },
      // ... more chapters
    ],
    summary: "string (HTML)",
    readiness_accelerator: "string (HTML, simplified version)"
  },
  
  teacher_guide: {
    objectives: ["string", "string", "string"],
    materials: ["Calculator", "Graph paper", "Handouts"],
    time_breakdown: {
      hook: 5,
      instruction: 10,
      guided_practice: 15,
      independent: 10,
      exit_ticket: 5,
      preview: 5
    },
    instructional_steps: "string (HTML)",
    differentiation: {
      struggling: "string",
      on_level: "string",
      advanced: "string"
    },
    common_misconceptions: ["string", "string"]
  },
  
  assessments: {
    exit_ticket: {
      questions: [
        {
          question_id: "et_1",
          text: "Solve: 5x - 3 = 2x + 9",
          type: "short_answer",
          correct_answer: "x = 4",
          points: 1
        },
        // ... 2 more questions
      ]
    },
    quiz: {
      questions: [
        {
          question_id: "q_1",
          text: "Solve 4x + 7 = 3x + 15",
          type: "multiple_choice",
          options: ["x = 2", "x = 6", "x = 8", "x = 22"],
          correct_answer: "x = 8",
          points: 1
        },
        // ... 4 more questions
      ]
    },
    project: {
      title: "My Algebra I Success Plan",
      description: "string (HTML)",
      rubric: {
        criteria: [
          {
            criterion: "Goal Setting",
            levels: {
              exceeds: "string",
              meets: "string",
              developing: "string",
              beginning: "string"
            },
            weight: 0.25
          },
          // ... 3 more criteria
        ]
      }
    }
  },
  
  federal_alignment: {
    gear_up_objective: 1, // 1-4 per 34 CFR § 694.21
    sc_standards: ["7.A.1.2", "7.A.2.1"],
    common_core: ["CCSS.MATH.7.EE.A.1"]
  },
  
  created_at: timestamp,
  updated_at: timestamp,
  published: true,
  version: "1.2"
}
```

**Collection: `students`**
```javascript
{
  student_id: "stu_12345",
  school_id: "school_manning_jh",
  district_id: "clarendon_sc",
  
  first_name: "Jayla",
  last_name: "Thompson",
  grade: 7,
  cohort_year: 2025, // Year they enter 7th grade (GEAR UP cohort tracking)
  
  demographics: {
    frl_status: true,
    ell_status: false,
    sped_status: false,
    race_ethnicity: "Black/African American",
    gender: "Female"
  },
  
  parent_email: "jthompson@parent.com",
  parent_phone: "+18035550123",
  parent_sms_opt_in: true,
  
  modules_completed: ["mod_career_exploration"], // array of module_ids
  modules_in_progress: ["mod_gateway_courses"],
  
  module_progress: [
    {
      module_id: "mod_career_exploration",
      started_at: timestamp,
      completed_at: timestamp,
      time_spent_minutes: 52,
      exit_ticket_score: 3, // out of 3
      quiz_score: 4, // out of 5
      project_submitted: true,
      project_score: 3.5 // out of 4.0 (rubric average)
    }
  ],
  
  college_readiness_milestones: {
    grade_7: {
      modules_required: 2,
      modules_completed: 1,
      status: "in_progress" // not_started | in_progress | completed
    },
    grade_8: {
      modules_required: 2,
      modules_completed: 0,
      status: "not_started"
    },
    // ... grades 9-12
  },
  
  fafsa_completion: {
    eligible: false, // true when grade 12
    completed: false,
    completion_date: null
  },
  
  created_at: timestamp,
  updated_at: timestamp
}
```

**Collection: `schools`**
```javascript
{
  school_id: "school_manning_jh",
  district_id: "clarendon_sc",
  state_director_id: "user_charlotte_parham",
  
  school_name: "Manning Junior High School",
  coordinator_name: "Lisa Johnson",
  coordinator_email: "ljohnson@manningjh.edu",
  
  grades_served: [6, 7, 8],
  gear_up_cohorts: [2024, 2025, 2026], // Cohort years active
  total_gear_up_students: 287,
  
  completion_metrics: {
    overall_completion_rate: 0.68, // % students completing 3+ modules/year
    by_grade: {
      7: 0.72,
      8: 0.65
    },
    by_pillar: {
      academic_preparation: 0.58,
      college_aspiration: 0.71,
      college_entry: 0.45
    }
  },
  
  equity_metrics: {
    completion_parity_index: 0.92, // 1.0 = perfect parity across subgroups
    subgroup_gaps: [
      {
        subgroup: "Black/African American",
        completion_rate: 0.64,
        gap_to_overall: -0.04
      },
      {
        subgroup: "Hispanic/Latino",
        completion_rate: 0.70,
        gap_to_overall: +0.02
      }
    ]
  },
  
  teacher_engagement: {
    teachers_using_platform: 12,
    total_teachers: 15,
    avg_modules_assigned_per_teacher: 4.2
  },
  
  created_at: timestamp,
  updated_at: timestamp
}
```

**Collection: `users` (Staff)**
```javascript
{
  user_id: "user_charlotte_parham",
  email: "cparham@sc.edu",
  firebase_uid: "firebase_uid_abc123",
  
  first_name: "Charlotte",
  last_name: "Parham",
  
  role: "state_director", // state_director | school_coordinator | teacher | parent
  
  // Role-specific fields
  district_id: "sc_gear_up", // for state director
  school_id: null, // null for state director
  
  // For teachers
  classes_taught: [], // array of class_ids
  
  // For parents
  children: [], // array of student_ids
  
  permissions: {
    view_all_schools: true, // state director only
    view_school_data: false,
    assign_modules: false,
    view_student_progress: false,
    export_apr_data: true // state director only
  },
  
  last_login: timestamp,
  created_at: timestamp
}
```

**Collection: `assignments`**
```javascript
{
  assignment_id: "assign_abc123",
  module_id: "mod_algebra1_foundations",
  
  assigned_by: "user_teacher_id",
  assigned_to_type: "student", // student | class | cohort
  assigned_to_ids: ["stu_12345"], // array of student_ids or class_ids
  
  school_id: "school_manning_jh",
  grade: 9,
  
  assigned_date: timestamp,
  due_date: timestamp,
  
  instructions: "Complete by Friday for extra credit discussion",
  
  completion_status: {
    total_assigned: 25,
    completed: 18,
    in_progress: 5,
    not_started: 2
  },
  
  created_at: timestamp
}
```

**Collection: `alerts`**
```javascript
{
  alert_id: "alert_abc123",
  student_id: "stu_12345",
  parent_id: "user_parent_id",
  
  alert_type: "module_not_started", // module_not_started | quiz_low_score | completion_milestone
  message: "Jayla has not started 'Algebra I Foundations' assigned 5 days ago",
  priority: "medium", // low | medium | high
  
  sent_at: timestamp,
  read_at: null,
  response_status: "no_response", // acknowledged | action_taken | no_response
  
  fcm_token: "fcm_token_for_push",
  delivery_status: "delivered" // pending | delivered | failed
}
```

**Collection: `district_dashboard`**
```javascript
{
  dashboard_id: "dash_2024_12",
  district_id: "sc_gear_up",
  month: "2024-12",
  
  students_served: 21868,
  schools_active: 36,
  
  completion_metrics: {
    overall_rate: 0.71,
    by_pillar: {
      academic_preparation: 0.65,
      college_aspiration: 0.73,
      college_entry: 0.52
    },
    by_grade: {
      7: 0.75,
      8: 0.70,
      9: 0.68,
      10: 0.72,
      11: 0.69,
      12: 0.67
    }
  },
  
  equity_metrics: {
    overall_parity_index: 0.88,
    subgroup_completion_rates: [
      {subgroup: "Black/African American", rate: 0.67},
      {subgroup: "Hispanic/Latino", rate: 0.71},
      {subgroup: "White", rate: 0.76},
      {subgroup: "FRL", rate: 0.68}
    ]
  },
  
  fafsa_completion: {
    eligible_students: 3654, // Grade 12 students
    completed: 3367,
    completion_rate: 0.921
  },
  
  apr_readiness: {
    data_complete: 0.97,
    missing_fields: ["2 students missing demographics"],
    export_ready: true
  },
  
  generated_at: timestamp
}
```

---

### 2.2 IndexedDB Client Cache Schema

```javascript
/**
 * SC GEAR UP Platform - Client Cache Schema
 * Purpose: Offline-first curriculum access
 * Library: localForage (IndexedDB wrapper)
 */

const gearupCacheSchema = {
  database_name: "gearup_curriculum",
  version: 1.0,
  
  stores: {
    /**
     * STUDENT MODULE LIBRARY
     * Stores: All available modules for this student's grade
     * Expires: 7 days (refresh weekly)
     */
    module_library: {
      key: "module_id",
      value: {
        module_id: "string",
        title: "string",
        grade: "number",
        subject: "string",
        pillar: "string",
        estimated_time: "number",
        student_content: "object (full HTML)",
        assessments: "object (questions)",
        completion_status: "string (not_started | in_progress | completed)",
        last_synced: "timestamp"
      }
    },
    
    /**
     * STUDENT PROGRESS CACHE
     * Stores: This student's completion data
     * Sync: Real-time when online, queue when offline
     */
    student_progress: {
      key: "student_id",
      value: {
        student_id: "string",
        modules_completed: "array<string>",
        modules_in_progress: "array<string>",
        current_module: {
          module_id: "string",
          current_chapter: "number",
          time_spent: "number",
          activities_completed: "array<string>"
        },
        college_readiness_progress: "object",
        last_synced: "timestamp"
      }
    },
    
    /**
     * TEACHER ASSIGNMENT CACHE
     * Stores: Assigned modules + student completion for this teacher's classes
     */
    teacher_assignments: {
      key: "assignment_id",
      value: {
        assignment_id: "string",
        module_id: "string",
        module_title: "string",
        assigned_to_ids: "array<string>",
        due_date: "timestamp",
        completion_status: {
          completed: "number",
          in_progress: "number",
          not_started: "number"
        },
        student_scores: [
          {
            student_id: "string",
            student_name: "string",
            exit_ticket_score: "number",
            quiz_score: "number",
            completion_date: "timestamp"
          }
        ],
        last_synced: "timestamp"
      }
    },
    
    /**
     * SCHOOL COORDINATOR DASHBOARD
     * Stores: School-wide metrics
     */
    coordinator_dashboard: {
      key: "school_id",
      value: {
        school_id: "string",
        completion_rate: "number",
        students_on_track: "number",
        students_falling_behind: "number",
        teacher_engagement: "number",
        equity_metrics: "object",
        recent_alerts: "array",
        last_synced: "timestamp"
      }
    },
    
    /**
     * PARENT DASHBOARD
     * Stores: This parent's children's progress
     */
    parent_dashboard: {
      key: "parent_id",
      value: {
        parent_id: "string",
        children: [
          {
            student_id: "string",
            name: "string",
            grade: "number",
            modules_completed: "number",
            modules_total: "number",
            recent_scores: "array",
            next_milestone: "string"
          }
        ],
        alerts: "array",
        last_synced: "timestamp"
      }
    },
    
    /**
     * OFFLINE QUEUE
     * Stores: Actions taken while offline
     */
    offline_queue: {
      key: "queue_id",
      value: {
        queue_id: "string",
        action_type: "string (complete_chapter | submit_exit_ticket | submit_quiz)",
        module_id: "string",
        data: "object (the update payload)",
        timestamp: "timestamp",
        retry_count: "number",
        status: "string (pending | synced | failed)"
      }
    }
  },
  
  expiration: {
    module_library: "7 days",
    student_progress: "real-time sync",
    teacher_assignments: "24 hours",
    coordinator_dashboard: "1 hour",
    parent_dashboard: "24 hours",
    offline_queue: "until synced"
  }
};
```

---

═══════════════════════════════════════════════════════════════════

## PHASE 3: NO SIMULATION ENGINE (N/A FOR GEAR UP)

**Note:** Unlike the MTSS platform, SC GEAR UP does not require predictive modeling or "What-If" simulations. The focus is on curriculum delivery, completion tracking, and federal compliance reporting.

**Instead, this phase covers:**

### 3.1 Content Delivery API

**Endpoint:** `GET /api/modules/{module_id}`

**Response:**
```json
{
  "module_id": "mod_algebra1_foundations",
  "title": "Algebra I Foundations",
  "grade": 9,
  "student_content": {
    "introduction": "<div>...</div>",
    "chapters": [
      {
        "chapter_number": 1,
        "title": "What Makes Algebra I a Gateway Course?",
        "content": "<div>...</div>",
        "activities": [...]
      }
    ]
  },
  "assessments": {
    "exit_ticket": {...},
    "quiz": {...}
  },
  "user_progress": {
    "started_at": "2024-12-15T10:00:00Z",
    "current_chapter": 2,
    "chapters_completed": [1],
    "time_spent_minutes": 23
  }
}
```

### 3.2 Progress Tracking API

**Endpoint:** `POST /api/progress/update`

**Request:**
```json
{
  "student_id": "stu_12345",
  "module_id": "mod_algebra1_foundations",
  "action": "complete_chapter",
  "chapter_number": 1,
  "time_spent_minutes": 15,
  "timestamp": "2024-12-19T14:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "progress_updated": true,
  "new_completion_percentage": 25,
  "next_action": "start_chapter_2"
}
```

### 3.3 APR Data Export API

**Endpoint:** `GET /api/reports/apr?year=2024&district=sc_gear_up`

**Response:** CSV download
```csv
student_id,grade,cohort_year,race_ethnicity,frl_status,modules_completed,fafsa_completed,high_school_graduation,college_enrollment
stu_12345,7,2025,Black/African American,Yes,3,N/A,N/A,N/A
stu_12346,12,2019,Hispanic/Latino,Yes,10,Yes,Yes,Yes
...
```

---

═══════════════════════════════════════════════════════════════════

## PHASE 4: UI/UX SPECIFICATIONS

### 4.1 Screen Inventory (18 Screens)

**State Director Role (4 screens):**
1. **District Dashboard** - 21,868 students, 36 schools, completion rates by pillar
2. **School Comparison** - Side-by-side metrics, equity gaps, coordinator contact
3. **APR Export** - One-click CSV download, data completeness check
4. **Equity Heatmap** - Subgroup completion rates by school (D3 matrix)

**School Coordinator Role (5 screens):**
5. **School Dashboard** - Completion rates, students falling behind, teacher engagement
6. **Student Roster** - Searchable list with completion status, alerts, quick actions
7. **Teacher Management** - Module assignment tracking, teacher usage stats
8. **Parent Communication** - Bulk messaging, alert history, SMS campaign tools
9. **Progress Reports** - Printable reports for principals, district meetings

**Teacher Role (4 screens):**
10. **Class Roster** - Student grid with module completion, scores, last activity
11. **Module Assignment** - Assign to student/class, set due dates, instructions
12. **Student Detail** - Full module history, assessment scores, time spent
13. **Grade Book** - Exit ticket/quiz scores, project rubric grading

**Student Role (3 screens):**
14. **Module Library** - Browse by grade/subject/pillar, search, filter completed
15. **Module Reader** - Interactive content view with chapter progress, activities
16. **My Progress** - Dashboard showing completed modules, badges, next milestones

**Parent Role (2 screens):**
17. **Child Dashboard** - Module completion, recent scores, college readiness pathway
18. **Alerts & Messages** - Push notifications, teacher messages, action items

---

### 4.2 Design System (Clean, Educational, Accessible)

**Color Tokens:**
```css
:root {
  /* Primary Palette (USC Garnet + Professional Blue) */
  --garnet: #73000A;
  --garnet-light: #A4000E;
  --blue-primary: #1E40AF;
  --blue-light: #3B82F6;
  
  /* Pillar Colors */
  --pillar-1-academic: #10B981; /* Green */
  --pillar-2-aspiration: #F59E0B; /* Gold */
  --pillar-3-entry: #8B5CF6; /* Purple */
  
  /* Status Colors */
  --status-complete: #10B981;
  --status-progress: #3B82F6;
  --status-not-started: #6B7280;
  --status-alert: #EF4444;
  
  /* Neutral Palette */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
}
```

**Component Library:**

```jsx
// 1. ModuleCard (Library view)
<ModuleCard
  module={{
    id: "mod_algebra1",
    title: "Algebra I Foundations",
    grade: 9,
    pillar: "Academic Preparation",
    estimated_time: 60,
    completion_status: "not_started"
  }}
  onClick={() => navigate(`/modules/${id}`)}
/>

// 2. ProgressRing (Circular completion indicator)
<ProgressRing
  value={0.68}
  size="large"
  color="pillar-1-academic"
  label="68% Complete"
/>

// 3. StudentCard (Coordinator roster view)
<StudentCard
  student={{
    name: "Jayla Thompson",
    grade: 7,
    modules_completed: 3,
    modules_total: 10,
    alerts: ["Module overdue"],
    last_activity: "2 days ago"
  }}
  onViewDetails={() => navigate(`/students/${id}`)}
/>

// 4. ChapterReader (Module content view)
<ChapterReader
  chapter={{
    number: 1,
    title: "What Makes Algebra I a Gateway Course?",
    content: "<div>...</div>",
    activities: [...]
  }}
  onComplete={() => markChapterComplete()}
/>

// 5. QuizPlayer (Assessment interface)
<QuizPlayer
  questions={[...]}
  onSubmit={(answers) => gradeQuiz(answers)}
  timeLimit={null}
  showFeedback={true}
/>

// 6. APRDataTable (State director export view)
<APRDataTable
  data={studentRecords}
  columns={["Student ID", "Grade", "Modules Completed", "FAFSA"]}
  onExport={() => downloadCSV()}
  filters={{grade: [7,8,9,10,11,12], school: "all"}}
/>
```

**Typography:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

h1 { font-size: 2.25rem; font-weight: 800; }
h2 { font-size: 1.875rem; font-weight: 700; }
h3 { font-size: 1.5rem; font-weight: 600; }
h4 { font-size: 1.25rem; font-weight: 600; }

/* Module content styling */
.module-content h3 { margin-top: 2rem; }
.module-content p { margin-bottom: 1rem; }
.module-content ul { margin-left: 1.5rem; }
```

---

═══════════════════════════════════════════════════════════════════

## PHASE 5: ROLE MATRIX & PERMISSIONS

### 5.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function getUserSchool() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.school_id;
    }
    
    // MODULES collection (read-only for all authenticated users)
    match /modules/{moduleId} {
      allow read: if isAuthenticated();
      allow write: if getUserRole() == 'state_director'; // Only admin can edit curriculum
    }
    
    // STUDENTS collection
    match /students/{studentId} {
      allow read: if isAuthenticated() && (
        getUserRole() == 'state_director' ||
        (getUserRole() == 'school_coordinator' && resource.data.school_id == getUserSchool()) ||
        (getUserRole() == 'teacher' && studentId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.students_taught) ||
        (getUserRole() == 'parent' && studentId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.children) ||
        (getUserRole() == 'student' && studentId == request.auth.uid)
      );
      
      allow update: if isAuthenticated() && (
        getUserRole() in ['state_director', 'school_coordinator', 'teacher'] ||
        (getUserRole() == 'student' && studentId == request.auth.uid && 
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['module_progress', 'modules_completed', 'modules_in_progress']))
      );
    }
    
    // SCHOOLS collection
    match /schools/{schoolId} {
      allow read: if isAuthenticated() && (
        getUserRole() == 'state_director' ||
        (getUserRole() in ['school_coordinator', 'teacher'] && schoolId == getUserSchool())
      );
      
      allow write: if getUserRole() in ['state_director', 'school_coordinator'];
    }
    
    // ASSIGNMENTS collection
    match /assignments/{assignmentId} {
      allow read: if isAuthenticated();
      allow create, update: if getUserRole() in ['state_director', 'school_coordinator', 'teacher'];
      allow delete: if getUserRole() in ['state_director', 'teacher'] && resource.data.assigned_by == request.auth.uid;
    }
    
    // ALERTS collection
    match /alerts/{alertId} {
      allow read: if isAuthenticated() && (
        getUserRole() in ['state_director', 'school_coordinator', 'teacher'] ||
        (getUserRole() == 'parent' && resource.data.parent_id == request.auth.uid)
      );
      
      allow create: if getUserRole() in ['state_director', 'school_coordinator', 'teacher'];
      allow update: if getUserRole() == 'parent' && resource.data.parent_id == request.auth.uid;
    }
    
    // DISTRICT_DASHBOARD collection (state director only)
    match /district_dashboard/{dashId} {
      allow read: if getUserRole() == 'state_director';
      allow write: if false; // Only Cloud Functions write here
    }
  }
}
```

### 5.2 Conflict Resolution Matrix

**Scenario 1: Student completes chapter while offline, teacher assigns same module**
- **Detection:** Student has cached progress, assignment created server-side
- **Resolution:**
  - Merge: Student's offline progress + teacher's assignment
  - Student sees assignment notification with current progress intact
  - No data loss

**Scenario 2: Parent and coordinator both update student alert status**
- **Detection:** Concurrent writes to `alerts/{id}/response_status`
- **Resolution:**
  - Timestamp-based: Most recent write wins
  - Audit log: Record both actions with timestamps
  - Notify both users of conflict

---

═══════════════════════════════════════════════════════════════════

## PHASE 6: MESSAGING SYSTEM

### 6.1 Channel Definitions

**1. Push Notifications (Firebase Cloud Messaging)**

Triggers:
- Parent: Child hasn't started assigned module (3 days after assignment)
- Parent: Child scored <70% on quiz
- Parent: Child completed milestone (5 modules, 10 modules)
- Coordinator: Student falling behind (completion rate <50%)
- Teacher: Assignment due tomorrow reminder

**2. In-App Messages**
- Teacher → Student: "Great job on your essay quiz!"
- Coordinator → Parent: Bulk message about FAFSA workshop
- Teacher → Coordinator: Request for struggling student support

**3. Email Reports (SendGrid)**
- Weekly parent digest: "Jayla completed 2 modules this week"
- Monthly coordinator report: School completion metrics
- Quarterly state director APR preview

**4. SMS (Twilio, opt-in only)**
- High-priority only: FAFSA deadline approaching (Grade 12 students)
- Example: "FAFSA deadline is Jan 15. Complete the FAFSA Workshop module today!"

---

### 6.2 Escalation Rules

**Rule 1: Module Overdue**
```
Trigger: Assigned module not started 7 days after due date
Actions:
  1. Send parent push notification
  2. If no app open in 48 hours → send email
  3. Flag student in coordinator dashboard
  4. Auto-suggest teacher check-in
```

**Rule 2: Low Quiz Score**
```
Trigger: Student scores <70% on module quiz
Actions:
  1. Send student in-app message with resources
  2. Notify parent via push
  3. Flag in teacher gradebook for re-teaching
  4. Recommend Readiness Accelerator content
```

**Rule 3: Cohort Falling Behind**
```
Trigger: School completion rate <60% (below district average)
Actions:
  1. Alert school coordinator
  2. Generate action plan recommendations (AI)
  3. Notify state director if <50% after 30 days
  4. Schedule coordinator check-in with state director
```

---

═══════════════════════════════════════════════════════════════════

## PHASE 7: TECHNICAL STACK & PERFORMANCE

### 7.1 Technology Stack

```yaml
Frontend:
  Framework: React 18 with TypeScript
  Routing: React Router v6
  State: Zustand (lightweight global state)
  UI: Custom components + Tailwind CSS
  Content Rendering: react-markdown (for module HTML)
  Offline: Service Workers + localForage (IndexedDB)

Backend:
  Runtime: Firebase Cloud Functions (Node.js 18)
  Database: Firestore (document store)
  Auth: Firebase Authentication
  Storage: Firebase Storage (PDFs, teacher guides)
  Messaging: Firebase Cloud Messaging (FCM)

Analytics:
  Warehouse: Google BigQuery (APR data export)
  Monitoring: Sentry (error tracking)
  Analytics: Google Analytics 4 (usage tracking)

Mobile:
  Framework: React Native (Expo)
  Fallback: PWA

Deployment:
  Frontend: Vercel
  Functions: Google Cloud Run
  CDN: Cloudflare
  Domain: scgearup-modules.org (example)

DevOps:
  VCS: GitHub
  CI/CD: GitHub Actions
  Testing: Jest + Cypress
```

### 7.2 Performance SLOs

```yaml
Module Load Time:
  Metric: Time to render full module content
  Target: ≤1.5 seconds (95th percentile)
  
Dashboard Load:
  Metric: TTI for student/parent/coordinator dashboards
  Target: ≤2 seconds
  
Quiz Submission:
  Metric: Time from submit to graded results
  Target: ≤3 seconds
  
Offline Sync:
  Metric: Time to sync progress after reconnection
  Target: ≤20 seconds for <50 queued items
  
Concurrent Users:
  Metric: Simultaneous students reading modules
  Target: 1,000+ without degradation
  
Uptime:
  Target: 99.5% (max 3.6 hours downtime per month)
```

### 7.3 Security & Compliance

**FERPA:**
- PII encrypted at rest
- Role-based access (see Phase 5)
- 7-year audit log retention

**COPPA:**
- Parental consent for students <13
- No advertising, no data selling
- Parent opt-out mechanism

**Accessibility (WCAG 2.1 AA):**
- Screen reader compatible
- Keyboard navigation
- Color contrast ratios ≥4.5:1
- Alt text for all images

---

═══════════════════════════════════════════════════════════════════

## PHASE 8: DEPLOYMENT & ONBOARDING

### 8.1 Pilot Rollout (4 Weeks - January 2025)

**Week 1: Setup**
- Deploy Firestore schema
- Create 10 module documents (content loaded)
- Set up 2-3 pilot schools (Manning JH + 2 others)
- Import student rosters (CSV)

**Week 2: Training**
- School coordinator training (2 hours each school)
- Teacher workshop (1 hour, show module assignment)
- Student orientation (30 min, how to use platform)

**Week 3: Active Use**
- Students start completing modules
- Teachers monitor progress
- Coordinators track school metrics
- Daily check-ins with pilot schools

**Week 4: Feedback & Iteration**
- Collect NPS from all roles
- Bug fixes based on usage
- Module content tweaks
- Plan expansion to remaining 33 schools

---

### 8.2 District Onboarding Checklist

```markdown
## PRE-LAUNCH

[ ] Student Roster CSV
    - Columns: student_id, first_name, last_name, grade, cohort_year, school_id
    - Demographics: frl_status, ell_status, race_ethnicity
    - Source: SIS (PowerSchool, Infinite Campus, etc.)

[ ] Staff Directory
    - Coordinators, teachers (with Google Workspace emails for SSO)
    - Format: Google Sheet

[ ] Parent Contacts
    - Email, phone (for push notification opt-in)
    - SMS consent (yes/no)

[ ] Module Content Review
    - State director reviews all 10 modules
    - Approve or request edits
    - Confirm federal alignment

## LAUNCH WEEK

[ ] Coordinator Training (2 hours per school)
    - Dashboard navigation
    - Student roster management
    - Assignment workflows
    - Parent communication tools

[ ] Teacher Training (1 hour)
    - How to assign modules
    - How to view student progress
    - Grading exit tickets/quizzes

[ ] Student Orientation (30 min)
    - Login with Google
    - Browse module library
    - Complete first module walkthrough

[ ] Parent Onboarding
    - Email: "Track your child's college readiness"
    - App download links
    - SMS opt-in campaign

## POST-LAUNCH (30 days)

[ ] Weekly Metrics Review
    - Completion rates by school
    - Student engagement (time spent)
    - Teacher usage

[ ] Monthly Coordinator Check-In
    - What's working?
    - What needs improvement?
    - Module content feedback

[ ] APR Data Validation
    - Test CSV export
    - Verify all required fields present
```

---

═══════════════════════════════════════════════════════════════════

## PHASE 9: SUCCESS METRICS

### 9.1 90-Day Pilot Success Criteria

**TECHNICAL:**
```
Uptime: ≥99%
Module load time: ≤1.5s
Zero critical data loss incidents
Offline sync success: ≥95%
```

**USAGE:**
```
Student engagement: 80%+ complete 3+ modules
Teacher usage: 85%+ assign at least 1 module/week
Parent app adoption: 75%+ download app
Coordinator daily login: 90%+
```

**OUTCOMES:**
```
Module completion rate: 75%+ students complete assigned modules
Quiz pass rate: 70%+ students score ≥70%
Federal alignment: 100% modules map to 34 CFR § 694.21
APR data completeness: 95%+
```

**FINANCIAL:**
```
Pilot cost: $15,000 - $25,000 (3 schools)
Pilot ARR: $50,000 (if scaled to all 36 schools = $600K total)
Customer satisfaction: NPS ≥50
```

**RED LINE:**
```
Any metric <75% → pause expansion
Student engagement <70% → content/UX overhaul required
Zero schools renew after pilot → project termination
```

---

═══════════════════════════════════════════════════════════════════

## SIGN-OFF CHECKLIST

```
Before development begins, confirm ALL phases complete:

[ ] Phase 0: Product Definition
    - 5 roles mapped with daily actions
    - Federal GEAR UP objectives documented
    - 10 modules scoped
    
[ ] Phase 1: Data Model
    - 8 Firestore collections defined
    - IndexedDB cache schema
    
[ ] Phase 3: APIs (not simulation - content delivery)
    - Module fetch API
    - Progress tracking API
    - APR export API
    
[ ] Phase 4: UI/UX
    - 18 screens inventoried
    - Component library
    
[ ] Phase 5: RBAC
    - Security rules for 5 roles
    - Conflict resolution
    
[ ] Phase 6: Messaging
    - 4 channels (FCM, in-app, email, SMS)
    - Escalation rules
    
[ ] Phase 7: Tech Stack
    - React + Firebase locked
    - Performance SLOs
    - FERPA/COPPA compliance
    
[ ] Phase 8: Deployment
    - 4-week pilot plan
    - Onboarding checklist
    
[ ] Phase 9: Metrics
    - 90-day success criteria
    - Red line thresholds

═══════════════════════════════════════════════════════════════════

SIGNATURES:

Product Owner (Q. Kelly): _____________ Date: _______

State Director (Dr. Parham): __________ Date: _______

Engineering Lead: _____________________ Date: _______

All 9 phases confirmed complete.
Development authorized to begin January 2025.

═══════════════════════════════════════════════════════════════════
