import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignInAdmin.css';

function SignInAdmin() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [noti, setNoti] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthz = async () => {
      try {
        const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
        if (response.status === 200) {
          navigate('/admin');
        }
      } catch (err) {
        handleAuthError(err);
      }
    };
    checkAuthz();
  }, [navigate]);

  const handleAuthError = (err) => {
    if (err.response) {
      if (err.response.status === 403) {
        setIsSignedIn(true);
        setNoti('You are signed in, but not an admin.');
      } else {
        setNoti(`Error: ${err.response.status}. Please try again.`);
      }
    } else {
      setNoti('Failed to communicate with the server. Please check your connection.');
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post('http://localhost:5000/auth/signout', {}, { withCredentials: true });
      navigate('/admin');
    } catch (err) {
      setNoti('Sign out failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNoti(null);

    if (!account || !password) {
      setNoti('Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/signin', {
        account,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        navigate('/admin');
      } else if (response.status === 203) {
        setNoti('Invalid username or password. Please try again.');
      }
    } catch (err) {
      handleAuthError(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Chào mừng bạn đến với Navcareer</h2>

        {isSignedIn ? (
          <>
            <div className="error-message" style={{ color: 'red' }}>{noti}</div>
            <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nhập tên tài khoản hoặc địa chỉ email của bạn</label>
              <input
                type="text"
                placeholder="Email hoặc tên tài khoản"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Nhập mật khẩu của bạn</label>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">Sign in</button>
          </form>
        )}

        {noti && <div className="error-message" style={{ color: 'red' }}>{noti}</div>}
      </div>
    </div>
  );
}

export default SignInAdmin;
