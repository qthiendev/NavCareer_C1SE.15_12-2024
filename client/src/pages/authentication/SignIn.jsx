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
            <div className="login-box">
                <div className='Header-Nav-Carrer'>
                    <img src="./assets/Header-Nav.svg" alt="" />
                </div>
                <h2 className='Tieude'>Đăng nhập vào tài khoản của bạn</h2>
                <form onSubmit={handleSubmit}>
                    <div className="SignIn-form-group">
                        <label className='label1' htmlFor="">Email</label>
                        <input
                            className='inputtext12'
                            type="text"
                            placeholder="Nhập tên người dùng/email"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="SignIn-form-group">
                        <label className='label1' htmlFor="">Mật khẩu</label>
                        <input
                            className='inputtext12'
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-links'>
                        <a href="#" className="forgot-password">Quên mật khẩu?</a>
                    </div>
                    <button type="submit" className="login-btn">Đăng nhập</button>
                </form>
                {noti && <div className="error-message" style={{ color: 'red' }}>{noti}</div>}
                <div className="signup-link">
                    <span>Chưa có tài khoản? </span><a href="/signup">Đăng ký</a>
                </div>
            </div>
            <div className="picture-side">
            <img src="./assets/Picture-Side.svg" alt="Description" className="login-image" />
            </div>
        </div>
    );
}

export default SignIn;
