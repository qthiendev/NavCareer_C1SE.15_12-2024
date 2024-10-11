import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

function SignIn() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [noti, setNoti] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
        console.log(response)
        if (response.data.sign_in_status) {
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to check authentication status:', err);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNoti(null);

    // Ensure both fields are filled
    if (!account || !password) {
      setNoti('Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/signin', {
        account: account,
        password: password,
      }, { withCredentials: true });

      if (response.status === 200) {
        navigate('/');
      }
      if (response.status === 203) {
        setNoti('Invalid username or password. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setNoti('Invalid username or password. Please try again.');
      } else {
        setNoti('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Chào mừng bạn đến với Navcareer</h2>

        <form onSubmit={handleSubmit}>
          <div className="social-login">
            <button type="button" className="google-btn">Đăng nhập với Google</button>
            <button type="button" className="facebook-btn">Đăng nhập với Facebook</button>
          </div>

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

          <div className="forgot-password">
            <a href="/">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="login-btn">Sign in</button>
        </form>

        {noti && <div className="error-message" style={{ color: 'red' }}>{noti}</div>}

        <div className="signup-link">
          <span>Chưa có tài khoản? </span><a href="/">Đăng ký</a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
