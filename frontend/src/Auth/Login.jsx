import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [backendError, setBackendError] = useState('');

  const signin = async (email, password) => {
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      setBackendError('');


      if (result.message == "Logged in successfully") {

        localStorage.setItem('accessToken',result.accessToken);

      }

      window.location.href="http://localhost:5173"
    } catch (err) {
      setBackendError(err);
    }
  };

  return (
    <div className='bg-auth'>
      <div className='All'>
        <div className='login transparent'>
          <p><i className='bx bxs-note notely'></i>Notely</p>
        </div>
        <div className='login content'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signin(email, password);
            }}
          >
            <h2 className='heading'>
              <i className='bx bxs-note notely'></i>Hi There,
            </h2>
            <p>Welcome to Notely!</p>

            <input
              type='email'
              className='inputs'
              placeholder='Email'
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              className='inputs'
              placeholder='Password'
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='options'>
              <div className='terms-checkbox'>
                <input type='checkbox' name='Terms' required />
                <label htmlFor='Terms'>Remember me</label>
              </div>
              <div className='reset'>
                <Link to='/resetpassword'>Forgot password?</Link>
              </div>
            </div>
            <div className='divider'>
              <hr />
              <span>Or</span>
            </div>

            <div className='google-login'>
              {backendError && (
                <p className='error-message' style={{ color: 'red' }}>
                  {backendError.message || backendError.toString()}
                </p>
              )}

              <button type='submit' className='login-button'>
                {loginStatus === 'loading' ? 'signing in...' : 'sign in'}
              </button>
              <p className='signup-link'>
                Don't have an Account? <Link to='/signup'>signup</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
