import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)' }}>
        <LoadingSpinner size={32} className="text-blue-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  return children;
}
