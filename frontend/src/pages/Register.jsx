import AuthPage from '../components/auth/AuthPage';

// Dedicated Sign Up page (distinct route from Sign In).
export default function Register() {
  return <AuthPage isSignup />;
}

