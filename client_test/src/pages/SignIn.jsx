import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already authenticated and redirect to home
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth-check', { withCredentials: true });
                if (response.data.authenticated) {
                    navigate('/'); // Redirect to home if authenticated
                }
            } catch (err) {
                console.error("Error during auth check:", err);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state before a new attempt

        try {
            const response = await axios.post('http://localhost:5000/authentication/signin', {
                account: username,
                password: password
            }, { withCredentials: true });

            if (response.status === 200) {
                console.log("Login successful:", response.data);
                navigate('/'); // Redirect on successful login
            }
        } catch (err) {
            console.error("Error during login:", err);
            if (err.response && err.response.status === 401) {
                setError("Invalid credentials. Please try again."); // Handle invalid credentials
            } else {
                setError("An error occurred. Please try again later."); // General error handling
            }
        }
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
                <div>
                    <button type="submit">Login</button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
}

export default SignIn;
