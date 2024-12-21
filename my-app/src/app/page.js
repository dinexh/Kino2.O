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
import { useState, useEffect } from 'react'; 
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);
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
                <CountdownTimer />
                <About />
                <Events />
                <Gallery />
                <Team/>
                <Sponcers/>
                <FAQ />
                <div className="home-component-footer">
                  <Footer />
                </div>
                <div className="home-floating" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/promotions" className="floating-register-btn-promo">
                  Promotional Evnets
                </Link>
                <Link href="/events/register" className="floating-register-btn">
                  Register Now
                </Link>
                </div>
              </>
            )}
          </div>
      </div>
    </main>
  );
}