import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { API_AUTH, API_KEY, API_LOGIN, BASE_API_URL } from '../../constants';
import useUserStore from "../../store";

const Login = () => {
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASE_API_URL}${API_AUTH}${API_LOGIN}?_holidaze=true`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify({ email: values.email, password: values.password }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          setError('Login failed');
          return;
        }

        const profile = {
          name: result.data.name,
          email: result.data.email,
          avatar: result.data.avatar || null,
        };

        const accessToken = result.data.accessToken;
        const venueManager = Boolean(result.data.venueManager);

        login(profile, accessToken, venueManager, result.data.avatarUrl);

        navigate("/profile");
      } catch (error) {
        setError(error.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      <h2>Log In</h2>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="error">{formik.errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="error">{formik.errors.password}</p>
        )}
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default Login;
