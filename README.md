# North Star Student Success OS

A production-ready, role-based student success platform built with React, Node.js, and MongoDB. Supports end-to-end curriculum/module delivery, assignments, progress tracking, dashboards for staff, and parent visibility.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite, React Router, TanStack Query, Zustand, Tailwind CSS
- **Backend**: Node.js (Express) + TypeScript
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT-based authentication with role-based access control (RBAC)
- **Deployment**: Railway (frontend + backend + MongoDB)
- **Architecture**: Monorepo with pnpm workspaces

## Project Structure

```
.
├── apps/
│   ├── api/          # Express backend API
│   └── web/          # React frontend
├── packages/
│   └── shared/       # Shared TypeScript types and Zod schemas
└── package.json      # Root workspace configuration
```

## Roles

The platform supports five roles with distinct permissions and dashboards:

- **state_director**: District-wide oversight, APR exports, equity analysis
- **school_coordinator**: School-level management, student roster, teacher management
- **teacher**: Class management, module assignments, grading
- **student**: Module library, reading, progress tracking
- **parent**: Child progress visibility, alerts and messages

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GEARUP_Platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

**Backend (`apps/api/.env`):**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/northstar
JWT_SECRET=your-secret-key-change-in-production
```

**Frontend (`apps/web/.env`):**
```env
VITE_API_URL=http://localhost:3001/api
```

4. Seed the database:
```bash
pnpm seed
```

This creates test accounts:
- Director: `director@northstar.edu` / `director123`
- Coordinator: `coordinator@northstar.edu` / `coordinator123`
- Teacher: `teacher@northstar.edu` / `teacher123`
- Student: `student@northstar.edu` / `student123`
- Parent: `parent@northstar.edu` / `parent123`

### Development

Run both frontend and backend in development mode:

```bash
pnpm dev
```

Or run individually:

```bash
# Backend only
cd apps/api
pnpm dev

# Frontend only
cd apps/web
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (director only)
- `GET /api/auth/me` - Get current user

### Modules
- `GET /api/modules` - List modules (with filters)
- `GET /api/modules/:moduleId` - Get module details
- `POST /api/modules` - Create module (director only)
- `PUT /api/modules/:moduleId` - Update module (director only)

### Assignments
- `GET /api/assignments` - List assignments (role-scoped)
- `GET /api/assignments/:id` - Get assignment
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Progress
- `POST /api/progress/update` - Update student progress

### Alerts
- `GET /api/alerts` - List alerts (role-scoped)
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert (acknowledge, etc.)

### Dashboards
- `GET /api/dashboard/district` - District dashboard (director)
- `GET /api/dashboard/school` - School dashboard (coordinator)
- `GET /api/dashboard/teacher` - Teacher dashboard
- `GET /api/dashboard/student` - Student dashboard
- `GET /api/dashboard/parent` - Parent dashboard

### Reports
- `GET /api/reports/apr?year=YYYY&district=ID` - APR CSV export
- `GET /api/reports/data-completeness?district=ID` - Data completeness report

## Features

### Offline-First Support
The frontend implements offline-first functionality using IndexedDB (localForage):
- Module library caching (7-day expiration)
- Student progress caching
- Offline action queue with automatic sync on reconnect

### Role-Based Access Control (RBAC)
- JWT-based authentication
- Role-based route protection
- Data scoping by role (director → district, coordinator → school, teacher → assigned students, etc.)

### Core Screens

**State Director:**
- District Dashboard (completion metrics, equity metrics, FAFSA completion, data completeness)
- School Comparison (filterable)
- APR Export (CSV download)
- Equity Heatmap

**School Coordinator:**
- School Dashboard
- Student Roster (search + filters)
- Teacher Management
- Parent Communication (bulk messaging)
- Progress Reports

**Teacher:**
- Class Roster
- Module Assignment (assign to student/class, due date, instructions)
- Student Detail (module history, scores, time spent)
- Gradebook (exit ticket/quiz scores; project rubric scoring)

**Student:**
- Module Library (browse + filters)
- Module Reader (chapter progress + activities)
- My Progress (badges/milestones)

**Parent:**
- Child Dashboard (progress + recent scores)
- Alerts & Messages (acknowledge, status)

## Deployment to Railway

### Backend Deployment

1. Create a new Railway project
2. Add MongoDB service (or use MongoDB Atlas)
3. Connect your GitHub repository
4. Set environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `PORT` - Railway will set this automatically

5. Railway will automatically detect the `railway.json` config and build/deploy

### Frontend Deployment

1. Create a new Railway project (or use the same project with multiple services)
2. Connect your GitHub repository
3. Set environment variables:
   - `VITE_API_URL` - Your backend API URL (e.g., `https://your-api.railway.app/api`)

4. Railway will build and deploy the frontend

### Environment Variables Summary

**Backend:**
- `MONGODB_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `PORT` - Server port (optional, defaults to 3001)

**Frontend:**
- `VITE_API_URL` - Backend API URL (required for production)

## Testing

Run tests:
```bash
pnpm test
```

## Linting

Run ESLint:
```bash
pnpm lint
```

## Building for Production

Build all packages:
```bash
pnpm build
```

## Data Model

The platform uses MongoDB with the following main collections:
- **Users**: Authentication and user profiles
- **Students**: Student records with progress tracking
- **Modules**: Curriculum modules with content and assessments
- **Schools**: School information and metrics
- **Assignments**: Module assignments to students/classes
- **Alerts**: Parent alerts and notifications
- **DistrictDashboard**: Materialized monthly dashboard snapshots

## License

[Your License Here]

## Support

For issues and questions, please open an issue in the repository.



