import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [noti, setNoti] = useState(null); // Notification message
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authentication/status', { withCredentials: true });
                if (response.data.status) {
                    navigate('/');
                }
            } catch (err) {
                
            }
        };
        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNoti(null);

        if (!username || !password) {
            setNoti('Please enter both username and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/authentication/signin', {
                account: username,
                password: password
            }, { withCredentials: true });

            if (response.status === 200) {
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setNoti('Invalid username or password. Please try again.');
            } else {
                setNoti('Server error. Please try again later.');
            }
        }
    };

    return (
        <div className="signin-container">
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {noti && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        {noti}
                    </div>
                )}

                <div>
                    <button type="submit">Sign in</button>
                </div>
            </form>
        </div>
    );
}

export default SignIn;
