const AboutSection = () => {
  const styles = {
    section: {
      padding: '60px 20px',
      maxWidth: '960px',
      margin: '0 auto',
    },
  };

  return (
    <section style={styles.section}>
      <h2>About the Owner</h2>
      <p>
        Sir Sawsalot is owned by a dedicated firefighter with a lifelong passion for trees and safety. While not a certified arborist, he brings hands-on experience, precision, and local knowledge to every job.
      </p>
    </section>
  );
};

export default AboutSection;
