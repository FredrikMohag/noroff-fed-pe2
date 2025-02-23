// useAuth.js
import { useState } from 'react';
import authService from '../features/auth/authService'; // Ensure correct import of authService

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login({ email, password });
      return userData;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useAuth;
