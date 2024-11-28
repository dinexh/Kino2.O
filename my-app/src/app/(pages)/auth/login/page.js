"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./page.css";

const Login = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userData.username || !userData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Login successful");
        const role = response.data.role;
        const roleRoutes = {
          admin: "/admin/dashboard",
          administrative: "/administrative/dashboard"
        };

        const targetRoute = roleRoutes[role.toLowerCase()];
        if (!targetRoute) {
          toast.error("Unauthorized access");
          return;
        }

        router.push(targetRoute);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="LoginComponent">
      <div className="LoginComponent-in">
        <div className="Login-one">
      
        </div>
        <div className="Login-two">
          <div className="Login-two-in">
          <h1>Chitramela Admin Dashboard</h1>
            <div className="Login-in-one">
              <input
                type="text"
                value={userData.username}
                onChange={handleInput}
                name="username"
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div className="Login-in-two">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  onChange={handleInput}
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="password-toggle-button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
            <div className="Login-in-three">
              <button onClick={handleLogin}>Login</button>
              <div className="forgot-password">
                <p>Forgot Password?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;