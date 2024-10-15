import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

function SignIn() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [noti, setNoti] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                console.log(response)
                if (response.data.sign_in_status) {
                    navigate('/');
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
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
            const response = await axios.post('http://localhost:5000/auth/signin', {
                account: account,
                password: password,
            }, { withCredentials: true });

            if (response.status === 200) {
                navigate('/');
            }
            if (response.status === 203) {
                setNoti('Tên tài khoản hặc mật khẩu không chính xác. Vui lòng thử lại.');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setNoti('Tên tài khoản hặc mật khẩu không chính xác. Vui lòng thử lại.');
            } else {
                setNoti('Tên tài khoản hặc mật khẩu không chính xác. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Chào mừng bạn đến với NavCareer</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Tên tài khoản"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="forgot-password">
                        <a href="/">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" className="login-btn">Đăng nhập</button>
                </form>

                {noti && <div className="error-message" style={{ color: 'red' }}>{noti}</div>}

                <div className="signup-link">
                    <span>Chưa có tài khoản? </span><a href="/">Đăng ký</a>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
