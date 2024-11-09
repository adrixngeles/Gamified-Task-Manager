// LoginAuth.jsx
import React, { useState } from 'react';
import './Login.css';

const LoginAuth = ({ onAuth }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate a delay for authentication (if needed)
    setTimeout(() => {
      onAuth(username);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleLogin();
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {error && <p className="auth-error">{error}</p>}
      <button className="auth-button" onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </div>
  );
};

export default LoginAuth;
