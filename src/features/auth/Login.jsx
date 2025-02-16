import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { API_AUTH, API_KEY, API_LOGIN, BASE_API_URL } from '../../constants';
import useUserStore from "../../store"; // Zustand

const Login = () => {
  const login = useUserStore((state) => state.login); // Få login-funktionen från Zustand
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Ta bort typdefinitionen

  // Yup schema för validering
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik för formulärhantering
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      console.log("🔵 Form data before login:", values); // Logga formulärdata
      try {
        setLoading(true);
        setError(null);

        // Skicka inloggningsförfrågan
        const response = await fetch(
          `${BASE_API_URL}${API_AUTH}${API_LOGIN}?_holidaze=true`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Noroff-API-Key': API_KEY, // API-nyckel krävs för att autentisera API-anrop
            },
            body: JSON.stringify({ email: values.email, password: values.password }),
          }
        );

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
          setError('Login failed');
          return;
        }

        // Här säkerställs att du får access token och användardata
        const profile = {
          name: result.data.name,
          email: result.data.email,
          avatar: { url: result.data.avatar.url, alt: result.data.avatar.alt },
          banner: { url: result.data.banner.url, alt: result.data.banner.alt },
        };

        const accessToken = result.data.accessToken; // Det här är tokenet du behöver
        console.log('token from useLogin:', accessToken);

        const venueManager = Boolean(result.data.venueManager);

        // Skicka användardata och access token vidare till din authStore
        login(profile, accessToken, venueManager);

        // Navigera till profilen
        navigate("/profile");

      } catch (error) {
        setError(error.message || 'Unknown error');
        console.error('❌ Error logging in:', error);
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
