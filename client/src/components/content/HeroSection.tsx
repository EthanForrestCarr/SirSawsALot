import '../../styles/content.css';
import WorkRequestButton from '../buttons/WorkRequestButton';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <h1 className="hero-heading">Sir Sawsalot - Tree Trimming with Integrity</h1>
      <h2 className="hero-subheading">Professional Tree Care by a Local Firefighter</h2>
      <p className="hero-paragraph">
        Serving Ottertail County with safety, beauty, and care. Fully dedicated to keeping your trees in shape—whether it’s trimming, removal, or full clean-up.
      </p>
      <WorkRequestButton /> {/* Existing work request button */}
    </section>
  );
};

export default HeroSection;