export default function Skeleton({ className = '', lines = 1 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="bg-slate-200 rounded h-4 mb-2 last:mb-0" style={{ width: `${100 - (i % 3) * 12}%` }} />
      ))}
    </div>
  );
}
