import '../../styles/content.css';
import WorkRequestButton from '../buttons/WorkRequestButton';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <h1 className="hero-heading">
        {"Sir Sawsalot".split('').map((char, index) => (
          <span 
            className="letter" 
            key={index} 
            style={{ animationDelay: `${index * 0.2}s` }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <h2 className="hero-subheading">
        {"Tree Care with Integrity".split('').map((char, index) => (
          <span 
            className="fast-letter" 
            key={index} 
            style={{ animationDelay: `${3.2 + index * 0.05}s` }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h2>
      <p className="hero-paragraph">
        {[
          {
            text: "Serving Ottertail County with safety and care.",
            baseDelay: 6.4,
          },
          {
            text: "Fully dedicated to keeping your trees in shape.",
            baseDelay: 9.15,
          },
        ].map((sentence, sIndex) => (
          <span key={sIndex}>
            {sentence.text.split('').map((char, index) => (
              <span
                className="fast-letter"
                key={index}
                style={{ animationDelay: `${sentence.baseDelay + index * 0.05}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            {sIndex === 0 && <br />}
          </span>
        ))}
      </p>
      <WorkRequestButton />
    </section>
  );
};

export default HeroSection;