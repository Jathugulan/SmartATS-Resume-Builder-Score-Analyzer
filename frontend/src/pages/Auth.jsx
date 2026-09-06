import { Navigate, useSearchParams } from 'react-router-dom';

// Legacy /auth entry point. Sign In and Sign Up are separate dedicated pages,
// so this forwards to the appropriate one based on the ?mode= query param.
export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  return <Navigate to={mode === 'signup' ? '/register' : '/login'} replace />;
}

