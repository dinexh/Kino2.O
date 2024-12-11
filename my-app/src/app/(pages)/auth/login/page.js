"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import "./page.css";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to dashboard
        router.replace("/admin/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (lockoutTime && new Date() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - new Date()) / 1000 / 60);
      toast.error(`Too many login attempts. Please try again in ${remainingTime} minutes`);
      setIsLoading(false);
      return;
    }

    if (!userData.username || !userData.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Authenticating...");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userData.username,
        userData.password
      );

      const user = userCredential.user;

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Login successful! Redirecting...", {
        duration: 2000,
        icon: '🚀'
      });

      // Add slight delay before redirect
      setTimeout(() => {
        router.replace("/admin/dashboard");
      }, 1000);

      // Reset login attempts on successful login
      setLoginAttempts(0);
      setLockoutTime(null);

    } catch (error) {
      console.error("Login error:", error);
      setLoginAttempts(prev => prev + 1);
      
      if (loginAttempts >= 4) { // 5 attempts total
        const lockout = new Date();
        lockout.setMinutes(lockout.getMinutes() + 15); // 15 minute lockout
        setLockoutTime(lockout);
        setLoginAttempts(0);
        toast.dismiss(loadingToast);
        toast.error("Too many failed attempts. Account locked for 15 minutes");
      } else {
        toast.dismiss(loadingToast);
        toast.error(error.message || "Login failed. Please try again.", {
          duration: 4000,
          icon: '❌'
        });
      }
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