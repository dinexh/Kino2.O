"use client";
import Footer from "./components/Footer/Footer";
// UI Imports
import Hero from "./UI/Hero/page";
import CountdownTimer from './UI/Counter/page'
import About from './UI/About/page'

export default function Home() {
  return (
    <main>
      <div className="home-component">
          <div className="home-component-in">
            <div className="home-component-nav">
            </div>
            <Hero />
            <CountdownTimer />
            <About />
            <div className="home-component-footer">
              <Footer />
            </div>
        </div>
      </div>
    </main>
  );
}
