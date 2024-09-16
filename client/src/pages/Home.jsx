import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('AUTHENTICATION_ID'));
  const [profileData, setProfileData] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const AUTHENTICATION_ID = localStorage.getItem('AUTHENTICATION_ID');
      if (AUTHENTICATION_ID) {
        try {
          const response = await fetch(`http://localhost:5000/profile/get?AUTHENTICATION_ID=${encodeURIComponent(AUTHENTICATION_ID)}`);
          const result = await response.json();
          setProfileData(result);
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    };

    fetchProfile();
  }, [isLoggedIn]);

  const handleSignIn = () => {
    navigate('/signin');  // Redirect to Sign In page
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('AUTHENTICATION_ID');  // Clear authentication ID from local storage
      setIsLoggedIn(false);  // Update login state
      navigate('/signin');  // Redirect to Sign In page after sign out
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        {isLoggedIn ? (
          <div className="profile-menu">
            <div className="profile-info" onClick={toggleDropdown}>
              <img src="https://via.placeholder.com/40" alt="Profile" className="profile-picture" />
              <span className="username">{profileData?.USER_NAME}</span>
            </div>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/profile')}>Profile</button>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="auth-button" onClick={handleSignIn}>Sign In</button>
        )}
      </header>
      <main className="home-main">
        <p>This is the homepage</p>
      </main>
    </div>
  );
}

export default Home;
