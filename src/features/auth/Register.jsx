import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useUserStore from "../../store"; // ✅ Importera Zustand-store
import authService from "../auth/authService"; // authService för registrering via API

const Register = () => {
  const login = useUserStore((state) => state.login); // ✅ Zustand login-funktion
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
      venueManager: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const requestData = {
          ...values,
          venueManager: values.venueManager, // 🔹 Byt namn till det API:t förväntar sig
        };

        const registerResponse = await authService.register(requestData);
        console.log("API response after registration:", registerResponse.data);
        const loginResponse = await authService.login({
          email: values.email,
          password: values.password,
        });

        if (loginResponse.data && loginResponse.data.accessToken) {
          const userData = loginResponse.data; // Sätt userData här
          console.log("User logged in:", userData);

          login(loginResponse.data, loginResponse.data.accessToken, loginResponse.data.venueManager);


          localStorage.setItem("accessToken", userData.accessToken);
          localStorage.setItem("venueManager", JSON.stringify(userData.venueManager));

          navigate("/profile");
        } else {
          console.warn("Ingen accessToken returnerades vid inloggning!");
        }

      } catch (error) {
        console.error("Error during registration/login:", error);
      }
    }



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
          name="venueManager"
          checked={formik.values.venueManager}
          onChange={formik.handleChange}
        />
        Register as a venue manager
      </label>

      <button type="submit" className="btn">Register</button>
    </form>
  );
};

export default Register;
