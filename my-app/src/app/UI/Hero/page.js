"use client";

import React, { useState } from "react";

import "./hero.css";
import '../../moblie.css';
const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadedData = () => {
    console.log("Video loaded");
    setIsLoading(false);
  };

  return (
    <div className="hero">
      <div className="hero-in">
        
          <video
            preload="auto"
            autoPlay
            loop
            muted
            style={{ width: "100%" }}
            src="/HeroVideo.mp4"  
            onLoadedData={handleLoadedData}
          />
      </div>
    </div>
  );
};

export default Page;
