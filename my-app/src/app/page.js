"use client";
// components imports here
import Footer from "./components/footer/footer";
// UI imports here
import Team from "./UI/Team/page";
export default function Home() {
  return (
    <div className="home-component">
      <Team/>
      <div className="home-component-footer">
        <Footer />
      </div>
    </div>
  );
}
