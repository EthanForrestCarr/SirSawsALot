import heroImage from '../assets/sirsawsalotPictures/HeroTrees.png';

const LandingPage = () => {
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      lineHeight: '1.6',
    },
    section: {
      padding: '60px 20px',
      maxWidth: '960px',
      margin: '0 auto',
    },
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
    serviceList: {
      paddingLeft: '1.2rem',
    },
    callToAction: {
      backgroundColor: '#f5f5f5',
      textAlign: 'center' as const,
    },
    testimonials: {
      backgroundColor: '#fff8f6',
      borderTop: '2px solid #7a0404',
      borderBottom: '2px solid #7a0404',
    },
    blockquote: {
      fontStyle: 'italic',
      backgroundColor: '#fff',
      padding: '20px',
      margin: '20px 0',
      borderLeft: '4px solid #7a0404',
    },
    footer: {
      fontSize: '0.9rem',
      color: '#666',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heading}>Sir Sawsalot - Tree Trimming with Integrity</h1>
        <h2 style={styles.subheading}>Professional Tree Care by a Local Firefighter</h2>
        <p style={styles.paragraph}>
          Serving Ottertail County with safety, beauty, and care. Fully dedicated to keeping your trees in shape—whether it’s trimming, removal, or full clean-up.
        </p>
      </section>

      {/* Services Section */}
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

      {/* How It Works Section */}
      <section style={styles.section}>
        <h2>How It Works</h2>
        <ol>
          <li><strong>Book Online or Call:</strong> Easy scheduling your way.</li>
          <li><strong>Upload Photos:</strong> Help us understand your job.</li>
          <li><strong>Real-Time Status:</strong> Track request approval & updates.</li>
          <li><strong>Create an Account:</strong> Secure access, faster scheduling.</li>
        </ol>
      </section>

      {/* About Section */}
      <section style={styles.section}>
        <h2>About the Owner</h2>
        <p>
          Sir Sawsalot is owned by a dedicated firefighter with a lifelong passion for trees and safety. While not a certified arborist, he brings hands-on experience, precision, and local knowledge to every job.
        </p>
      </section>

      {/* Testimonials */}
      <section style={{ ...styles.section, ...styles.testimonials }}>
        <h2>Testimonials</h2>
        <blockquote style={styles.blockquote}>
          "Sir Sawsalot took down a huge maple near our home with absolute care and professionalism."
          <footer style={styles.footer}>– Jane D., Fergus Falls</footer>
        </blockquote>
        <blockquote style={styles.blockquote}>
          "Booking online was easy, and I got updates along the way. Highly recommend!"
          <footer style={styles.footer}>– John S., Pelican Rapids</footer>
        </blockquote>
      </section>

      {/* Call to Action */}
      <section style={{ ...styles.section, ...styles.callToAction }}>
        <h2>Request a Quote Today</h2>
        <p>Ready to clear a tree or trim things back? Let's talk.</p>
        <p><strong>Phone:</strong> 218-XXX-XXXX</p>
        <p><strong>Email:</strong> sirsawsalot@yahoo.com</p>
        <p><strong>Service Area:</strong> Fergus Falls, Perham, and all of Ottertail County.</p>
      </section>
    </div>
  );
};

export default LandingPage;
