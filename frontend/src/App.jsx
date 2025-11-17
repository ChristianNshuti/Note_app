import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Notely from './MainApp/Notely';
import AuthLayout from './MainAuth/Auth';
import ActivityLayout from './MainActivity/MainActivity';
import Home from './Home/home';
import Notes from './Notes/Notes';
import Pastpapers from './Pastpapers/Pastpapers';
import Saved from './Saved/Saved';

import Courses from './Notes/Courses';
import SavedNotes from './Saved/NotesOnly';
import SavedPastpapers from './Saved/ExamsOnly';
import SignUp from './Auth/SignUp';
import Login from './Auth/Login';
import NoPage from './NoPage/NoPage';
import Developers from './Developers/Developers';
import ResetPassword from './Auth/Reset';
import ChooseRole from './Auth/chooseRole';
import RecentNotes from './Notes/RecentNotes';
import RecentPastPapers from './Notes/RecentPastPapers';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';
import { fetchUserProfileImage } from './features/profile/getProfileImageSlice';

function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    const routeName =
      path === '/' ? 'Home' :
      path === '/savednotes' ? 'Saved' :
      path === '/savedpastpapers' ? 'Saved' :
      path.startsWith('/courses/') ? 'Courses' :
      path
        .slice(1)
        .split('/')
        .map((part) =>
          part.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
        )
        .join(' / ');

    document.title = `${routeName} | RCA Notely`;
  }, [location]);


  return null;
}

function AppRoutes() {
  const { user } = useSelector((state) => state.auth || {});


  return (
    <>
      <TitleManager />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/chooseRole" element={<ChooseRole/>} />
        </Route>

        {/* If user is not logged in, redirect all other paths to login */}
    
        {user?.role === 'admin' ? (
          <>
              <p>To be implemented later...</p>
          </>
        ) : (
          <>
            {(user?.role === 'teacher' || user?.role === 'student') && (
              <Route path="/" element={<Notely />}>
                <Route index element={<Home />} />
                <Route path="notes" element={<Notes />} />
                <Route path="pastpapers" element={<Pastpapers />} />
                <Route path="saved" element={<Saved />} />
                <Route path="courses/:type/:year" element={<Courses />} />
                <Route path="savednotes" element={<SavedNotes />} />
                <Route path="savedpastpapers" element={<SavedPastpapers />} />
                <Route path="recentNotes" element={<RecentNotes />} />
                <Route path="recentPastPapers" element={<RecentPastPapers />} />
              </Route>
            )}

            {user?.role === 'teacher' ? (
              <Route path="/activity" element={<ActivityLayout />} />
            ) : (
              <Route path="/activity" element={<NoPage />} />
            )}

            {(user?.role === 'teacher' || user?.role === 'student') && (
              <Route path="/developers" element={<Developers />} />
            )}

            <Route path="/chooseRole" element={<ChooseRole />} />

            <Route path="*" element={<NoPage />} />
          </>
        )}
      </Routes>
    </>
  );
}

function AppInit() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user,status } = useSelector((state) => state.auth || {});


  const authPaths = ['/login', '/signup', '/resetpassword', '/chooseRole'];
  const pathname = location.pathname;
  const skipInit = authPaths.some((authPath) => pathname.startsWith(authPath));

  useEffect(() => {
    if (!skipInit) {
      dispatch(checkAuth());
    }
  }, [dispatch, user, skipInit]);
  

  useEffect(() => {
    if (skipInit) return;

    const queryParams = new URLSearchParams(location.search);
    const verified = queryParams.get('verified');

    if (pathname === '/chooseRole') return;

    if (verified) {
      const token = queryParams.get('token');
      if (token) {
        localStorage.setItem('accessToken', token);
        navigate('/', { replace: true });
      } else {
        navigate('/login');
      }
    }
  }, [location.search, navigate, skipInit, pathname]);

  return null;
}

function App() {
    // On app startup
  const params = new URLSearchParams(window.location.search);
  const tokenFromURL = params.get('accessToken');
  if (tokenFromURL) {
    localStorage.setItem('accessToken', tokenFromURL);
    // Optionally clean the URL so the token isn’t visible
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return (
    <Router>
      <AppInit />
      <AppRoutes />
    </Router>
  );
}

export default App;
