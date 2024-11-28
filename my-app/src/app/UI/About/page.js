import './about.css'

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h2><span className="about">ABOUT</span> THE FESTIVAL</h2>
      </div>
      <div className="about-cards-container">
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
        
        <div className="about-card">
          <h3>About KL SAC Film Technology</h3>
          <p>A student-led organization dedicated to film technology.</p>
          <button className="read-more">READ MORE</button>
        </div>
        
        <div className="about-card">
          <h3>Who &apos;s Organizing KL Chitramela</h3>
          <p>A student-led organization supported by the university.</p>
          <button className="read-more">READ MORE</button>
        </div>
      </div>
    </div>
  );
};

export default About;
