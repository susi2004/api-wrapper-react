import { useEffect, useState } from 'react';
import './toast.css';

const listeners = new Set();

function notify(type, message) {
  listeners.forEach((listener) => listener({ type, message }));
}

export const toast = {
  success: (message) => notify('success', message),
  error: (message) => notify('error', message),
  info: (message) => notify('info', message),
  warning: (message) => notify('warning', message),
  retry: (message) => notify('warning', message),
};

export function ToastContainer({ autoClose = 1600 }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (payload) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...payload, id }]);

      if (autoClose) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toastItem) => toastItem.id !== id));
        }, autoClose);
      }
    };

    listeners.add(handler);
    return () => listeners.delete(handler);
  }, [autoClose]);

  return (
    <div className="toast-box">
      {toasts.map((toastItem) => (
        <div key={toastItem.id} className={`toast-card ${toastItem.type}`}>
          <div className="toast-message">
            <span className="toast-icon">
              {toastItem.type === 'success' && '✓'}
              {toastItem.type === 'error' && '✕'}
              {toastItem.type === 'warning' && '⚠'}
              {toastItem.type === 'info' && 'ℹ'}
            </span>
            <span>{toastItem.message}</span>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toastItem.id))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
