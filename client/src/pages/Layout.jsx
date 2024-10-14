import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';

function Layout() {
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isESP, setIsESP] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const [authRes, adminRes, espRes] = await Promise.all([
                    axios.get('http://localhost:5000/auth/status', { withCredentials: true }),
                    axios.get('http://localhost:5000/authz/adm', { withCredentials: true }),
                    axios.get('http://localhost:5000/authz/esp', { withCredentials: true })
                ]);
                setIsAuth(authRes.data.sign_in_status);
                setIsAdmin(adminRes.status === 200);
                setIsESP(espRes.status === 200);
            } catch (err) {
                console.error('Error fetching statuses:', err);
            }
        };
        fetchStatuses();
    }, [navigate]);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleSignOut = async () => {
        try {
            await axios.post('http://localhost:5000/auth/signout', {}, { withCredentials: true });
            setIsAuth(false);
            navigate('/signin');
        } catch (err) {
            console.error('Failed to sign out:', err);
        }
    };

    return (
        <div className="layout-container">
            <header>
                <nav className="navbar">
                    <div className="home-logo">
                        <a href="/"><img src="/img/Header/Logo.svg" alt="Logo" /></a>
                    </div>

                    <ul className="nav-list">
                        <li><a href="/tests">TRẮC NGHIỆM HƯỚNG NGHIỆP</a></li>
                        <li><a href="/course/view">KHÓA HỌC</a></li>
                        <li><a href="/about">VỀ CHÚNG TÔI</a></li>
                        {isAdmin && (
                            <li><a href="/about">DÀNH CHO NHÀ PHÁT TRIỂN</a></li>
                        )}
                        {isESP && (
                            <li><a href="/about">DÀNH CHO NHÀ CUNG CẤP</a></li>
                        )}
                    </ul>

                    <div className="auth-links">
                        {isAuth ? (
                            <>
                                <div className="notification-icon">
                                    <i className="fa fa-bell"></i>
                                </div>

                                <div className="user-image" onClick={toggleDropdown}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR26AaR_J8UOopLWkGkJpZ3g1r4Cl-vIlnWwg&s" alt="User" />
                                </div>

                                {dropdownOpen && (
                                    <div className="dropdown-menu show">
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
                <p className="copyright">&copy; C1SE.15</p>
            </footer>
        </div>
    );
}

export default Layout;
