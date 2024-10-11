import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthz = async () => {
      try {
        const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
        if (response.status !== 200) {
          navigate('/admin/signin');
        }
      } catch (err) {
        console.error('Failed to check authorization status:', err);
        navigate('/admin/signin');
      }
    };
    checkAuthz();
  }, [navigate]);

  const handleSignout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/signout', {}, { withCredentials: true });
      navigate('/admin/signin');
    } catch (err) {
      console.error('Failed to sign out:', err);
      // Optionally, you can show a notification if logging out fails
    }
  };

  return (
    <div className="home-container">
      <h2>This is the home for admin</h2>
      <button onClick={handleSignout} className="signout-btn">
        Sign Out
      </button>
    </div>
  );
}

export default AdminHome;
