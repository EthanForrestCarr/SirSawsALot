import '../../styles/content.css';

const ServicesSection = () => {
  return (
    <section className="services-section card">
      <h2>Services</h2>
      <p>Our most popular tree care offerings:</p>
      <ul className="service-list">
        <li><strong>Hazard Mitigation:</strong> Remove dangerous limbs.</li>
        <li><strong>Aesthetic Trimming:</strong> Shape trees beautifully.</li>
        <li><strong>Tree Removal:</strong> Full-service removal for dead/dying trees.</li>
        <li><strong>Stump Grinding:</strong> Finish the job completely with clean results.</li>
      </ul>
    </section>
  );
};

export default ServicesSection;
