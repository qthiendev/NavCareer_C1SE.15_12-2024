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
            setError('Please select a user type.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!acceptedTerms) {
            setError('You must accept the terms and conditions.');
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
                    setSuccess('Signup successful! Redirecting to create your profile...');
                    setTimeout(() => navigate(`/profile/create`), 1000); // Redirect to create profile after a brief pause
                }
            }

            if (signupResponse.status === 201) {
                setError('Tên tài koản này đã tồn tại hoặc email đã được sử dụng.');
            }

            if (signupResponse.status === 203) {
                setError('Tạo tài khoản thất bại.');
            }

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Signup or sign-in failed. Please try again.');
            } else {
                setError('Signup or sign-in failed. Please try again.');
            }
        }
    };

    if (loading)
        return (<div>Loading...</div>);

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className='Header-Nav-Carrer2'>
                    <img src="./assets/Header-Nav.svg" alt="" />
                </div>
                <h2 className='Tieude2'>Đăng ký tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="SignUp-form-group1">
                            <label htmlFor="account">Tên tài khoản:</label>
                            <input className='input-signup'
                                type="text"
                                id="account"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="SignUp-form-group3">
                            <label htmlFor="authz_id">Loại người dùng:</label>
                            <select className='select-signup'
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
                    <div className="SignUp-form-group2">
                        <label htmlFor="email">Email:</label>
                        <input className='input-signup'
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="SignUp-form-group1">
                            <label htmlFor="password">Mật khẩu:</label>
                            <input className='input-signup'
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="SignUp-form-group1">
                            <label htmlFor="confirmPassword">Nhập lại mật khẩu:</label>
                            <input className='input-signup'
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                        <label htmlFor="acceptTerms">
                            Tôi đồng ý với <a href="">Điều khoản</a> và <a href="">Điều kiện</a>
                        </label>
                    </div>
                    <button className='btn-signup' type="submit">Tạo Tài Khoản </button>
                </form>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <p className="login-link">
                    Bạn đã có tài khoản? <a href="/signin">Đăng nhập ngay</a>
                </p>
                <div className="signup-notes">
                    <h3>Lưu ý</h3>
                    <ul>
                        <li><strong>Tên người dùng:</strong> Viết thường, không dấu, chỉ bao gồm chữ cái và số, tối đa 12 ký tự.</li>
                        <li><strong>Mật khẩu:</strong> Bao gồm chữ in hoa, chữ in thường, số và ký tự đặc biệt, dài từ 6-12 ký tự.</li>
                    </ul>
                </div>
            </div>
            <div className="picture-side1">
                <img src="./assets/Picture-Side.svg" alt="Description" className="login-image" />
            </div>
        </div>
    );
}

export default SignUp;
