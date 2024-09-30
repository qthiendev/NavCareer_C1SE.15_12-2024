import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [authorization_id, setAuthorizationId] = useState('1'); // Default to Education Service Provider
    const [noti, setNoti] = useState(null); // Notification message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNoti(null); // Reset notification before a new attempt

        try {
            const response = await axios.post('http://localhost:5000/authentication/signup', {
                account: username,
                password: password,
                email: email,
                authorization_id: authorization_id
            });

            if (response.data.sign_up_status) {
                navigate('/signin'); // Redirect to login page after successful sign up
            } else {
                setNoti('Sign up failed. Try again.');
            }

        } catch (err) {
            console.error('Error during signup:', err);
            setNoti('An error occurred during sign up. Please try again later.');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
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
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Select your role:</label>
                    <select
                        id="role"
                        value={authorization_id}
                        onChange={(e) => setAuthorizationId(e.target.value)}
                        required
                    >
                        <option value="1">Education Service Provider</option>
                        <option value="2">Student</option>
                    </select>
                </div>
                {noti ? <div>{noti}</div> : null}

                <div>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
