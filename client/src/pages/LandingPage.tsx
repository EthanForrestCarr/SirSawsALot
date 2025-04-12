import HeroSection from '../components/content/HeroSection';
import ServicesSection from '../components/content/ServicesSection';
import HowItWorksSection from '../components/content/HowItWorksSection';
import AboutSection from '../components/content/AboutSection';
import TestimonialsSection from '../components/content/TestimonialsSection';
import CallToActionSection from '../components/content/CallToActionSection';

const LandingPage = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <HeroSection />
      </div>
      <div className="how-it-works-services-container">
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
