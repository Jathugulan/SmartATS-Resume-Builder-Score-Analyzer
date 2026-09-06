import AuthPage from '../components/auth/AuthPage';

// Dedicated Sign In page (distinct route from Sign Up).
export default function Login() {
  return <AuthPage isSignup={false} />;
}

