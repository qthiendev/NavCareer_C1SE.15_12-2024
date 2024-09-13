import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const queryString = new URLSearchParams({ account, password }).toString();
      const response = await fetch(`/authentication/signin?${queryString}`);

      const result = await response.json();

      navigate(result.isUser ? '/' : '/signin');

    } catch (err) {
      console.error('<!> Error during sign-in process.', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="account">Account: </label>
          <input type="text" id="account" name="account" value={account} onChange={(e) => setAccount(e.target.value)} />
        </div>

        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <input type="submit" value="Submit" />
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SignIn;