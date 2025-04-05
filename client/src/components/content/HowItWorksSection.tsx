import '../../styles/content.css';
import SignupButton from '../buttons/SignupButton';

const HowItWorksSection = () => {
  return (
    <section className="how-it-works-section card">
      <h2>How It Works</h2>
      <ol>
        <li><strong>Book Online or Call:</strong> Easy scheduling your way.</li>
        <li><strong>Upload Photos:</strong> Help us understand your job.</li>
        <li><strong>Real-Time Status:</strong> Track request approval & updates.</li>
        <li><strong>Create an Account:</strong> Secure access, faster scheduling.</li>
      </ol>
      <SignupButton /> {/* New: Sign up button at the bottom */}
    </section>
  );
};

export default HowItWorksSection;
