"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';

import "./page.css";

const Login = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Full response:", response);

      if (!response.data) {
        setIsLoading(false);
        toast.error("Empty response from server");
        return;
      }

      if (!response.data.token) {
        setIsLoading(false);
        toast.error("No authentication token received");
        return;
      }

      const userRole = response.data.user?.role;
      console.log("Detected user role:", userRole);

      const roleRoutes = {
        admin: "/admin/dashboard",
        Admin: "/admin/dashboard",
        administrative: "/adminstrative/dashboard",
        Administrative: "/adminstrative/dashboard"
      };

      const targetRoute = roleRoutes[userRole];
      console.log("Target route:", targetRoute);

      if (!targetRoute) {
        setIsLoading(false);
        toast.error(`Unauthorized access: Invalid role (${userRole})`);
        return;
      }

      localStorage.setItem('token', response.data.token);

      toast.success("Login successful");
      console.log("Starting navigation to:", targetRoute);

      router.replace(targetRoute);

    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#4CAF50',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF5350',
              color: 'white',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
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
              <button 
                onClick={handleLogin} 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
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