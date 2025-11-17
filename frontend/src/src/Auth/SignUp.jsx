import React, { useState } from "react";
import './SignUp.css';
import { Link } from "react-router-dom";
import { register } from "../features/auth/authSlice";
import { useDispatch, useSelector } from 'react-redux';


function SignUp() {

      const dispatch = useDispatch();
    const { status, error,registerStatus } = useSelector((state) => state.auth);

        const [email,setEmail] = useState('');
        const [password,setPassword] = useState('');
        const [signupMessage,setSignupMessage] = useState('');

  const signup = async(email,password) => {
      try {
        const message = await dispatch(register({email,password})).unwrap();
        setSignupMessage(message);
        return;
        
      } catch (err) {
        console.log('error',err);
        return;
      }
  }

  return (
  <div className="bg-auth">
      <div className="All">
      <div className='content'>
        <form onSubmit={(e) =>{e.preventDefault();
                        signup(email,password)
        }}>
          <h2 className="heading">Create an Account</h2>

          <input type='email' className='inputs' placeholder='Email' required onChange={(e)=> setEmail(e.target.value)}/><br />
          <input type='password' className='inputs' placeholder='Password' required onChange={(e)=> setPassword(e.target.value)}/><br />

          <div className="terms-checkbox">
            <input type='checkbox' name='Terms' required />
            <label htmlFor="Terms">I agree to the terms and conditions</label>
          </div>

          <div className='divider'>
            <hr />
            <span>Or</span>
          </div>
              
          <div className="google-signin"> 
          
          {signupMessage !== '' && (
              <p style={{ color: signupMessage === 'User already registered' ? 'red' : '#007bff', fontSize: '0.875rem', }} >
                  {signupMessage}
              </p>
          )}

            <button type="submit" className="signup-button">{registerStatus === "registering" 
            ? "Signing up..." 
            : "Sign up"}

            </button>
            <br/>

            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link> 
            </p>

          </div>
        </form>
      </div>
      <div className="signup transparent">
          <p><i className='bx bxs-note notely'></i> Notely</p>
          </div>
        </div>
</div>
  );
}

export default SignUp;
