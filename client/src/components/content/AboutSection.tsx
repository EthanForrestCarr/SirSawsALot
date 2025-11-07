import '../../styles/content.css';

const AboutSection = () => {
  return (
    <section className="about-section card">
      <div className="about-content">
        <div className="about-text">
          <h2>About Sir Sawsalot</h2>
          <p>
            Sir Sawsalot is owned by a dedicated firefighter. He brings hands-on experience, precision, and local knowledge to every job.
          </p>
        </div>
        <div className="about-image-container">
          <img
            src="/JonahHove.png"
            alt="About Sir Sawsalot"
            className="about-image"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
