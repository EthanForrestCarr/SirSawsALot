const ServicesSection = () => {
  const styles = {
    section: {
      padding: '60px 20px',
      maxWidth: '960px',
      margin: '0 auto',
    },
    serviceList: {
      paddingLeft: '1.2rem',
    },
  };

  return (
    <section style={styles.section}>
      <h2>Services</h2>
      <p>Our most popular tree care offerings:</p>
      <ul style={styles.serviceList}>
        <li><strong>Hazard Mitigation:</strong> Remove dangerous limbs.</li>
        <li><strong>Aesthetic Trimming:</strong> Shape trees beautifully.</li>
        <li><strong>Tree Removal:</strong> Full-service removal for dead/dying trees.</li>
        <li><strong>Stump Grinding:</strong> Finish the job completely with clean results.</li>
      </ul>
    </section>
  );
};

export default ServicesSection;
