import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {

  return (
    <div className="layout-container">
      <nav className="navbar">

        <ul className="nav-list">
          <li className="nav-item" id="home"> <Link to="/"><img src="img/navcareer-icon.png" id="home-image" alt="Home" /></Link></li>
          <li className="nav-item" id="search"><input type="text" className="search-bar" placeholder="Tìm kiếm..." /></li>

          <li className="nav-item" id="about-career-test"><Link to="/careertest">Trắc nghiệm hướng nghiệp</Link></li>
          <li className="nav-item" id="about-courses"><Link to="/course">Khóa học</Link></li>
          <li className="nav-item" id="about-us"><Link to="/about">Về chúng tôi</Link></li>
          <li className="nav-item" id="support"><Link to="/support">Hỗ trợ</Link></li>

          <li className="nav-item" id="sign-in"><Link to="/signin">Đăng nhập</Link></li>

        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; C1SE.15</p>
      </footer>
    </div>
  );
};

export default Layout;
