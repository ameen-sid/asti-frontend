import React from "react";
import "../../styles/loginPage.style.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/asti-india-logo.png';
import { loginAdmin } from "../services/authService";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validateEmail = (email: string) => {
    if (!email || email.trim() === "") {
      return "Email cannot be empty";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      const errorMsg = validateEmail(value);
      setEmailError(errorMsg);
    }
    if (name === "password") {
      if (!value || value.length < 1) {
        setIsPasswordValid(true);
      } else {
        setIsPasswordValid(false);
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setLoginError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateEmail(formData.email);
    if (errorMsg) {
      setEmailError(errorMsg);
      return;
    }
    if (!formData.password) {
      setIsPasswordValid(true);
      return;
    }

    try {
      const res = await loginAdmin(formData.email, formData.password);
      console.log("Login response:", res);
      if (res?.success) {
        navigate("/admin-portals");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <>
      <div className="home-container d-flex flex-column align-items-center justify-content-center p-5">
        <img className="h-40px" src={logo} alt="" />
        <form onSubmit={handleLogin} className="form card border p-5 w-400px rounded-3 m-5">
          <p className="form-label mt-3 d-flex align-items-center">
            Email <span className="text-danger ms-1">*</span>
          </p>
          <input
            name="email"
            className="form-control"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {emailError && (
            <p className="text-danger mt-1 mb-0">{emailError}</p>
          )}

          <p className="form-label mt-3 d-flex align-items-center">
            Password <span className="text-danger ms-1">*</span>
          </p>
          <div className="d-flex align-items-center">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              type={showPassword ? "text" : "password"}
              placeholder="password"
            />
            <button
              type="button"
              className="btn text-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "hide" : "show"}
            </button>
          </div>
          {isPasswordValid && (
            <p className="text-danger mt-1 mb-0">Password cannot be empty</p>
          )}

          {loginError && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {loginError}
            </div>
          )}

          <button
            className="gradient-bg btn text-white my-3"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
export default LoginPage;
