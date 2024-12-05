"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';

import "./page.css";
import { db } from "../../../../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

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
    
    if (!userData.username || !userData.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Authenticating...");

    try {
      if (!db) {
        throw new Error("Firebase not initialized");
      }

      // Query Firestore for the user - check both username and email
      const usersRef = collection(db, "users");
      const q = query(
        usersRef, 
        where("username", "==", userData.username.toLowerCase())
      );
      
      // Also check email field for registered users
      const emailQ = query(
        usersRef, 
        where("email", "==", userData.username.toLowerCase())
      );

      const [usernameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(q),
        getDocs(emailQ)
      ]);

      const userDoc = usernameSnapshot.docs[0] || emailSnapshot.docs[0];

      if (!userDoc) {
        toast.dismiss(loadingToast);
        toast.error("User not found");
        setIsLoading(false);
        return;
      }

      const user = userDoc.data();

      // Verify password
      const isValidPassword = await bcrypt.compare(userData.password, user.password);

      if (!isValidPassword) {
        toast.dismiss(loadingToast);
        toast.error("Invalid password");
        setIsLoading(false);
        return;
      }

      // Create response data structure similar to your API
      const responseData = {
        token: "firebase-" + userDoc.id, // You might want to use a proper JWT token
        user: {
          id: userDoc.id,
          username: user.username,
          role: user.role
        }
      };

      // Store token
      localStorage.setItem('token', responseData.token);

      const userRole = user.role;
      const roleRoutes = {
        superadmin: "/admin/dashboard",
        admin: "/admin/dashboard",
        registeredUser: "/user/dashboard"
      };

      const targetRoute = roleRoutes[userRole];

      if (!targetRoute) {
        toast.dismiss(loadingToast);
        toast.error(`Unauthorized access: Invalid role (${userRole})`);
        setIsLoading(false);
        return;
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Login successful! Redirecting...", {
        duration: 2000,
        icon: '🚀'
      });

      // Add slight delay before redirect
      setTimeout(() => {
        router.replace(targetRoute);
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss(loadingToast);
      toast.error("Login failed. Please try again.", {
        duration: 4000,
        icon: '❌'
      });
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
            iconTheme: {
              primary: 'white',
              secondary: '#4CAF50',
            }
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF5350',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#EF5350',
            }
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#2196F3',
              color: 'white',
            }
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
                type={userData.role === 'registeredUser' ? "email" : "text"}
                value={userData.username}
                onChange={handleInput}
                name="username"
                placeholder="Username or Email"
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