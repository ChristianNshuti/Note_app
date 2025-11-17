import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Reset.css';
import { useDispatch } from 'react-redux';
import { forgotPassword, resetPassword } from '../features/auth/authSlice';

export default function ResetPassword() {
  const { token } = useParams();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!token) {

      try {
        const resultAction = await dispatch(forgotPassword({ email }));
        if (forgotPassword.fulfilled.match(resultAction)) {
          setMessage(resultAction.payload || 'Reset link sent to your email');
        } else {
          setError(resultAction.payload || 'Failed to send reset email');
        }
      } catch {
        setError('Server error. Try again later.');
      }
      return;
    }

 
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const resultAction = await dispatch(resetPassword({ token, newPassword: password }));
      if (resetPassword.fulfilled.match(resultAction)) {
        setMessage(resultAction.payload || 'Password reset successful');
      } else {
        setError(resultAction.payload || 'Failed to reset password');
      }
    } catch {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="resetMain">
      <form className="resetDiv" onSubmit={handleSubmit}>
        <h2>{token ? 'Reset Your Password' : 'Request a Password Reset'}</h2>

        {!token && (
          <input 
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {token && (
          <>
            <input
              type="password"
              placeholder="New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        <button type="submit">{token ? 'Reset Password' : 'Send Reset Link'}</button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p className="backToLogin">
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}
