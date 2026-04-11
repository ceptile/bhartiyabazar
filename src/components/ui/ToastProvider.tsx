'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';

type Toast = { id: string; message: string; type: 'success'|'error'|'info'; };
type ToastCtx = { showToast: (msg: string, type?: Toast['type']) => void; };

export const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const classes = { success: 'toast toast-success', error: 'toast toast-error', info: 'toast toast-info' };

  return (
    <>
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={classes[t.type]}>
            <span>{icons[t.type]}</span>
            <span style={{ flex:1,fontSize:14 }}>{t.message}</span>
            <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:16,padding:0 }}>×</button>
          </div>
        ))}
      </div>
    </>
  );
}
