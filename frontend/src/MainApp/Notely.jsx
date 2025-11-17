
import Header from '../globals/header';
import Sidebar from '../globals/Sidebar';
import UploadLayer from '../UploadLayer/Uploader';
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import './Notely.css';
import Settings from '../Settings/Settings';

export default function Notely() {
  const settingsRef = useRef(null); 
  const toggleUserBtnRef = useRef(null);





  const [showSidebar, setShowSidebar] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showUser, setShowUser] = useState(false);

 useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      showUser &&
      settingsRef.current &&
      !settingsRef.current.contains(event.target) &&
      toggleUserBtnRef.current &&
      !toggleUserBtnRef.current.contains(event.target)  // <- ignore clicks on toggle button
    ) {
      setShowUser(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showUser]);


  return (
    <>
  <Header
    toggleSidebar={() => setShowSidebar((prev) => !prev)}
    toggleUploadbar={() => setShowUpload((prev) => !prev)}
    toggleUserbar={() => setShowUser((prev) => !prev)}
    toggleUserbarOnSidebar={() => setShowUser(false)}
    showUpload={showUpload}
    showUser={showUser}
    toggleUserBtnRef={toggleUserBtnRef} // ✅ Pass ref
  />
        

      <div className="holder" style={{ position: 'relative' }}>
        <Sidebar visible={showSidebar} />

        {showUpload && (
          <div className="uploadLayer fade-in">
            <UploadLayer
              toggleUploadbar={() => setShowUpload(false)}
              toggleUserbarOnSidebar={() => setShowUser(false)}
              showUser={showUser}
              showUpload={showUpload}
            />
          </div>
        )}

        {showUser && !showUpload && (
          <div className="userLayer fade-in" ref={settingsRef}>
            <Settings />
          </div>
        )}

        <Outlet />
      </div>
    </>
  );
}
