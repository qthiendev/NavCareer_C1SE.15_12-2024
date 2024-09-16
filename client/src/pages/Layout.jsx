import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">Home</Link></li>
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
