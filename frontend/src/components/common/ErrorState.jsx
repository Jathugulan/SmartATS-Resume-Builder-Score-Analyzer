import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong', onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="w-14 h-14 rounded-full mb-4 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-danger)', color: 'var(--text-danger)' }}
      >
        <AlertCircle size={28} />
      </div>
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Error</h3>
      <p className="max-w-md mb-6" style={{ color: 'var(--text-secondary)' }}>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
