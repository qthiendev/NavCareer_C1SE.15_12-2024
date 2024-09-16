import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
    // State to store account and password
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect to home page if already logged in
    useEffect(() => {
        const authId = localStorage.getItem('AUTHENTICATION_ID');
        if (authId) {
            navigate('/');  // Redirect to home if logged in
        }
    }, [navigate]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);  // Show a loading state while waiting for response
        setError(''); // Clear previous errors

        try {
            // Make the GET request to your sign-in service
            const response = await fetch(`http://localhost:5000/signin/get?account=${encodeURIComponent(account)}&password=${encodeURIComponent(password)}`);

            // Parse the response
            const result = await response.json();
            // Handle based on the result
            if (result && result.AUTHENTICATION_ID) {
                // Save the AUTHENTICATION_ID in localStorage to persist login state
                localStorage.setItem('AUTHENTICATION_ID', result.AUTHENTICATION_ID);

                // Redirect to the home page on successful login
                navigate('/');
            } else {
                // Display an error message
                setError(result.message || 'Invalid credentials.');
            }
        } catch (err) {
            console.error('Error signing in:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false); // Stop loading after response is handled
        }
    };

    return (
        <div className="sign-in-container">
            <div className="sign-in-header">
                <p>Sign In</p>
            </div>

            <div className="sign-in-form">
                <form onSubmit={handleSubmit}>
                    {/* Account input field */}
                    <div>
                        <label htmlFor="account">Account</label>
                        <input
                            type="text"
                            id="account"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password input field */}
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    {/* Error message */}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default SignIn;
