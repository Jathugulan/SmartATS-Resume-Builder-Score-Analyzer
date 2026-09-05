import { FileSearch } from 'lucide-react';

export default function EmptyState({ icon: Icon = FileSearch, title = 'Nothing here yet', description = '', action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="text-slate-400" size={28} />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      {description && <p className="text-slate-500 max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}
