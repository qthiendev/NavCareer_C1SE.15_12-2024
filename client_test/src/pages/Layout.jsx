import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';

function Layout() {
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isESP, setIsESP] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                setIsAuth(response.data.sign_in_status);
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                setIsAuth(false);
            }
        };
        const checkAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                console.log(response);
                if (response.status === 200)
                    setIsAdmin(true);
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                setIsAdmin(false);
            }
        };
        const checkESP = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                console.log(response);
                if (response.status === 200)
                    setIsESP(true);
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                setIsESP(false);
            }
        };
        checkAuth();
        checkAdmin();
        checkESP();
    }, [navigate]);

    // Handle user image click to toggle dropdown
    const handleUserImageClick = () => {
        setDropdownOpen(prevState => !prevState);
    };

    // Handle sign-out action
    const handleSignOut = async () => {
        try {
            await axios.post('http://localhost:5000/auth/signout', {}, { withCredentials: true });
            setIsAuth(false);
            navigate('/signin'); // Redirect to sign-in page after sign out
        } catch (err) {
            console.error('Failed to sign out:', err);
        }
    };

    return (
        <div className="layout-container">
            <header>
                <nav className="navbar">
                    <div className="home-logo">
                        <a href="/"><img src="img/Header/Logo.svg" alt="Logo" /></a>
                    </div>

                    <ul className="nav-list">
                        <li><a className="nav-tests" href="/tests">TRẮC NGHIỆM HƯỚNG NGHIỆP</a></li>
                        <li><a className="nav-courses" href="/courses">KHÓA HỌC</a></li>
                        <li><a className="nav-about" href="/about">VỀ CHÚNG TÔI</a></li>
                        {isAdmin && (
                            <li>
                                <a className="for" href="/about">DÀNH CHO NHÀ PHÁT TRIỂN</a>
                            </li>
                        )}

                        {isESP && (
                            <li>
                                <a className="for" href="/about">DÀNH CHO NHÀ CUNG CẤP</a>
                            </li>
                        )}

                    </ul>

                    <div className="auth-links">
                        {isAuth ? (
                            <>
                                <div className="notification-icon">
                                    <i className="fa fa-bell"></i>
                                </div>
                                <div className="user-image" onClick={handleUserImageClick}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR26AaR_J8UOopLWkGkJpZ3g1r4Cl-vIlnWwg&s" alt="User" />
                                </div>
                                {dropdownOpen && (
                                    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                        <ul>
                                            <li><a href="/profile">Profile</a></li>
                                            <li><a href="/settings">Settings</a></li>
                                            <li onClick={handleSignOut}>Sign Out</li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <a className="signin" href="/signin">ĐĂNG NHẬP</a>
                                |
                                <a className="signup" href="/signup">ĐĂNG KÝ</a>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <p className='copyright'>&copy; C1SE.15</p>
            </footer>
        </div>
    );
}

export default Layout;
