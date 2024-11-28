"use client";
// UI Imports
import Nav from "./components/Nav/nav";
import Hero from "./UI/Hero/page";
import CountdownTimer from './UI/Counter/page'
import About from './UI/About/page'
import Events from './UI/Events/page'
import Footer from "./components/Footer/Footer";
import Gallery from './UI/Gallery/page'
import FAQ from './UI/FAQ/page' 

export default function Home() {
  return (
    <main>
      <div className="home-component">
          <div className="home-component-in">
            <div className="home-component-nav">
              <Nav />
            </div>
            <Hero />
            <CountdownTimer />
            <About />
            <Events />
            <Gallery />
            <FAQ />
            <div className="home-component-footer">
              <Footer />
            </div>
        </div>
      </div>
    </main>
  );
}