import heroImage from '../../assets/sirsawsalotPictures/HeroTrees.png';
import SignupButton from '../buttons/SignupButton';
import WorkRequestButton from '../buttons/WorkRequestButton';

const HeroSection = () => {
  const styles = {
    hero: {
      backgroundColor: '#7a0404',
      color: '#fff',
      textAlign: 'center' as const,
      padding: '80px 20px',
      backgroundImage: `url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    heading: {
      fontSize: '2.5rem',
      marginBottom: '0.5rem',
    },
    subheading: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      fontWeight: 'normal' as const,
    },
    paragraph: {
      fontSize: '1.1rem',
    },
  };

  return (
    <section style={styles.hero}>
      <h1 style={styles.heading}>Sir Sawsalot - Tree Trimming with Integrity</h1>
      <h2 style={styles.subheading}>Professional Tree Care by a Local Firefighter</h2>
      <p style={styles.paragraph}>
        Serving Ottertail County with safety, beauty, and care. Fully dedicated to keeping your trees in shape—whether it’s trimming, removal, or full clean-up.
      </p>
      <SignupButton /> {/* New: Sign up button at the bottom */}
      <WorkRequestButton /> {/* New: Work request button */}
    </section>
  );
};

export default HeroSection;