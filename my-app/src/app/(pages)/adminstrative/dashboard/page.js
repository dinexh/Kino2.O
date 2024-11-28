"use client";

import React from "react";
import { useState, useEffect } from "react";

// imports start here
import DashboardNav from "../../components/navdash/navdash";
import DashboardFooter from "../../components/footer/footerdash";
import Sidebar from "../../components/sidebar/sidebar";

import './page.css'

const Dashboard = ({ children }) => {

  const [userDetails, setUserDetails] = useState({
    username: "",
    name: "",
    role: "",
});

useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserDetails({
            username: user.username,
            name: user.name,
            role: user.role,
        });
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      // Optionally redirect to login page if user data is invalid
      // window.location.href = '/auth/login';
    }
}, []);

  return (
    <div className="DashboardComponent">
      <div className="DashboardComponent-in">
        <div className="DashboardComponent-Nav">
          <DashboardNav userDetails={userDetails}/>
        </div>
        <div className="DashboardComponent-one">
          <div className="DashboardComponent-one-in">
            <div className="DC-sideBar">
                <Sidebar />
            </div>
            <div className="DC-one">
              {children}
            </div>
          </div>
        </div>
        <div className="DashboardComponent-Footer">
          <div className="DashboardComponent-Footer-in">
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;