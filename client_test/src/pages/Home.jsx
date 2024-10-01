import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [status, setStatus] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authentication/status', { withCredentials: true });
                setStatus(response.data.status);
                setUsername(response.data.username);
            } catch (err) {
                if (!err.response) {
                    setError('Error during auth check!');
                    return;
                }
                setError('Please sign in.');
            }
        };
        checkAuth();
    }, []);

    const handleSignOut = async () => {
        try {
            await axios.post('http://localhost:5000/authentication/signout', {}, { withCredentials: true });
            setStatus(false);
            navigate('/'); // Redirect to sign-in page after signing out
        } catch (err) {
            setError('Error during sign out. Please try again later.');
            console.error("Error during sign out:", err);
        }
    };

    return (
        <div className="home-container">
            {status ? (
                <div>
                    <h1>Hello, {username}!</h1>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <div>
                    <h1>This is the home page.</h1>
                    {error && <p>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default Home;
