// eslint-disable-next-line no-unused-vars
import React from 'react';
import './SignUp.css'; // Create a CSS file for styling
import icon from "./img/headericon.png"
function SignUp() {


    return (
      <div className="signup-container">
      <div className="form-container">
        <div className="left-section">
          <img
            src={icon} // Thay thế bằng đường dẫn hình ảnh của bạn
            alt="Sign up illustration"
            className="signup-image"
          />
        </div>
  
        <div className="right-section">
          <h1>Đăng ký tài khoản</h1>
          <form>
            <div className="form-group">
              <input type="text" placeholder="Họ" required />
              <input type="text" placeholder="Tên" required />
            </div>
  
            <div className="form-group">
              <input type="text" placeholder="Tên tài khoản" required />
            </div>
  
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
  
            <div className="form-group">
              <input type="password" placeholder="Mật khẩu" required />
              <input type="password" placeholder="Nhập lại mật khẩu" required />
            </div>


            <div className="form-group">
              <select className="user-type" required>
                <option value="">Loại người dùng</option>
                <option value="hoc-sinh">Học sinh</option>
                <option value="nha-cung-cap-dich-vu">Nhà cung cấp dịch vụ</option>
              </select>
            </div>


            <div className="terms-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Tôi đồng ý với các <a href="#">Điều khoản và Điều kiện</a>
              </label>
            </div>
  
            <button type="submit" className="submit-button">
              Tạo tài khoản
            </button>
  
            <div className="divider">
              <span>hoặc</span>
            </div>
  
            <div className="social-login">
              <button className="social-btn facebook">Facebook</button>
              <button className="social-btn google">Google</button>
              <button className="social-btn microsoft">Microsoft</button>
         
            </div>
  
            <p className="login-link">
              Đã có tài khoản? <a href="#">Đăng nhập</a>
            </p>

            <div className="note-section">
              <h3 className="note-title">• Lưu ý</h3>
              <p><strong>Tên người dùng:</strong></p>
              <p>Viết thường, không dấu, chỉ bao gồm chữ cái và số, tối đa 12 ký tự.</p>
              <p><strong>Mật khẩu:</strong></p>
              <p>Bao gồm chữ in hoa, chữ in thường, số và ký tự đặc biệt, dài từ 6-12 ký tự.</p>
            </div>

          </form>
        </div>
      </div>
    </div>
    );
}

export default SignUp;
