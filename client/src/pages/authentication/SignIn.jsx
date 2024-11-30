import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

function SignIn() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [noti, setNoti] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                if (response.data.sign_in_status) {
                    navigate(-1);
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNoti(null);

        if (!account || !password) {
            setNoti('Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/signin',
                { account: account, password: password },
                { withCredentials: true });

            if (response.status === 200) {
                navigate(-1);
            }
            if (response.status === 201) {
                navigate(-1);
            }
            if (response.status === 203) {
                setNoti('Tên tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.');
            }
        } catch (err) {
            setNoti('Tên tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="login-container">
            {/* Header */}
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <a href="/"><img src="/img/Header/home_sidebar.svg" alt="navCareer Logo" className="header-logo" /></a>
                </div>
            </header>
            <div className="signin-main">
                {/* Form đăng nhập */}
                <div className="signin-form-container">
                    <div className="signin-content">
                        <h2 className="signin-title">Đăng nhập vào tài khoản của bạn</h2>
                        <form onSubmit={handleSubmit} className="signin-form">
                            {/* Email */}
                            <div className="signin-form-group">
                                <label htmlFor="email" className="signin-form-label">
                                    Email
                                </label>
                                <input
                                    id="signin-email"
                                    className="signin-form-input"
                                    type="email"
                                    placeholder="Nhập tên người dùng/email"
                                    value={account}
                                    onChange={(e) => setAccount(e.target.value)}
                                    required
                                />                               
                            </div>

                            {/* Mật khẩu */}
                            <div className="signin-form-group">
                                <label htmlFor="password" className="signin-form-label">
                                    Mật khẩu
                                </label>
                                <input
                                    id="signin-password"
                                    className="signin-form-input"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Lưu thông tin đăng nhập và quên mật khẩu */}
                            <div className="signin-form-options">
                                <label className="signin-form-checkbox">
                                    <input type="checkbox" />
                                    Lưu thông tin đăng nhập
                                </label>
                                <a href="#" className="signin-forgot-password">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Nút đăng nhập */}
                            <button type="submit" className="signin-btn">
                                Đăng nhập
                            </button>
                        </form>

                        {/* Thông báo lỗi */}
                        {noti && <div className="error-message">{noti}</div>}

                        {/* Đăng nhập qua mạng xã hội */}
                        <div className="social-signin">
                            <span className="social-text"> Hoặc đăng nhập với </span>
                            <div className="social-buttons">
                                <button className="social-btn facebook"><img src="/img/authen/Facebook_Logo.svg" alt="fb" />Facebook</button>
                                <button className="social-btn google"><img src="/img/authen/Google_Logo.svg" alt="gg" />Google</button>
                                <button className="social-btn microsoft"><img src="/img/authen/Microsoft_Logo.svg" alt="mic" />Microsoft</button>
                            </div>
                        </div>

                        {/* Đăng ký tài khoản */}
                        <div className="signup-section">
                            <span>Chưa có tài khoản? </span>
                            <a href="/signup" className="signup-link">
                                Đăng ký
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    );
}

export default SignIn;
