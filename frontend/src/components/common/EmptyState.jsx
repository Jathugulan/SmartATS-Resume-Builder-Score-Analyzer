import { FileSearch } from 'lucide-react';

export default function EmptyState({ icon: Icon = FileSearch, title = 'Nothing here yet', description = '', action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="w-14 h-14 rounded-full icon-tile mb-4">
        <Icon color="var(--text-secondary)" size={28} />
      </div>
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {description && <p className="max-w-md mb-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>}
      {action}
    </div>
  );
}
