import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css'; // Tạo một file CSS cho kiểu dáng
import icon from "./img/headericon.png";

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);

    // Check if passwords match
    if (password !== confirmPassword) {
      setNotification('Passwords do not match. Please try again.');
      return;
    }

    // Check if the user has accepted the terms
    if (!termsAccepted) {
      setNotification('Please agree to the terms and conditions.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      if (response.status === 200) {
        navigate('/'); // Navigate to the home page on successful registration
      } else if (response.status === 203) {
        setNotification('An error occurred during registration. Please try again.');
      }
    } catch (err) {
      setNotification('Server error. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <div className="left-section">
          <img
            src={icon} // Replace with your image path
            alt="Sign up illustration"
            className="signup-image"
          />
        </div>

        <div className="right-section">
          <h1>Create an Account</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="terms-group">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms and Conditions</a>
              </label>
            </div>

            <button type="submit" className="submit-button">
              Create Account
            </button>

            {notification && <div className="error-message" style={{ color: 'red' }}>{notification}</div>}

            <div className="divider">
              <span>or</span>
            </div>

            <div className="social-login">
              <button className="social-btn facebook">Facebook</button>
              <button className="social-btn google">Google</button>
              <button className="social-btn microsoft">Microsoft</button>
            </div>

            <p className="login-link">
              Already have an account? <a href="#">Log In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
