import { useEffect, useState } from 'react';
import ApiWrapper from './ApiWrapper';

function UserComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/src/assets/users.json');

      if (!response.ok) {
        throw new Error('Failed to fetch users data.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (fetchError) {
      setError(fetchError.message);
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
      type="users"
      title="Users Directory"
      description="Browse all team members with search, retry, and pagination support."
      data={users}
      loading={loading}
      error={error}
      onRetry={fetchUsers}
      itemsPerPage={4}
      successMessage="Users loaded successfully!"
    />
  );
}

export default UserComponent;
