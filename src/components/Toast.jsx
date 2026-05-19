import React, { useState, useEffect } from "react";
import "./Toast.css";

const listeners = new Set();

function notify(type, message) {
  const payload = { type, message };
  listeners.forEach((fn) => fn(payload));
}

export const toast = {
  success: (msg) => notify("success", msg),
  error: (msg) => notify("error", msg),
  info: (msg) => notify("info", msg),
  warning: (msg) => notify("warning", msg),
  retry: (msg) => notify("warning", msg),
  loading: (msg) => notify("loading", msg),
};

export function ToastContainer({ autoClose = 9000 }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handler(t) {
      const id = Date.now() + Math.random();
      setToasts((s) => [...s, { ...t, id }]);

      if (autoClose && t.type !== "loading") {
        setTimeout(() => {
          setToasts((s) => s.filter((x) => x.id !== id));
        }, autoClose);
      }
    }
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, [autoClose]);
  return (
    <div className="toast-box"> 
      {toasts.map((t) => (
        <div key={t.id} className={`toast-card ${t.type}`}>
          <div className="toast-message">
            {t.type !== "loading" && (
              <span className="toast-icon">
                {t.type === "success" && "✓"}
                {t.type === "error" && "✕"}
                {t.type === "warning" && "⚠"}
                {t.type === "info" && "ℹ"}
              </span>
            )}
            {t.type === "loading" && <span className="spinner"></span>}

            <span>{t.message}</span>
          </div>

          <span
            className="toast-close"
            onClick={() =>
              setToasts((s) => s.filter((x) => x.id !== t.id))
            }
          >
            ✕
          </span>
          {t.type !== "loading" && (
            <div
              className="toast-progress"
              style={{ animationDuration: `${autoClose}ms` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
export default ToastContainer;