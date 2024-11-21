"use client";
import Image from "next/image";
import logo from "@/app/assets/newlogo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      toast.success('Login successful');
      router.push(data.redirectUrl || "/auth/dashboard");
      
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" />
      <div className="login-container-in">
        <div className="login-container-in-one">
          <Image src={logo} alt="Chitramela Logo" width={120} height={50} />  
        </div>  
        <div className="login-container-in-two">
          <div className="login-container-in-two-heading">
            <h2>Chitramela Admin Portal</h2>
          </div>
          <div className="login-container-in-two-form"> 
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}