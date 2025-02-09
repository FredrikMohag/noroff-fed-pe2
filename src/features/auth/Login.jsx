import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authSlice";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await dispatch(loginUser(formData));
    if (response.meta.requestStatus === "fulfilled") {
      navigate("/profile");
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Log In</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit" className="btn">Log In</button>
    </form>
  );
};

export default Login;
