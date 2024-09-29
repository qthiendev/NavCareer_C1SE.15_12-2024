// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './SignIn.css'; // Create a CSS file for styling
function SignUp() {


    return (
        <div className="signup-container">
        <div className="signup-box">
          <h2>Chào mừng bạn đến với Navcareer</h2>
          <form>
            <div className="form-group">
              <label>Họ và tên <span>*</span></label>
              <input type="text" placeholder="Nguyễn Văn A" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email <span>*</span></label>
                <input type="email" placeholder="example@gmail.com" required />
              </div>
              <div className="form-group">
                <label>Tên tài khoản <span>*</span></label>
                <input type="text" placeholder="username123" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mật khẩu <span>*</span></label>
                <input type="password" placeholder="********" required />
              </div>
              <div className="form-group">
                <label>Nhập lại mật khẩu <span>*</span></label>
                <input type="password" placeholder="********" required />
              </div>
            </div>
            <div className="form-group">
              <label>Số điện thoại liên hệ <span>*</span></label>
              <input type="text" placeholder="0123456789" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày sinh <span>*</span></label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Địa chỉ <span>*</span></label>
                <input type="text" placeholder="Địa chỉ của bạn" required />
              </div>
            </div>
            <button type="submit" className="signup-btn">Đăng ký</button>
          </form>
        </div>
      </div>
    );
}

export default SignUp;
