import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

function SignUp() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [authz_id, setAuthzId] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setError('');
        setSuccess('');

        // Username validation
        const usernameRegex = /^[a-z0-9]{1,12}$/;
        if (!usernameRegex.test(account)) {
            setError('Tên người dùng phải là viết thường, không dấu, chỉ bao gồm chữ cái và số, tối đa 12 ký tự.');
            return;
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
        if (!passwordRegex.test(password)) {
            setError('Mật khẩu phải bao gồm chữ in hoa, chữ in thường, số và ký tự đặc biệt, dài từ 6-12 ký tự.');
            return;
        }

        // Check if the user type is selected and terms are accepted
        if (!authz_id) {
            setError('Vui lòng chọn loại người dùng.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu chưa trùng khớp.');
            return;
        }

        if (!acceptedTerms) {
            setError('Bạn phải đồng ý với Điều Khoản và Điều kiện để tạo tài khoản.');
            return;
        }

        try {
            const signupResponse = await axios.post('http://localhost:5000/auth/signup',
                { account, password, email, authz_id },
                { withCredentials: true });

            if (signupResponse.status === 200) {
                const signinResponse = await axios.post('http://localhost:5000/auth/signin',
                    { account: account, password: password, },
                    { withCredentials: true });

                if (signinResponse.status === 200) {
                    setSuccess('Đăng ký thành công! Đang chuyển hướng để tạo hồ sơ của bạn...');
                    setTimeout(() => navigate(`/profile/create`), 1000); // Redirect to create profile after a brief pause
                }
            }

            if (signupResponse.status === 201) {
                setError('Tên tài khoản này đã tồn tại hoặc email đã được sử dụng.');
            }

            if (signupResponse.status === 203) {
                setError('Tạo tài khoản thất bại.');
            }

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
            } else {
                setError('Đăng ký thất bại. Vui lòng thử lại sau.');
            }
        }
    };

    if (loading)
        return (<div>Loading...</div>);

    return (
        <div className="signup-page">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <a href="/"><img src="/img/Header/home_sidebar.svg" alt="navCareer Logo" className="header-logo" /></a>
                </div>
            </header>

            <div className="signup-main">
                {/* Form đăng ký */}
                <div className="signup-form-container">
                    <h2 className="signup-title">Đăng ký tài khoản</h2>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className='signup-form-row'>
                            {/* Tên tài khoản */}
                            <div className="signup-form-group">
                                <label htmlFor="account" className="signup-form-label">
                                    Tên tài khoản:
                                </label>
                                <input
                                    className="signup-input"
                                    type="text"
                                    id="account"
                                    placeholder="Nhập tên tài khoản"
                                    value={account}
                                    onChange={(e) => setAccount(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Loại người dùng */}
                            <div className="signup-form-group">
                                <label htmlFor="authz_id" className="signup-form-label">
                                    Loại người dùng:
                                </label>
                                <select
                                    className="signup-input"
                                    id="authz_id"
                                    value={authz_id}
                                    onChange={(e) => setAuthzId(e.target.value)}
                                    required
                                >
                                    <option value="">Lựa chọn loại tài khoản</option>
                                    <option value="2">Cung cấp dịch vụ giáo dục</option>
                                    <option value="3">Học sinh, sinh viên</option>
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="signup-form-row">
                            <div style={{ width: '100%' }} className="signup-form-group">
                                <label htmlFor="email" className="signup-form-label">
                                    Email:
                                </label>
                                <input
                                    className="signup-input"
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className='signup-form-row'>
                            {/* Mật khẩu */}
                            <div className="signup-form-group">
                                <label htmlFor="password" className="signup-form-label">
                                    Mật khẩu:
                                </label>
                                <input
                                    className="signup-input"
                                    type="password"
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Nhập lại mật khẩu */}
                            <div className="signup-form-group">
                                <label htmlFor="confirmPassword" className="signup-form-label">
                                    Nhập lại mật khẩu:
                                </label>
                                <input
                                    className="signup-input"
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Đồng ý điều khoản */}
                        <div className="signup-form-checkbox">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                            />
                            <label htmlFor="acceptTerms">
                                Tôi đồng ý với <a href="#">Điều khoản</a> và <a href="#">Điều kiện</a>.
                            </label>
                        </div>

                        {/* Nút đăng ký */}
                        <button className="signup-btn" type="submit">
                            Tạo Tài Khoản
                        </button>
                    </form>

                    {/* Hiển thị thông báo lỗi hoặc thành công */}
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    
                    {/* Đăng nhập qua mạng xã hội */}
                    <div className="social-signup">
                        <span className="social-signup-text"> Hoặc đăng ký với </span>
                        <div className="social-signup-buttons">
                            <button className="social-signup-btn facebook"><img src="/img/authen/Facebook_Logo.svg" alt="fb" />Facebook</button>
                            <button className="social-signup-btn google"><img src="/img/authen/Google_Logo.svg" alt="gg" />Google</button>
                            <button className="social-signup-btn microsoft"><img src="/img/authen/Microsoft_Logo.svg" alt="mic" />Microsoft</button>
                        </div>
                    </div>

                    {/* Chuyển hướng đăng nhập */}
                    <div className="signin-section">
                        <span>Đã có tài khoản? </span>
                        <a href="/signin" className="signin-link">
                            Đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default SignUp;
