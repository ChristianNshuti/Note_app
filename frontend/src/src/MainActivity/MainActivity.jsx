import UploadLayer from '../UploadLayer/Uploader';
import Header from '../globals/header';
import Activity from '../Activity/Activity';
import './MainActivity.css';
import Settings from '../Settings/Settings'; // Make sure this is imported if you use <Settings />
import { useState, useRef, useEffect } from 'react';

export default function ActivityLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const settingsRef = useRef(null); // ✅ Fix: added this line
  const toggleUserBtnRef = useRef(null); // ✅ Add this

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      showUser &&
      settingsRef.current &&
      !settingsRef.current.contains(event.target) &&
      toggleUserBtnRef.current &&
      !toggleUserBtnRef.current.contains(event.target)
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
    <div className='activityMain'>
    <Header
      toggleSidebar={() => setShowSidebar((prev) => !prev)}
      toggleUploadbar={() => setShowUpload((prev) => !prev)}
      toggleUserbar={() => setShowUser((prev) => !prev)}
      toggleUserbarOnSidebar={() => setShowUser(false)}
      showUpload={showUpload}
      showUser={showUser}
      toggleUserBtnRef={toggleUserBtnRef} // ✅ Add this line
    />


      <div className='activity-scroll-container'>
              <div className="holder" style={{ position: 'relative' }}>
        {showUpload && (
          <div className="uploadOverlay fade-in">
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

      </div>
      <Activity />
      </div>
    </div>
  );
}
