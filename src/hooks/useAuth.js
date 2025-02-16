// useAuth.js
import { useState } from 'react';
import authService from '../features/auth/authService'; // Se till att importera authService korrekt

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    console.log("🔵 Attempting login with email:", email); // Logga email innan API-anropet
    try {
      const userData = await authService.login({ email, password });
      console.log("🔹 Login successful, received data:", userData); // Logga användardata

      return userData;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error("🔴 Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return { login, loading, error };
};



export default useAuth;
