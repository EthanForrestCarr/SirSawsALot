const HowItWorksSection = () => {
  const styles = {
    section: {
      padding: '60px 20px',
      maxWidth: '960px',
      margin: '0 auto',
    },
  };

  return (
    <section style={styles.section}>
      <h2>How It Works</h2>
      <ol>
        <li><strong>Book Online or Call:</strong> Easy scheduling your way.</li>
        <li><strong>Upload Photos:</strong> Help us understand your job.</li>
        <li><strong>Real-Time Status:</strong> Track request approval & updates.</li>
        <li><strong>Create an Account:</strong> Secure access, faster scheduling.</li>
      </ol>
    </section>
  );
};

export default HowItWorksSection;
