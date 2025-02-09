import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../auth/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatarUrl: "",
    isVenueManager: false,
  });

  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Logga ändringarna av "isVenueManager"
    if (name === "isVenueManager") {
      console.log("Register as a venue manager changed to:", checked);
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let errors = {};

    // Validation for email
    if (!formData.email.includes("@stud.noroff.no")) {
      errors.email = "Email must be from @stud.noroff.no";
    }

    // Validation for password
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError({}); // Återställ felmeddelanden

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return; // Stoppa om det finns valideringsfel
    }

    try {
      // Försök att registrera användaren
      await dispatch(registerUser(formData)).unwrap();
      navigate("/profile"); // Om registreringen lyckas, navigera till profilsidan
    } catch (error) {
      console.error("Error response:", error.response?.data);
      if (error?.response?.data?.message === "Username already taken") {
        setError({ username: "Username is already taken. Please choose another one." });
      } else if (error?.response?.data?.message === "Email already exists") {
        setError({ email: "Email is already in use. Please try another one." });
      } else {
        setError({ general: "Registration failed. Please try again." });
      }
    }
  };


  return (
    <form onSubmit={handleRegister} className="auth-form">
      <h2>Register</h2>

      {error.general && <p className="error">{error.general}</p>}

      <input
        type="text"
        name="name"
        placeholder="Username"
        value={formData.name}
        onChange={handleChange}
        required
      />
      {error.username && <p className="error">{error.username}</p>} {/* Error message for username */}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {error.email && <p className="error">{error.email}</p>} {/* Error message for email */}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {error.password && <p className="error">{error.password}</p>} {/* Error message for password */}

      <input
        type="text"
        name="avatarUrl"
        placeholder="Avatar URL"
        value={formData.avatarUrl}
        onChange={handleChange}
      />

      <label>
        <input
          type="checkbox"
          name="isVenueManager"
          checked={formData.isVenueManager}
          onChange={handleChange}
        />
        Register as a venue manager
      </label>

      <button type="submit" className="btn">Register</button>
    </form>
  );
};

export default Register;
