import Styles from './Courses.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setYear } from '../features/notes/courseSetSlice';


export default function Courses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { type,year } = useParams();
  const numericYear = parseInt(year); // or use `+year`


  // Unified course list for both notes and pastpapers
  const allCourses = {
    1: [
      'Mathematics',
      'Physics',
      'Computer Science',
      'English',
      'Kinyarwanda',
      'Entrepreneurship',
      'Citizenship',
      'FoP',
      'Javascript',
      'Networking',
      'PHP',
      'Web user interface',
      'Database',
      'Embedded systems',
    ],
    2: [
      'Mathematics',
      'Physics',
      'Computer Science',
      'English',
      'Kinyarwanda',
      'Entrepreneurship',
      'Citizenship',
      'DSA',
      'Java',
      'Web3',
      'Networking',
      'Software Engineering',
      '3D Models',
      'Database',
      'Embedded systems',
    ],
    3: [
      'Mathematics',
      'Physics',
      'Computer Science',
      'English',
      'Kinyarwanda',
      'Entrepreneurship',
      'Citizenship',
      'Intelligent Robotics',
      'Devops',
      'Cybersecurity',
      'Machine Learning',
      'IT Project Monetization',
    ],
  };

  const courseList = allCourses[parseInt(year)] || [];

  const handleNavigateToCourse = (course) => {

      dispatch(setCourse(course));
      dispatch(setYear(numericYear));
      localStorage.setItem("selectedCourse", course);
      localStorage.setItem("selectedYear", year);


    if (type === 'notes') {
      navigate('/notes');
    } else if (type === 'pastpapers') {
      navigate('/pastpapers');
    }
  };

  return (
    <div className={Styles.coursesMain}>
      <h2 className={Styles.selectedYear}>
        &nbsp; Year {year} {type === 'notes' ? 'Notes' : 'Pastpapers'}
      </h2>
      <br />

      <div className={Styles.courses}>
        {courseList.length > 0 ? (
          courseList.map((course, index) => (
            <div
              key={index}
              className={Styles.contributionClass}
              onClick={() => handleNavigateToCourse(course)}
            >
              <p>{course}</p>
            </div>
          ))
        ) : (
          <p className={Styles.emptyState}>No courses found for this year.</p>
        )}
      </div>
    </div>
  );
}
