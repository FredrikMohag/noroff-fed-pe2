import { useFormik } from "formik";
import React from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerUser } from '../auth/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Yup schema för validering
  const validationSchema = Yup.object({
    name: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(/@stud\.noroff\.no$/, "Email must be from @stud.noroff.no"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    avatarUrl: Yup.string().url("Invalid URL").optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      avatarUrl: "",
      isVenueManager: false,
    },
    validationSchema, // Lägg till validation schema
    onSubmit: async (values) => {
      try {
        await dispatch(registerUser(values)).unwrap();
        navigate("/profile");
      } catch (error) {
        console.error("Error response:", error.response?.data);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      <h2>Register</h2>

      {formik.errors.general && <p className="error">{formik.errors.general}</p>}

      <div>
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="error">{formik.errors.name}</p>
        )}
      </div>

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

      <div>
        <input
          type="text"
          name="avatarUrl"
          placeholder="Avatar URL"
          value={formik.values.avatarUrl}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.avatarUrl && formik.errors.avatarUrl && (
          <p className="error">{formik.errors.avatarUrl}</p>
        )}
      </div>

      <label>
        <input
          type="checkbox"
          name="isVenueManager"
          checked={formik.values.isVenueManager}
          onChange={formik.handleChange}
        />
        Register as a venue manager
      </label>

      <button type="submit" className="btn">Register</button>
    </form>
  );
};

export default Register;
