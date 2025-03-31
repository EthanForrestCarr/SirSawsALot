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
      <ServicesSection />
      <HowItWorksSection />
      <AboutSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
};

export default LandingPage;
