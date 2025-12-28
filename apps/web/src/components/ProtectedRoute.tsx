import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  if (user) {
    const rolePath = {
      state_director: '/director',
      school_coordinator: '/coordinator',
      teacher: '/teacher',
      student: '/student',
      parent: '/parent',
    }[user.role];

    if (rolePath && !window.location.pathname.startsWith(rolePath)) {
      return <Navigate to={rolePath} />;
    }
  }

  return <>{children}</>;
}



