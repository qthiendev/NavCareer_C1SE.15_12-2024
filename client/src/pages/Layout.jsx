import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout-container">
      <header>
        <nav className="navbar">
          <div className="logo">
            <p>nav</p>
            <img src="img/Header/white_icon 1.svg" alt="Logo" />
            <p>areer</p>
          </div>
          <ul className="nav-list">
            <li><a href="/">Trang chủ</a></li>
            <li>
              <a href="/system-tests">Hệ thống bài test</a>
              <img className='down-arrow' src="img/Header/Down Arrow_Vector.svg" alt="Down Arrow" />
            </li>
            <li><a href="/courses">Khoá học</a></li>
            <li>
              <a href="/resources">Tài nguyên hỗ trợ</a>
              <img className='down-arrow' src="img/Header/Down Arrow_Vector.svg" alt="Down Arrow" />
            </li>
          </ul>
          <div className="auth-buttons">
            <a className="btn_login" href="/signin">Đăng Nhập</a>
            <a className="btn_signup" href="/signup">Đăng Ký</a>
          </div>
        </nav>
      </header>


      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div class="footer_container">
          <div class="logo-info">
            <div className="logo">
              <p>nav</p>
              <img src="img/Header/white_icon 1.svg" alt="Logo" />
              <p>areer</p>
            </div>
            <ul>
              <li>
                <img src="img/Footer/mail_white_vector.svg" alt="" />
                <p>hello@navcareer.com</p>
              </li>
              <li>
                <img src="img/Footer/phone_white_vector.svg" alt="" />
                <p>+91 91813 23 2309</p>
              </li>
              <li>
                <img style={{padding: "5px"}} src="img/Footer/location_white_vector.svg" alt="" />
                <p>Somewhere in the World</p>
              </li>
            </ul>
          </div>
          <div class="nav-links">
            <h3>Trọng tâm</h3>
            <ul>
              <li><a href="#">Hệ thống bài test</a></li>
              <li><a href="#">Khoá học</a></li>
              <li><a href="#">Tài nguyên hỗ trợ</a></li>
            </ul>
          </div>
          <div class="nav-links">
            <h3>Thông tin chi tiết</h3>
            <ul>
              <li><a href="#">Công ty</a></li>
              <li><a href="#">Sứ mệnh</a></li>
              <li><a href="#">Mục tiêu</a></li>
            </ul>
          </div>
          <div class="social-media">
            <h3>Kết nối với chúng tôi</h3>
            <ul>
              <li><a href="#"><img src="img/Footer/fb_vector.svg" alt="" /></a></li>
              <li><a href="#"><img src="img/Footer/linkedin_vector.svg" alt="" /></a></li>
              <li><a href="#"><img src="img/Footer/twitter_vector.svg" alt="" /></a></li>
            </ul>
          </div>
        </div>
        <p className='copyright'>&copy; C1SE.15</p>
      </footer>
    </div>
  )
};

export default Layout;
