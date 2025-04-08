import HeroSection from '../components/content/HeroSection';
import ServicesSection from '../components/content/ServicesSection';
import HowItWorksSection from '../components/content/HowItWorksSection';
import AboutSection from '../components/content/AboutSection';
import TestimonialsSection from '../components/content/TestimonialsSection';
import CallToActionSection from '../components/content/CallToActionSection';

const LandingPage = () => {

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <HeroSection />
      </div>
      <div className="how-it-works-services-container" style={{ margin: '0 auto', display: 'flex', justifyContent: 'space-between', maxWidth: '960px' }}>
        <HowItWorksSection />
        <ServicesSection />
      </div>
      <AboutSection />
      <TestimonialsSection />
      <CallToActionSection />
    </>
  );
};

export default LandingPage;
