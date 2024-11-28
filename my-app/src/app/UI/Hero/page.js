"use client"
import React from "react";

import "./hero.css";

const page = () => {
  return (
    <div className="hero">
      <div className="hero-in">
        <video
          preload="auto"
          autoPlay
          loop
          muted
          style={{ width: "100%" }}
          src="https://firebasestorage.googleapis.com/v0/b/flim-382d5.appspot.com/o/hero%2FHeroVideo.mp4?alt=media&token=fecec13d-1f4b-4787-93f2-002ce83e8a9a"
        />
      </div>
    </div>
  );
};

export default page;