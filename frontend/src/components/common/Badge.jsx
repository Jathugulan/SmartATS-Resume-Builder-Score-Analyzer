export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'tone-slate border',
    success: 'tone-success border',
    warning: 'tone-warning border',
    danger: 'tone-danger border',
    info: 'tone-info border',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
