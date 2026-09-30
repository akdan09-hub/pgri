import React, { useEffect } from 'react';
import { CheckCircle2, Bell, X, ExternalLink } from 'lucide-react';

interface ToastProps {
  message: string;
  subMessage?: string;
  onClose: () => void;
  onClick?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, subMessage, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 animate-slide-up flex items-start gap-3">
      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 mt-0.5">
        <Bell className="w-5 h-5 animate-bounce" />
      </div>

      <div className="flex-1 min-w-0" onClick={onClick} role={onClick ? 'button' : undefined}>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Update Data Real-Time</span>
        </div>
        <div className="font-bold text-slate-100 text-sm mt-0.5 line-clamp-2">
          {message}
        </div>
        {subMessage && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {subMessage}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
