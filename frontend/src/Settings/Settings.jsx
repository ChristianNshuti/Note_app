import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../features/auth/authSlice';
import Styles from './Settings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import Logout from '../assets/logout.webp';
import { logout } from '../features/auth/authSlice';
import Profile from '../assets/name.webp';
import Switch from '../assets/swap.png';


export default function Settings() {
  const { user } = useSelector((state)=> state.auth);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [confirmEmailInput, setConfirmEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const [fname,setFname] = useState('Any');
  const [lname,setLname] = useState('Any');
  const [password,setPassword] = useState('Any');
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const { profiles } = useSelector(state => state.profile );
  const loggedInProfile = profiles[user.userId]?.[0]?.profileImage || Profile;
  


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Send immediately
      const formData = new FormData();
      formData.append("file", file); // 👈 must match multer field name

      dispatch(updateUser(formData))
        .unwrap()
        .then(() => setMessage("Profile image updated successfully!"))
        .catch(() => setMessage("Failed to update profile image"));
    }
  };


  const handleEditName = () => {
    if (isEditingName) {
      const formData = new FormData();
      formData.append("firstname", fname);
      formData.append("lastname", lname);
      formData.append("password", password);
      if (profileImage) {
        formData.append("file", profileImage); // 👈 must match multer field name
      }

      dispatch(updateUser(formData)); 
      setMessage("Profile updated successfully!");
    }
    setIsEditingName(!isEditingName);
  };

  
    const handleEditPassword = () => {
      setShowEmailConfirm(true);
    };
  
    const handleConfirmEmail = () => {
      if (confirmEmailInput === user.email) {
        setShowEmailConfirm(false);
        setIsEditingPassword(true);
        setConfirmEmailInput('');
      } else {
        setMessage('Email does not match!');
      }
    };
  
    const handleUndoEmail = () => {
      setShowEmailConfirm(false);
      setConfirmEmailInput('');
    };
  
    const handleSavePassword = () => {
      dispatch(updateUser({fname,lname,password}));
      setMessage('Password updated successfully!');
      setIsEditingPassword(false);
    };

    const handleLogout = () => {
      dispatch(logout()).unwrap();
      navigate('/login');
    }

  return (
    <div className={Styles.settingsMain}>
      <div className={Styles.profileWrapper}>
      <img
        src={
          profileImage
            ? URL.createObjectURL(profileImage) // preview before upload finishes
            : loggedInProfile
        }
        className={Styles.profileImage}
        alt="Profile"
        loading="lazy"
        onClick={() => document.getElementById("fileInput").click()} 
      />
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        hidden
      />
    </div>
      {message && (
        <div className={`${Styles.message} ${message.includes('Email') ? Styles.error : ''}`}>
          {message}
        </div>
      )}
      
      <div className={Styles.infoSection}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            placeholder={user?.firstname || 'loading...'}
            onChange={(e) => setFname(e.target.value)}
            disabled={!isEditingName}
          />
          <label>Last Name</label>
          <input
            type="text"
            placeholder={user?.lastname || 'loading...'}
            onChange={(e) => setLname(e.target.value)}
            disabled={!isEditingName}
          />
        </div>
        <button className={Styles.editBtn} onClick={handleEditName}>
          {isEditingName ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className={Styles.infoSection}>
        <div>
          <label>Email</label>
          <span>{user?.email || 'loading...'}</span>
        </div>
      </div>
      <div className={Styles.infoSection}>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder='******'
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEditingPassword}
          />
        </div>
        <button
          className={Styles.editBtn}
          onClick={isEditingPassword ? handleSavePassword : handleEditPassword}
        >
          {isEditingPassword ? 'Save' : 'Edit'}
        </button>
      </div>
      {showEmailConfirm && (
        <div className={Styles.confirmEmail}>
          <input
            type="email"
            placeholder="Confirm your email"
            value={confirmEmailInput}
            onChange={(e) => setConfirmEmailInput(e.target.value)}
          />
          <div className={Styles.buttonGroup}>
            <button className={Styles.confirmBtn} onClick={handleConfirmEmail}>
              Confirm
            </button>
            <button className={Styles.undoBtn} onClick={handleUndoEmail}>
              Undo
            </button>
          </div>
        </div>
      )}
      
      <div className={Styles.logoutDiv} onClick={handleLogout}>
        <img src={Logout} alt="logout icon" className={Styles.icon} />
        <span>Log out</span>
      </div>



    </div>
  );
}