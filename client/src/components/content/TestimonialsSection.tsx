const TestimonialsSection = () => {
  const styles = {
    section: {
      padding: '60px 20px',
      maxWidth: '960px',
      margin: '0 auto',
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
    <section style={styles.section}>
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
  );
};

export default TestimonialsSection;
