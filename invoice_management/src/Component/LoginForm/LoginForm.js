import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Basic validation
        if (!username.trim()) {
            setError('Please enter a username.');
            setLoading(false);
            return;
        }
        if (!password.trim()) {
            setError('Please enter a password.');
            setLoading(false);
            return;
        }
        // Simulate login logic
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            // Reset error state on successful login
            setError('');
            // Call the onLogin function passed as prop
            onLogin();
            console.log('Login successful');
        } catch (error) {
            console.error('Error during login:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateUsername = () => {
        // Perform validation for the username field (e.g., minimum length)
        if (username.trim().length < 5) {
            setError('Username must be at least 5 characters long.');
        } else {
            setError('');
        }
    };

    const validatePassword = () => {
        // Perform validation for the password field (e.g., minimum length, special characters)
        if (password.trim().length < 8) {
            setError('Password must be at least 8 characters long.');
        } else {
            setError('');
        }
    };

    return (
        <div className="login-form-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username"><FaUser /> Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={validateUsername}
                        disabled={loading}
                        required
                    />
                     {!username.trim() && <p className="validation-error">Username is required.</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password"><FaLock /> Password:</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validatePassword}
                            disabled={loading}
                            required
                        />
                         {!password.trim() && <p className="validation-error">Password is required.</p>}
                        <button
                            type="button"
                            onClick={handlePasswordVisibility}
                            className="toggle-password-btn"
                            disabled={loading}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={loading}>Login</button>
                    <button type="reset" onClick={() => { setUsername(''); setPassword(''); }}  disabled={loading}>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
