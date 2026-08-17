import React from "react";
import "../../styles/loginPage.style.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/asti-india-logo.png'; 

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isNameValid, setIsNameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    if (name === "username") {
      if (value == "") {
        setIsNameValid(true);
        setIsFormValid(false);
      } else {
        setIsNameValid(false);
        setIsFormValid(true);
      }
    }
    if (name === "password") {
      if (value.length < 8 && value == "") {
        setIsPasswordValid(true);
        setIsFormValid(false);
      } else {
        setIsPasswordValid(false);
        setIsFormValid(true);
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLogin = (e:any) => {
    if (isFormValid) {
      if (formData.username === "test" && formData.password === "12345678") {
        console.log("login successful");
        navigate("/admin-portals");
      } else {
        console.log("login failed");
      }
    } else {
      console.log("login failed");
    }
  };
  return (
    <>
      <div className="home-container d-flex flex-column align-items-center justify-content-center p-5">
        <img className="h-40px" src={logo} alt="" />
        <div className="form card border p-5 w-400px rounded-3 m-5">
          <p className="form-label mt-3 d-flex align-items-center">
            Username <p className="text-danger ms-1">*</p>
          </p>
          <input
            name="username"
            className="form-control"
            type="text"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
          />
          {isNameValid && (
            <p className="text-danger">username can not be empty</p>
          )}
          <p className="form-label mt-3 d-flex align-items-center">
            Password <p className="text-danger ms-1">*</p>
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
            <p className="text-danger">password must be of 8 characters</p>
          )}
          <button
            onClick={handleLogin}
            className="gradient-bg btn text-white my-3"
            type="submit"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
