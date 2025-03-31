const CallToActionSection = () => {
  const styles = {
    section: {
      padding: '60px 20px',
      maxWidth: '960px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      textAlign: 'center' as const,
    },
  };

  return (
    <section style={styles.section}>
      <h2>Request a Quote Today</h2>
      <p>Ready to clear a tree or trim things back? Let's talk.</p>
      <p><strong>Phone:</strong> 218-XXX-XXXX</p>
      <p><strong>Email:</strong> sirsawsalot@yahoo.com</p>
      <p><strong>Service Area:</strong> Fergus Falls, Perham, and all of Ottertail County.</p>
    </section>
  );
};

export default CallToActionSection;
