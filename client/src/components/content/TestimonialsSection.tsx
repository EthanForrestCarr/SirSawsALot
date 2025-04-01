import '../../styles/content.css';

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <h2>Testimonials</h2>
      <blockquote className="testimonial-blockquote">
        "Sir Sawsalot took down a huge maple near our home with absolute care and professionalism."
        <footer className="testimonial-footer">– Jane D., Fergus Falls</footer>
      </blockquote>
      <blockquote className="testimonial-blockquote">
        "Booking online was easy, and I got updates along the way. Highly recommend!"
        <footer className="testimonial-footer">– John S., Pelican Rapids</footer>
      </blockquote>
    </section>
  );
};

export default TestimonialsSection;
