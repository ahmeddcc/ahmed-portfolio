import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500'
};

// 🛠️ Fixed: Individual Toast item with self-managed timer
function ToastItem({ toast, removeToast }) {
  const timerRef = useRef(null);

  useEffect(() => {
    // Auto-remove after duration (default 4 seconds)
    const duration = toast.duration || 4000;
    timerRef.current = setTimeout(() => {
      removeToast(toast.id);
    }, duration);

    // 🛠️ Cleanup: Clear timeout if removed manually or unmounted
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [toast.id, toast.duration, removeToast]);

  const Icon = icons[toast.type] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${colors[toast.type]}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
        <p className="text-sm opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </motion.div>
  );
}

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            removeToast={removeToast} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
