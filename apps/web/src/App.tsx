import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { initSyncWorker } from './store/offlineStore';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import StateDirectorRoutes from './routes/StateDirectorRoutes';
import CoordinatorRoutes from './routes/CoordinatorRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import StudentRoutes from './routes/StudentRoutes';
import ParentRoutes from './routes/ParentRoutes';

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
    initSyncWorker();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/director/*" element={<StateDirectorRoutes />} />
                <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
                <Route path="/teacher/*" element={<TeacherRoutes />} />
                <Route path="/student/*" element={<StudentRoutes />} />
                <Route path="/parent/*" element={<ParentRoutes />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



