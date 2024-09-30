import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [noti, setNoti] = useState(null); // Notification message
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already authenticated and redirect to home
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth-check', { withCredentials: true });
                if (response.data.session_status) {
                    navigate('/');
                }
            } catch (err) {
                console.error("Error during auth check:", err);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNoti(null); // Reset notification before a new attempt

        try {
            const response = await axios.post('http://localhost:5000/authentication/signin', {
                account: username,
                password: password
            }, { withCredentials: true });

            if (response.data.signed_in) {
                navigate('/'); // Redirect if sign-in is successful
            } else {
                setNoti('Invalid username or password. Try again.');
            }

        } catch (err) {
            console.error("Error during login:", err);
            setNoti("An error occurred. Please try again later.");
        }
    };

    const navigateToSignUp = () => {
        navigate('/signup'); // Navigate to signup page
    };

    return (
        <div className="signin-container">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
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
                {noti ? (
                    <div>{noti}</div>
                ) : null}

                <div>
                    <button type="submit">Login</button>
                </div>
            </form>

            <div>
                <button onClick={navigateToSignUp}>Sign Up</button>
            </div>
        </div>
    );
}

export default SignIn;
