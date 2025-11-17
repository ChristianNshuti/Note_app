import React, { useState } from "react";
import Styles from './Sidebar.module.css';
import Home from '../assets/home.webp';
import Notes from '../assets/notes.webp';
import Pastpapers from '../assets/pastpapers.webp';
import Saved from '../assets/saved.webp';
import Contacts from '../assets/contacts.webp';
import SideAvatar from '../assets/sideAvatar.webp';
import Rotater from '../assets/rotater.webp';
import { Link, useNavigate } from 'react-router-dom';
import Year1 from '../assets/level1.webp'
import Year2 from '../assets/level2.webp'
import Year3 from '../assets/level3.webp'
import { useLocation } from 'react-router-dom';


export default function Sidebar({ visible }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setActiveDropdown(null);
  };

  const toggleDropdown = (key) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  };
  
  const location = useLocation();


  return (
        <div  className={`${Styles.sidebarMain} ${ visible ? Styles.show : Styles.hide }`} >
     
      <p className={Styles.headingBar}>Menu</p>

      <button onClick={() => handleNavigation('/')} className={`${Styles.navigationBtn} ${location.pathname === '/' ? Styles.activeNav : ''}`}>
        <img src={Home} className={Styles.navigationIcon} alt="Home" loading="lazy"/>
        <span>Home</span>
      </button>

      <div className={Styles.sectionWrapper}>
        <button onClick={() => toggleDropdown('notes')} className={`${Styles.navigationBtn} ${location.pathname === '/notes' ? Styles.activeNav : ''}`}>
          <img src={Notes} className={Styles.navigationIcon} alt="Notes" loading="lazy"/>
          <span>Notes</span>
          <img src={Rotater} className={`${Styles.rotaterImage} ${activeDropdown === 'notes' ? Styles.rotateMode : ''}`} />
        </button>

        <div
          className={`${Styles.dropdownWrapper} ${
            activeDropdown === 'notes' ? Styles.dropdownOpen : ''
          }`}
        >
          <Link to="/courses/notes/1" className={`${Styles.dropdownItem} ${location.pathname === '/courses/notes/1' ? Styles.activeItem : ''}`}>
                <img src={Year1} alt="" className={Styles.dropdownIcon} loading="lazy"/>
                Year 1
          </Link>

          <Link to="/courses/notes/2" className={`${Styles.dropdownItem} ${location.pathname === '/courses/notes/2' ? Styles.activeItem : ''}`}>
                <img src={Year2} alt="" className={Styles.dropdownIcon} loading="lazy"/>
                Year 2
          </Link>

          <Link to="/courses/notes/3" className={`${Styles.dropdownItem} ${location.pathname === '/courses/notes/3' ? Styles.activeItem : ''}`}>
                <img src={Year3} alt="" className={Styles.dropdownIcon} loading="lazy"/>
                Year 3
          </Link>

        </div>
      </div>

      <div className={Styles.sectionWrapper}>
        <button onClick={() => toggleDropdown('pastpapers')} className={`${Styles.navigationBtn} ${location.pathname === '/pastpapers' ? Styles.activeNav : ''}`}>
          <img src={Pastpapers} className={Styles.navigationIcon} alt="Pastpapers" loading="lazy"/>
          <span>Pastpapers</span>
          <img src={Rotater} className={`${Styles.rotaterImage} ${activeDropdown === 'pastpapers' ? Styles.rotateMode : ''}`}/>
        </button>
        <div
          className={`${Styles.dropdownWrapper} ${
            activeDropdown === 'pastpapers' ? Styles.dropdownOpen : ''
          }`}
        >
         


         <Link to="/courses/pastpapers/1" className={`${Styles.dropdownItem} ${location.pathname === '/courses/pastpapers/1' ? Styles.activeItem : ''}`}>
                <img src={Year1} alt="" className={Styles.dropdownIcon} loading="lazy"/>
                Year 1
          </Link>

          <Link to="/courses/pastpapers/2" className={`${Styles.dropdownItem} ${location.pathname === '/courses/pastpapers/2' ? Styles.activeItem : ''}`}>
                <img src={Year2} alt="" className={Styles.dropdownIcon} loading="lazy"/>
                Year 2
          </Link>

          <Link to="/courses/pastpapers/3" className={`${Styles.dropdownItem} ${location.pathname === 'courses/pastpapers/3' ? Styles.activeItem : ''}`}>
                <img src={Year3} alt="" className={Styles.dropdownIcon} loading="lazy"/>
                Year 3
          </Link>



        </div>
      </div>

      <button onClick={() => handleNavigation('/saved')} className={`${Styles.navigationBtn} ${location.pathname === '/saved' ? Styles.activeNav : ''}`}>
        <img src={Saved} className={Styles.navigationIcon} alt="Saved" loading="lazy"/>
        <span>Saved</span>
      </button>

      <button onClick={() => handleNavigation('/contacts')} className={`${Styles.navigationBtn} ${location.pathname === '/contacts' ? Styles.activeNav : ''}`}>
        <img src={Contacts} className={Styles.navigationIcon} alt="Contacts" loading="lazy"/>
        <span>Contacts</span>
      </button>

        <div className={Styles.avatarDiv}>
        <p>Share smartly,<br /> learn better with Notely</p>
           <img
                src={SideAvatar}
                className={`${Styles.avatar} ${activeDropdown ? Styles.avatarCollapse : ''}`}
                alt="Side Avatar"
                loading="lazy"
           />

      </div> 
    </div>
  );
}
