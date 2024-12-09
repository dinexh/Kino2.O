"use client";
// Components Imports
import Nav from "./components/Nav/nav";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
// UI Imports
import Hero from "./UI/Hero/page";
import CountdownTimer from './UI/Counter/page'
import About from './UI/About/page'
import Events from './UI/Events/page'
import Gallery from './UI/Gallery/page'
import FAQ from './UI/FAQ/page' 
import Team from './UI/Team/page'
import Sponcers from './UI/Sponcers/page'
import { useState, useEffect } from 'react'; // Import useState and useEffect
import Lenis from '@studio-freight/lenis' // Import Lenis

export default function Home() {
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after a delay
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <main>
      <div className="home-component">
          <div className="home-component-in">
            {loading ? ( 
              <Loader />
            ) : (
              <>
                <div className="home-component-nav">
                  <Nav />
                </div>
                <Hero />
                <div className="home-component-counter-about">
                  <CountdownTimer />
                  <About />
                </div>
                <Events />
                <Gallery />
                <Team/>
                <Sponcers/>
                <FAQ />
                <div className="home-component-footer">
                  <Footer />
                </div>
              </>
            )}
          </div>
      </div>
    </main>
  );
}