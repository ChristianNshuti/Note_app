import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './header.module.css';
import Notely from '../assets/notely.webp';
import Search from '../assets/search.webp';
import Profile from '../assets/profile.webp';
import Upload from '../assets/upload.webp';
import Menu from '../assets/menu.webp';
import Activity from '../assets/activity.webp';
import { useEffect } from 'react';
import { fetchUserProfileImage } from '../features/profile/getProfileImageSlice';

export default function Header({
  toggleSidebar,
  toggleUploadbar,
  showUpload,
  toggleUserbar,
  toggleUserBtnRef,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { profiles } = useSelector(state => state.profile );
  const loggedInProfile = profiles[user.userId]?.[0]?.profileImage || Profile;
  const dispatch = useDispatch();

  useEffect(() => {
    if(user?.userId) {
      dispatch(fetchUserProfileImage(user.userId));
    }
  }, [user, dispatch]);

  const searchOptions = [
    'Home',
    'Notes-Year1',
    'Notes-Year2',
    'Notes-Year3',
    'Pastpapers-Year1',
    'Pastpapers-Year2',
    'Pastpapers-Year3',
    'saved',
    'contacts',
  ];

  const filteredOptions = searchOptions.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => setIsSearchFocused(false), 200);
  }, []);

  const handleOptionClick = useCallback(
    (option) => {
      setSearchQuery(option);
      setIsSearchFocused(false);
      const routes = {
        Home: '/',
        'Notes-Year1': '/courses/notes/1',
        'Notes-Year2': '/courses/notes/2',
        'Notes-Year3': '/courses/notes/3',
        'Pastpapers-Year1': '/courses/pastpapers/1',
        'Pastpapers-Year2': '/courses/pastpapers/2',
        'Pastpapers-Year3': '/courses/pastpapers/3',
        saved: '/saved',
        contacts: '/contacts',
      };
      if (routes[option]) {
        navigate(routes[option]);
      }
    },
    [navigate]
  );

  const handleRightHeaderClick = useCallback(
    (e) => {
      e.stopPropagation();
      toggleUserbar();
    },
    [toggleUserbar]
  );

  const handleUploadClick = useCallback(() => {
    toggleUploadbar();
  }, [toggleUploadbar]);

  return (
    <div className={Styles.headerMain}>
      <div className={Styles.leftHeader}>
        <img
          src={Menu}
          alt="menu"
          className={Styles.hamburgerButton}
          onClick={toggleSidebar}
          loading="lazy"
        />
        <img src={Notely} alt="notely" loading="lazy" />
        <p onClick={loadHome}>Notely</p>
      </div>

      <div className={Styles.middleHeader}>
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        <button>
          <img src={Search} alt="search" loading="lazy" />
        </button>
        {isSearchFocused && filteredOptions.length > 0 && (
          <div className={Styles.searchDropdown}>
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={Styles.searchOption}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={Styles.rightHeader}>
        {user?.role === 'teacher' && (
          <div>
            <div className={Styles.tooltipWrapper}>
              <button
                className={`${Styles.uploadButton} ${
                  showUpload || location.pathname === '/activity'
                    ? Styles.changedBack
                    : ''
                }`}
                onClick={() => navigate('/activity')}
              >
                <img src={Activity} alt="Activities" loading="lazy" />
              </button>
              <div className={Styles.tooltip}>Activities</div>
            </div>

            <div className={Styles.tooltipWrapper}>
              <button
                className={`${Styles.uploadButton} ${
                  showUpload ? Styles.changedBack : ''
                }`}
                onClick={handleUploadClick}
              >
                <img src={Upload} alt="upload" loading="lazy" />
              </button>
              <div className={Styles.tooltip}>Upload</div>
            </div>
          </div>
        )}

        <div 
        ref={toggleUserBtnRef} 
        style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'rgb(35,35,125)' }} 
        onClick={handleRightHeaderClick} 
        data-userbar-toggle="true"
        >
        <p style={{ margin: 0 }}>
            {user?.username || 'Guest'} 
        </p>
        <img
          src={loggedInProfile || Profile}
          className={Styles.profilePic}
          alt="profile"
          loading="lazy"
          style={{ marginLeft: '8px' }}
        />
      </div>
      </div>
    </div>
  );
}
