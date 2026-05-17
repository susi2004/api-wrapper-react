import React, { useEffect, useState } from 'react';
import ApiWrapper from './ApiWrapper';

function UserComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
    );
      const response = await fetch('/src/assets/users.json');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <ApiWrapper
      title="Users List"
      description="Users fetched from local Api."
      data={users}
      loading={loading}
      error={error}
      onRetry={fetchUsers}
      successMessage="Users loaded successfully!"
      renderItem={(user) => (
          <div>
            <h2>{user.name}</h2>
            <p>{user.role}</p>
          </div>
      )
}
      itemsPerPage={3}
    />
  );
}

export default UserComponent;