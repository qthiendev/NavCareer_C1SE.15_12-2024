import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authId = localStorage.getItem('AUTHENTICATION_ID');
        if (authId) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:5000/signin/get?account=${encodeURIComponent(account)}&password=${encodeURIComponent(password)}`);

            const result = await response.json();
            if (result && result.AUTHENTICATION_ID) {
                localStorage.setItem('AUTHENTICATION_ID', result.AUTHENTICATION_ID);

                navigate('/');
            } else {
                setError(result.message || 'Invalid credentials.');
            }
        } catch (err) {
            console.error('Error signing in:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sign-in-container">
            <div className="sign-in-header">
                <p>Sign In</p>
            </div>

            <div className="sign-in-form">
                <form onSubmit={handleSubmit}>
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

                    <div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default SignIn;
