import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth-check', { withCredentials: true });
                setIsAuthenticated(true)
                setIsAuthenticated(response.data.authenticated);
            } catch (err) {
                console.error("Error during auth check:", err);
            }
        };

        checkAuth();
    }, []);

    const handleSignOut = async () => {
        try {
            await axios.post('http://localhost:5000/authentication/signout', {}, { withCredentials: true });
            setIsAuthenticated(false);
            navigate('/'); // Redirect to sign-in page after signing out
        } catch (err) {
            console.error("Error during sign out:", err);
        }
    };

    return (
        <div className="home-container">
            {isAuthenticated ? (
                <div>
                    <h1>Hello, user!</h1>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <h1>This is the home page.</h1>
            )}
        </div>
    );
}

export default Home;
