import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './LayoutAdmin.css';

function LayoutAdmin({ children }) {
  return (
    <div className="layout-container">
      <header>
        <nav className="navbar">
          <ul className="nav-list">
            <li><a href="/">NavCareer Home</a></li>
            <li><a href="/admin">Admin Home</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>ADMIN</p>
      </footer>
    </div>
  )
};

export default LayoutAdmin;
