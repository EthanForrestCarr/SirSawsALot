import '../../styles/content.css';
import WorkRequestButton from '../buttons/WorkRequestButton';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <h1 className="hero-heading">Sir Sawsalot</h1>
      <h2 className="hero-subheading">Tree Care with Integrity</h2>
      <p className="hero-paragraph">
        Serving Ottertail County with safety, beauty, and care. Fully dedicated to keeping your trees in shape.
      </p>
      <WorkRequestButton /> {/* Existing work request button */}
    </section>
  );
};

export default HeroSection;