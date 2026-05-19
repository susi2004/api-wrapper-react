import { useEffect, useState } from 'react';
import './toast.css';

const toastListeners = new Set();

function sendToast(type, message) {
  toastListeners.forEach((listener) => listener({ type, message }));
}

export const toast = {
  success: (message) => sendToast('success', message),
  error: (message) => sendToast('error', message),
  info: (message) => sendToast('info', message),
  warning: (message) => sendToast('warning', message),
  retry: (message) => sendToast('warning', message),
};

export function ToastContainer({ autoClose = 1600 }) {
  const [toastList, setToastList] = useState([]);

  useEffect(() => {
    const onToast = ({ type, message }) => {
      const id = Date.now() + Math.random();
      setToastList((oldList) => [...oldList, { id, type, message }]);

      if (autoClose) {
        setTimeout(() => {
          setToastList((oldList) => oldList.filter((item) => item.id !== id));
        }, autoClose);
      }
    };

    toastListeners.add(onToast);
    return () => {
      toastListeners.delete(onToast);
    };
  }, [autoClose]);

  return (
    <div className="toast-box">
      {toastList.map((item) => (
        <div key={item.id} className={`toast-card ${item.type}`}>
          <div className="toast-message">
            <span className="toast-icon">
              {item.type === 'success' && '✓'}
              {item.type === 'error' && '✕'}
              {item.type === 'warning' && '⚠'}
              {item.type === 'info' && 'ℹ'}
            </span>
            <span>{item.message}</span>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToastList((oldList) => oldList.filter((toastItem) => toastItem.id !== item.id))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
