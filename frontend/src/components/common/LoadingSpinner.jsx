import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 20, className = '' }) {
  return (
    <Loader2 className={`animate-spin ${className}`} size={size} />
  );
}
