import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress the framer-motion / PerformanceObserver TypeError that originates
// from browser-extension VM scripts (React DevTools, web-vitals, etc.).
// These are not application errors — they come from injected code that reads
// PerformanceEntry.startTime before the entry is fully initialised.
const _originalOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (
    typeof message === 'string' &&
    message.includes("Cannot read properties of undefined") &&
    message.includes("'startTime'") &&
    typeof source === 'string' &&
    (source.includes('VM') || source === '')
  ) {
    return true; // suppressed — not an app error
  }
  return _originalOnError ? _originalOnError(message, source, lineno, colno, error) : false;
};

createRoot(document.getElementById('root')).render(<App />);
