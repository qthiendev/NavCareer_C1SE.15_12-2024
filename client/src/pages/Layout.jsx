import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaBell, FaFacebookMessenger } from 'react-icons/fa';
import './Layout.css';
import Chatbot from '../pages/utilities/chatbot/chatbot.jsx';


function Layout() {
    const [isCheckAdmin, setIsCheckAdmin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckESP, setIsCheckESP] = useState(false);
    const [isESP, setIsESP] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchIndex, setSearchIndex] = useState('');
    const [showChatbot, setShowChatbot] = useState(false);
    // const [isChatbotVisible, setIsChatbotVisible] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    // const location = useLocation();
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                setIsAdmin(false);
                setIsESP(false);
                setIsStudent(false);
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status === 200) {
                    setIsAdmin(response.status === 200);
                    console.log('Admin is loggin');
                }
            } catch (err) {
                console.log(err);
                setIsCheckAdmin(true);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, [navigate, location]);

    useEffect(() => {
        const checkESP = async () => {
            if (!isCheckAdmin) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status === 200) {
                    setIsESP(response.status === 200);
                    console.log('ESP is loggin');
                }
            } catch (err) {
                console.log(err);
                setIsCheckESP(true);
                setIsESP(false);
            } finally {
                setLoading(false);
            }
        };
        checkESP();
    }, [isCheckAdmin, navigate, location]);

    useEffect(() => {
        const checkSTU = async () => {
            if (!isCheckESP) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/stu', { withCredentials: true });
                if (response.status === 200) {
                    setIsStudent(response.status === 200);
                    console.log('Student is loggin');
                }
            } catch (err) {
                console.log(err);
                console.log('No one is loggin');
                setIsESP(false);
            } finally {
                setLoading(false);
            }
        };
        checkSTU();
    }, [isCheckESP, navigate, location]);

    const handleSearch = () => {
        if (searchIndex.trim()) {
            navigate(`/search?index=${searchIndex}`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // const toggleChatbot = () => setIsChatbotVisible(!isChatbotVisible);

    const handleSignOut = async () => {
        try {
            await axios.post('http://localhost:5000/auth/signout', {}, { withCredentials: true });
            setIsAdmin(false);
            setIsESP(false);
            navigate('/signin');
        } catch (err) {
            console.error('Failed to sign out:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="layout-container">
                Loading...
            </div>
        );
    } else {
        return (
            <div className="layout-container">
                <header>
                    <nav className="navbar">
                        <div className="home-logo">
                            <a href="/"><img src="/img/Header/Logo.svg" alt="Logo" /></a>
                        </div>

                        <div className="search-bar">
                            <input
                                type="text"
                                value={searchIndex}
                                onChange={(e) => setSearchIndex(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Tìm kiếm..."
                                className="search-input"
                            />
                            <FaSearch onClick={handleSearch} className="search-icon" />
                        </div>

                        <ul className="nav-list">
                            <li><a href="/servey">TRẮC NGHIỆM HƯỚNG NGHIỆP</a></li>
                            <li><a href="/course/view">KHÓA HỌC</a></li>
                            <li><a href="/about">VỀ CHÚNG TÔI</a></li>
                            <div className='icon-container-mess'>
                                {/* <li><FaFacebookMessenger className="notification-icon" onClick={() => navigate('/chatbot')} /></li> */}
                                <li>
                                    <FaFacebookMessenger
                                        className="notification-icon"
                                        onClick={toggleChatbot}
                                    />
                                    {showChatbot && (
                                        <div className="chatbot-modal">
                                            <div className="chatbot-header">
                                                <button onClick={() => setShowChatbot(false)} className="close-button">X</button>
                                            </div>
                                            <Chatbot />
                                        </div>
                                    )}
                                </li>
                                <span className="description-icon-chatbot">CHAT BOT</span>
                            </div>
                        </ul>

                        <FaBell className="notification-icon" />

                        <div className="user-image" onClick={toggleDropdown}>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR26AaR_J8UOopLWkGkJpZ3g1r4Cl-vIlnWwg&s" alt="User" />
                        </div>

                        {dropdownOpen && (
                            <div className="dropdown-menu show1">
                                <ul>
                                    {isAdmin || isESP || isStudent ? (
                                        <>
                                            <li className='li1'><a href="/profile/self">Hồ sơ người dùng</a></li>
                                            <li className='li1'><a href="/edu">Học tập</a></li>
                                            <li className='li1'><a href="/settings">Thiết lập cá nhân</a></li>
                                            {isAdmin && (
                                                <li className='li1'><a href="/admin">Dành cho nhà quản trị</a></li>
                                            )}
                                            {isESP && (
                                                <li className='li1'><a href="/esp">Dành cho nhà cung cấp</a></li>
                                            )}
                                            <li className='li1' id="signout-btn" onClick={handleSignOut}>Đăng xuất</li>
                                        </>
                                    ) : (
                                        <>
                                            <li className='li1'><a className="signin" href="/signin">Đăng nhập </a></li>
                                            <li className='li1'><a className="signup" href="/signup">Đăng ký</a></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        )}
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
}

export default Layout;
