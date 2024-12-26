import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';
import Chatbot from '../pages/utilities/chatbot/chatbot.jsx';

function Layout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isESP, setIsESP] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCheckAdmin, setIsCheckAdmin] = useState(false);
    const [isCheckESP, setIsCheckESP] = useState(false);
    const [searchIndex, setSearchIndex] = useState('');
    const [showChatbot, setShowChatbot] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Kiểm tra quyền Admin
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                setIsAdmin(false);
                setIsESP(false);
                setIsStudent(false);
                setIsCheckAdmin(false);
                setIsCheckESP(false);
                setIsSidebarOpen(false);
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status === 200) {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
                setIsCheckAdmin(true);
            }
        };
        checkAdmin();
    }, [navigate]);

    // Kiểm tra quyền ESP
    useEffect(() => {
        const checkESP = async () => {
            if (!isCheckAdmin) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status === 200) {
                    setIsESP(true);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
                setIsCheckESP(true);
            }
        };
        checkESP();
    }, [isCheckAdmin, navigate]);

    // Kiểm tra quyền Student
    useEffect(() => {
        const checkSTU = async () => {
            if (!isCheckESP) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/stu', { withCredentials: true });
                if (response.status === 200) {
                    setIsStudent(true);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        checkSTU();
    }, [isCheckESP, navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleSignOut = async () => {
        try {
            await axios.post('http://localhost:5000/auth/signout', {}, { withCredentials: true });
            setIsAdmin(false);
            setIsESP(false);
            setIsStudent(false);
            navigate('/signin');
        } catch (err) {
            console.error('Failed to sign out:', err);
        }
    };

    // Hàm toggle hiển thị chatbot
    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    // Hàm để đóng chatbot từ bên trong component Chatbot
    const closeChatbot = () => {
        setShowChatbot(false);
    };

    useEffect(() => {
        // Đảm bảo rằng trạng thái của showChatbot là true khi trang vừa tải
        setShowChatbot(false);
    }, []);

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


    if (isLoading) {
        return <div className="layout-container">Loading...</div>;
    }

    return (
        <div className="layout-container">
            <header>
                <nav className="navbar">
                    <div className='navbar-left'>
                        <div className="home-logo">
                            <a onClick={() => { navigate('/') }}><img src="../img/Header/Logo.svg" alt="Logo" /></a>
                        </div>
                    </div>

                    <div className="search-bar">
                        <div className="searchbar-container">
                            <div className="searchbar-icon-container">
                                <img className="searchbar-icon" src='../img/Header/search_icon.svg' alt='search-icon' />
                            </div>
                            <div className="searchbar-input-container">
                                <input
                                    type="text"
                                    value={searchIndex}
                                    onChange={(e) => setSearchIndex(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Nhập từ khóa để tìm kiếm"
                                    className="searchbar-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="user-tools">
                        {isAdmin || isESP || isStudent ? (
                            <>
                                <div className="user-image" onClick={() => navigate('/profile/self')}>
                                    <img src="../img/Header/userprf_icon.svg" alt="User" />
                                </div>
                                <span className="notification-icon">
                                    <img src="../img/Header/notify_icon.svg" alt="notification-icon" />
                                </span>
                                <div className="menu-icon" onClick={toggleSidebar}>
                                    <img src="../img/Header/menu_icon.svg" alt="Menu" />
                                </div>
                            </>
                        ) : (
                            <div className="menu-icon" onClick={toggleSidebar}>
                                <img src="../img/Header/menu_icon.svg" alt="Menu" />
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {isSidebarOpen && (
                <>
                    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-header">
                            <a onClick={() => navigate('/')}><img src="../img/Header/home_sidebar.svg" alt="Logo" className="sidebar-logo" /></a>
                            <button className="close-sidebar-btn" onClick={closeSidebar}>×</button>
                        </div>
                        <ul className="sidebar-nav">
                            <li><img src="../img/Header/test_icon.svg" alt="servey" /><a onClick={() => navigate('/servey')}>Trắc nghiệm hướng nghiệp</a></li>
                            <li><img src="../img/Header/course_icon.svg" alt="course" /><a onClick={() => navigate('/course/view')}>Khóa học</a></li>
                            <li><img src="../img/Header/about_icon.svg" alt="about" /><a onClick={() => navigate('/about')}>Về chúng tôi</a></li>
                            {!isAdmin && !isESP && !isStudent && (
                                <>
                                    <li>
                                        <img src="../img/Header/login_icon.svg" alt="signin-icon" />
                                        <a onClick={() => navigate('/signin')}>Đăng nhập</a>
                                    </li>
                                    <li>
                                        <img src="../img/Header/signup_icon.svg" alt="signup-icon" />
                                        <a onClick={() => navigate('/signup')}>Đăng ký</a>
                                    </li>
                                </>
                            )}
                            {isAdmin && <li><img src="../img/Header/admin_icon.svg" alt="admin" /><a onClick={() => { navigate('/admin') }}>Dành cho nhà quản trị</a></li>}
                            {isESP && <li><img src="../img/Header/esp_icon.svg" alt="esp" /><a onClick={() => { navigate('/esp') }}>Dành cho nhà cung cấp</a></li>}
                            {(isESP || isStudent) && (<li><img src="../img/Header/learning_icon.svg" alt="edu" /><a onClick={() => { navigate('/edu') }}>Học tập</a></li>)}
                            {(isAdmin || isESP || isStudent) && (
                                <li><img src="../img/Header/setting_icon.svg" alt="settings" /><a onClick={() => { navigate('/settings') }} >Cài đặt</a></li>
                            )}
                            {(isAdmin || isESP || isStudent) && (
                                <li id="signout-btn" onClick={handleSignOut}><img src="../img/Header/signout_icon.svg" alt="sigout-btn" />Đăng xuất</li>
                            )}
                        </ul>
                    </div>
                    <div className={`backdrop ${isSidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>

                </>
            )}

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="footer_container">
                    <div className="logo-info">
                        <div className="logo">
                            <img src="../img/Header/Logo.svg" alt="Logo" />
                        </div>
                        <ul>
                            <li>
                                <img src="../img/Footer/mail_white_vector.svg" alt="" />
                                <p>hello@navcareer.com</p>
                            </li>
                            <li>
                                <img src="../img/Footer/phone_white_vector.svg" alt="" />
                                <p>+91 91813 23 2309</p>
                            </li>
                            <li>
                                <img style={{ padding: "2px" }} src="../img/Footer/location_white_vector.svg" alt="" />
                                <p>Somewhere in the World</p>
                            </li>
                        </ul>
                    </div>
                    <div className="nav-links">
                        <h3>Trọng tâm</h3>
                        <ul>
                            <li><a onClick={() => { navigate('/servey') }}>Trắc nghiệm hướng nghiệp</a></li>
                            <li><a onClick={() => { navigate('') }}>Khoá học</a></li>
                            <li><a onClick={() => { navigate('') }}>Tài nguyên hỗ trợ</a></li>
                        </ul>
                    </div>
                    <div className="nav-links">
                        <h3>Thông tin chi tiết</h3>
                        <ul>
                            <li><a onClick={() => { navigate('') }}>Công ty</a></li>
                            <li><a onClick={() => { navigate('') }}>Sứ mệnh</a></li>
                            <li><a onClick={() => { navigate('') }}>Mục tiêu</a></li>
                        </ul>
                    </div>
                    <div className="social-media">
                        <h3>Kết nối với chúng tôi</h3>
                        <ul>
                            <li><a onClick={() => { navigate('') }}><img src="../img/Footer/fb_vector.svg" alt="" /></a></li>
                            <li><a onClick={() => { navigate('') }}><img src="../img/Footer/linkedin_vector.svg" alt="" /></a></li>
                            <li><a onClick={() => { navigate('') }}><img src="../img/Footer/twitter_vector.svg" alt="" /></a></li>
                        </ul>
                    </div>
                </div>
                <p className='copyright'>&copy; C1SE.15</p>
            </footer>
            {/* Chatbot container */}
            <div className="pushup-chatbot-container">
                {showChatbot ? (
                    <Chatbot onClose={closeChatbot} />
                ) : (
                    <button className="chatbot-toggle-btn" onClick={toggleChatbot}>
                        <img
                            src="../img/Header/chatbot_icon.svg"
                            alt="Mở Chatbot"
                            className="chatbot-toggle-icon"
                        />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Layout;
