import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? { whileHover: { y: -2 }, transition: { duration: 0.15 } }
    : {};

  return (
    <Component
      className={`rounded-2xl border shadow-xl backdrop-blur-md transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: 'var(--bg-card, #16181e)',
        borderColor: 'var(--border-base, rgba(255, 255, 255, 0.10))',
        color: 'var(--text-primary, #f0f2f7)',
      }}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}


