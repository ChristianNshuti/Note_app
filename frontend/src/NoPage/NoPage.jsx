import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './NoPage.module.css';
import { useSelector } from 'react-redux';

const NoPage = () => {
  const {loading} = useSelector((state) => state.auth);
  console.log("Loading",loading);
  if(!loading) {
    return (
      <div className={Styles.container}>
        <h1 className={Styles.title}>404 NOT FOUND</h1>
        <p className={Styles.subtitle}>Sorry, this page doesn't exist.</p>
        <div className={Styles.errorCode}>
          <span>4</span>
          <span className={Styles.zero}>0</span>
          <span>4</span>
        </div>
        <p className={Styles.message}>uh-oh! nothing here...</p>
        <Link to="/" className={Styles.button}>GO BACK HOME</Link>
      </div>
    );
  };

  if(loading) {return (
    <div>
      <p>Loading...</p>
    </div>
  )};
  
return (
  <div className={Styles.container}>
  <h1 className={Styles.title}>404 NOT FOUND</h1>
  <p className={Styles.subtitle}>Sorry, this page doesn't exist.</p>
  <div className={Styles.errorCode}>
    <span>4</span>
    <span className={Styles.zero}>0</span>
    <span>4</span>
  </div>
  <p className={Styles.message}>uh-oh! nothing here...</p>
  <Link to="/" className={Styles.button}>GO BACK HOME</Link>
</div>
)}
export default NoPage;