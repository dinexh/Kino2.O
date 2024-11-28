import Image from 'next/image';
import FilmBackground from '../../components/Background/FilmBackground';
import './about.css';
import logo from '../../Assets/newlogo.png';

const About = () => {
  return (
    <div className="about-container">
      <FilmBackground />
      <div className="about-content-wrapper">
        <div className="about-card">
          <h3>What is KL Chitramela?</h3>
          <p>A 48-hour film festival for aspiring filmmakers.</p>
          <button className="read-more">READ MORE</button>
        </div>
        
        <div className="about-card">
          <h3>Why KL Chitramela?</h3>
          <p>To showcase emerging filmmakers on a global scale.</p>
          <button className="read-more">READ MORE</button>
        </div>

        <div className="about-header">
          <h2>
            <p className="about">ABOUT</p>
            <p> THE FESTIVAL</p>
          </h2>
        </div>

        <div className="about-logo-wrapper">
          <Image 
            src={logo}
            alt="Chitramela Logo"
            className="about-logo"
            width={300}
            height={200}
            priority
          />
        </div>

        <div className="about-card">
          <h3>About KL SAC Film Technology</h3>
          <p>A student-led organization dedicated to film technology.</p>
          <button className="read-more">READ MORE</button>
        </div>
        
        <div className="about-card">
          <h3>Who&apos;s Organizing KL Chitramela</h3>
          <p>A student-led organization supported by the university.</p>
          <button className="read-more">READ MORE</button>
        </div>
      </div>
    </div>
  );
};

export default About;
