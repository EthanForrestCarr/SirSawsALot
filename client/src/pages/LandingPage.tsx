import HeroSection from '../components/content/HeroSection';
import ServicesSection from '../components/content/ServicesSection';
import HowItWorksSection from '../components/content/HowItWorksSection';
import AboutSection from '../components/content/AboutSection';
import TestimonialsSection from '../components/content/TestimonialsSection';
import CallToActionSection from '../components/content/CallToActionSection';

const LandingPage = () => {
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      lineHeight: '1.6',
    },
  };

  return (
    <div style={styles.container}>
      <HeroSection />
      <div className="how-it-works-services-container" style={{ margin: '0 auto', display: 'flex', justifyContent: 'space-between', maxWidth: '960px' }}>
        <HowItWorksSection />
        <ServicesSection />
      </div>
      <AboutSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
};

export default LandingPage;
