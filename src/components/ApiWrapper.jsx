import { useEffect, useState } from 'react';
import usersData from '../assets/users.json';
import './ApiWrapper.css';

function ApiWrapper({ dataSource = usersData, simulateError = false }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Start every load in a clean state, just like a real API request.
    setLoading(true);
    setError('');
    setShowSnackbar(false);

    const timer = setTimeout(() => {
      if (simulateError) {
        setUsers([]);
        setError('Something went wrong while loading users. Please try again.');
        setLoading(false);
        return;
      }

      setUsers(dataSource);
      setLoading(false);
      setShowSnackbar(true);
    }, 1200);

    // Clear the timer if the component unmounts before loading finishes.
    return () => clearTimeout(timer);
  }, [dataSource, simulateError, retryCount]);

  useEffect(() => {
    if (!showSnackbar) {
      return undefined;
    }

    const snackbarTimer = setTimeout(() => {
      setShowSnackbar(false);
    }, 2500);

    return () => clearTimeout(snackbarTimer);
  }, [showSnackbar]);

  const handleRetry = () => {
    setRetryCount((currentCount) => currentCount + 1);
  };

  return (
    <main className="api-page">
      <section className="api-wrapper-card">
        <div className="api-header">
          <p className="api-eyebrow">Local JSON Demo</p>
          <h1>Smart API Wrapper</h1>
          <p>
            This component simulates an API call with local JSON data, so it is
            easy to understand and safe to run without a backend.
          </p>
        </div>

        <button className="retry-button" type="button" onClick={handleRetry}>
          Retry
        </button>

        {loading && (
          <div className="status-box">
            <div className="spinner" aria-label="Loading users" />
            <p>Loading users...</p>
          </div>
        )}

        {!loading && error && (
          <div className="status-box error-box">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="status-box empty-box">
            <p>No users found.</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="user-grid">
            {users.map((user) => (
              <article className="user-card" key={user.id}>
                <div className="avatar">{user.name.charAt(0)}</div>
                <div>
                  <h2>{user.name}</h2>
                  <p>{user.role}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showSnackbar && (
        <div className="snackbar" role="status">
          Users loaded successfully!
        </div>
      )}
    </main>
  );
}

export default ApiWrapper;
