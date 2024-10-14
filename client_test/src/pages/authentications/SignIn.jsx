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
      setNoti('Vui lòng nhập tên tài khoản và mật khẩu.');
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
        setNoti('Tài khoản hoặc mật khẩu không chính xác,\nvui lòng thử lại.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setNoti('Tài khoản hoặc mật khẩu không chính xác,\nvui lòng thử lại.');
      } else {
        setNoti('Lỗi kết nối server,\nvui lòng thử lại sau.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Chào mừng bạn đến với NavCareer</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Tên tài khoản"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {noti && <div className="error-message" style={{ color: 'red' }}>{noti}</div>}

          <button type="submit" className="login-btn">Đăng nhập</button>

          <div className="forgot-password">
            <a href="/">Quên mật khẩu?</a>
          </div>

        </form>

        <div className="signup-link">
          <span>Chưa có tài khoản? </span><a href="/">Đăng ký</a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
