// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './SignIn.css'; // Create a CSS file for styling
function SignIn() {


    return (
        <div className="login-container">
        <div className="login-box">
          <h2>Chào mừng bạn đến với Navcareer</h2>
          <form>
            <div className="social-login">
              <button className="google-btn">Đăng nhập với Google</button>  
              <button className="facebook-btn">Đăng nhập với Facebook</button>
            </div>
            <div className="form-group">
              <label>Nhập tên tài khoản hoặc địa chỉ email của bạn</label>
              <input type="text" placeholder="Email hoặc tên tài khoản" required />
            </div>
            <div className="form-group">
              <label>Nhập mật khẩu của bạn</label>
              <input type="password" placeholder="Mật khẩu" required />
            </div>
            <div className="forgot-password">
              <a href="/">Quên mật khẩu?</a>
            </div>
            <button type="submit" className="login-btn">Sign in</button>
          </form>
          <div className="signup-link">
            <span>Chưa có tài khoản? </span><a href="/">Đăng ký</a>
          </div>
        </div>
      </div>
    );
}

export default SignIn;
