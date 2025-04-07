import '../../styles/content.css';
import SignupButton from '../buttons/SignupButton';

const HowItWorksSection = () => {
  return (
    <section className="how-it-works-section card">
      <h2>How It Works</h2>
      <p>
        <strong>Book Online or Give Us a Call:</strong>
        <br />
        Scheduling with Sir Sawsalot is quick and easy! You can book directly on our website, and for the best experience, we recommend creating an account. With an account, you'll enjoy direct communication with Sir Sawsalot, access to digital invoices, real-time updates on your service requests, and priority scheduling during busy seasons.
      </p>
      <p>
        Prefer not to create an account? No problem! You can still submit a work request through our site by clicking the button above. If you'd rather speak with us directly, head over to our contact section for our email and phone number. We're here to help however you prefer!
      </p>
      <SignupButton />
    </section>
  );
};

export default HowItWorksSection;
