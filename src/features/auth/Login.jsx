import { useFormik } from "formik";
import React from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loginUser } from "./authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Yup schema för validering
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
    validationSchema, // Lägg till validation schema
    onSubmit: async (values) => {
      const response = await dispatch(loginUser(values));
      if (response.meta.requestStatus === "fulfilled") {
        console.log('Navigating to profile');
        navigate("/profile"); // Navigera till profil
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

      <button type="submit" className="btn">Log In</button>
    </form>
  );
};

export default Login;
