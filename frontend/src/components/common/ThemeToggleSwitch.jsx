import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggleSwitch({ className = '', showLabel = false, size = 'md' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-xs font-medium text-slate-400 select-none">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer select-none ${
          isSmall ? 'w-11 h-6' : 'w-14 h-7.5'
        }`}
        style={{
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(226, 232, 240, 0.95)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.15)',
          boxShadow: isDark
            ? 'inset 0 1px 3px rgba(0,0,0,0.4), 0 0 10px rgba(99, 102, 241, 0.15)'
            : 'inset 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)',
        }}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        {/* Background Icons on track */}
        <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
          <Sun className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-500 opacity-80`} />
          <Moon className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-indigo-400 opacity-80`} />
        </div>

        {/* Sliding Thumb Knob */}
        <motion.div
          animate={{
            x: isDark ? (isSmall ? 20 : 26) : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`rounded-full shadow-md flex items-center justify-center z-10 ${
            isSmall ? 'w-5 h-5' : 'w-6.5 h-6.5'
          }`}
          style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark
              ? '0 2px 6px rgba(0,0,0,0.5), 0 0 8px rgba(99, 102, 241, 0.3)'
              : '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          {isDark ? (
            <Moon className={`${isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} text-indigo-300`} />
          ) : (
            <Sun className={`${isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} text-amber-500`} />
          )}
        </motion.div>
      </button>
    </div>
  );
}
