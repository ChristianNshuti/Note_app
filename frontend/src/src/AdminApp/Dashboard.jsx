import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, GraduationCap, ChevronDown, Plus, Upload, Search, FileText, X, User as UserIcon, Trash2, AlertTriangle } from 'lucide-react';
import StudentsTable from './StudentsTable';
import TeachersTable from './TeachersTable';
import StudentModal from './StudentModal';
import TeacherModal from './TeacherModal';
import Notely from '../assets/Notely.webp';
import Profile from '../assets/profile.webp';
import FileUploadModal from './FileUploadModal';
import Settings from '../Settings/Settings';
import './Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const Dashboard = () => {
  const [activeView, setActiveView] = useState(null);
  const [activeClass, setActiveClass] = useState('All Classes');
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceFile, setReplaceFile] = useState(null);
  const [showReplaceConfirmModal, setShowReplaceConfirmModal] = useState(false);
  const [showColumnMismatchModal, setShowColumnMismatchModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [availableClasses, setAvailableClasses] = useState(['All Classes']);
  const [classStudentCounts, setClassStudentCounts] = useState({});

  const { user } = useSelector((state) => state.auth);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:666/adminactions/students');
      if (!res.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await res.json();
      const sheetNames = Object.keys(data);
      const classesList = ['All Classes', ...sheetNames];

      const counts = {};
      sheetNames.forEach(className => {
        counts[className] = data[className].length;
      });
      counts['All Classes'] = sheetNames.reduce((total, className) => total + data[className].length, 0);

      const allStudents = sheetNames.flatMap(className =>
        data[className].map(student => ({
          ...student,
          class: className,
          id: `${className}-${student.email}`
        }))
      );

      // Batch state updates to minimize re-renders
      setAvailableClasses(classesList);
      setClassStudentCounts(counts);
      setStudents(allStudents);
      setActiveClass(sheetNames[0] || 'All Classes');
    } catch (err) {
      setErrorMessage('Failed to fetch students. Please try again.');
      setShowErrorNotification(true);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:666/adminactions/teachers');
      if (!res.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      setErrorMessage('Failed to fetch teachers. Please try again.');
      setShowErrorNotification(true);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, [fetchStudents, fetchTeachers]);

  const handleCardClick = useCallback((type) => {
    setActiveView(prev => prev === type ? null : type);
  }, []);

  const handleToolAction = useCallback((action) => {
    setShowToolsDropdown(false);
    setErrorMessage('');
    setShowErrorNotification(false);
    switch (action) {
      case 'add-student':
        setEditingStudent(null);
        setStudentModalOpen(true);
        break;
      case 'add-teacher':
        setEditingTeacher(null);
        setTeacherModalOpen(true);
        break;
      case 'replace-class':
        if (!activeClass || activeClass === 'All Classes') {
          setErrorMessage('Please select a specific class to replace.');
          setShowErrorNotification(true);
          return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            setReplaceFile(file);
            setShowReplaceConfirmModal(true);
          }
        };
        input.click();
        break;
      case 'remove-class':
        if (activeClass !== 'All Classes') {
          setItemToDelete({ className: activeClass, isClass: true });
          setShowDeleteConfirm(true);
        } else {
          setErrorMessage('Cannot remove "All Classes". Please select a specific class.');
          setShowErrorNotification(true);
        }
        break;
      default:
        break;
    }
  }, [activeClass]);

  const handleEditStudent = useCallback((student) => {
    setEditingStudent(student);
    setStudentModalOpen(true);
  }, []);

  const handleAddStudent = useCallback(() => {
    setEditingStudent(null);
    setStudentModalOpen(true);
  }, []);

  const handleSaveStudent = useCallback(async (studentData) => {
    const url = editingStudent
      ? 'http://localhost:666/adminactions/students'
      : 'http://localhost:666/adminactions/add-student';
    const method = editingStudent ? 'PUT' : 'POST';
    const body = editingStudent
      ? {
          class: studentData.class,
          email: editingStudent.email,
          updates: {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            gender: studentData.gender
          }
        }
      : {
          class: studentData.class,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          gender: studentData.gender
        };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save student');
      }
      await fetchStudents();
      setStudentModalOpen(false);
      setEditingStudent(null);
      setErrorMessage('');
      setShowErrorNotification(false);
    } catch (err) {
      setErrorMessage(err.message);
      setShowErrorNotification(true);
    }
  }, [editingStudent, fetchStudents]);

  const handleEditTeacher = useCallback((teacher) => {
    setEditingTeacher(teacher);
    setTeacherModalOpen(true);
  }, []);

  const handleAddTeacher = useCallback(() => {
    setEditingTeacher(null);
    setTeacherModalOpen(true);
  }, []);

  const handleSaveTeacher = useCallback(async (teacherData) => {
    const url = editingTeacher
      ? 'http://localhost:666/adminactions/teachers'
      : 'http://localhost:666/adminactions/add-teacher';
    const method = editingTeacher ? 'PUT' : 'POST';
    const body = editingTeacher
      ? {
          email: editingTeacher.email,
          updates: {
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            email: teacherData.email,
            phone: teacherData.phone,
            courses: teacherData.courses
          }
        }
      : {
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          email: teacherData.email,
          phone: teacherData.phone,
          courses: teacherData.courses
        };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save teacher');
      }
      await fetchTeachers();
      setTeacherModalOpen(false);
      setEditingTeacher(null);
      setErrorMessage('');
      setShowErrorNotification(false);
    } catch (err) {
      setErrorMessage(err.message);
      setShowErrorNotification(true);
    }
  }, [editingTeacher, fetchTeachers]);

  const handleReplaceClass = useCallback(async () => {
    if (!replaceFile || !activeClass || activeClass === 'All Classes') {
      setErrorMessage('Please select a specific class and a valid file to replace.');
      setShowErrorNotification(true);
      setShowReplaceConfirmModal(true);
      setReplaceFile(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', replaceFile);

    try {
      const res = await fetch('http://localhost:666/adminactions/replace-class', {
        method: 'POST',
        headers: { 'x-class-name': activeClass },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to replace class');
      }
      await fetchStudents();
      setShowReplaceConfirmModal(false);
      setReplaceFile(null);
      setErrorMessage('');
      setShowErrorNotification(false);
    } catch (err) {
      const errorMsg = err.message;
      const requiredColumns = ['First Name', 'Last Name', 'Email', 'Gender'];
      const currentColumnsMatch = errorMsg.match(/File column mismatch: Missing required columns (.*)/);
      let customError = 'Error replacing class.';
      if (currentColumnsMatch) {
        const missingColumns = currentColumnsMatch[1].split(', ');
        const presentColumns = requiredColumns.filter(col => !missingColumns.includes(col));
        customError = `You have these columns: ${presentColumns.join(', ')}. But to replace this class, you must have: ${requiredColumns.join(', ')}.`;
      }
      setErrorMessage(customError);
      setShowReplaceConfirmModal(false);
      setReplaceFile(null);
      setShowColumnMismatchModal(true);
    }
  }, [replaceFile, activeClass, fetchStudents]);

  const handleAddClass = useCallback(async () => {
    if (!newClassName) {
      setErrorMessage('Class name is required.');
      setShowErrorNotification(true);
      return;
    }

    try {
      const res = await fetch('http://localhost:666/adminactions/add-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: newClassName })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add class');
      }
      await fetchStudents();
      setShowAddClassModal(false);
      setNewClassName('');
      setErrorMessage('');
      setShowErrorNotification(false);
    } catch (err) {
      setErrorMessage(err.message);
      setShowErrorNotification(true);
    }
  }, [newClassName, fetchStudents]);

  useEffect(() => {
    if (showErrorNotification) {
      const timer = setTimeout(() => {
        setShowErrorNotification(false);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorNotification]);

  const handleDeleteItem = useCallback((item, isTeacher) => {
    setItemToDelete({ item, isTeacher });
    setShowDeleteConfirm(true);
  }, []);

  const confirmDeleteItem = useCallback(async () => {
    if (!itemToDelete) return;

    if (itemToDelete.isTeacher) {
      try {
        const res = await fetch('http://localhost:666/adminactions/teachers', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: itemToDelete.item.email })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to delete teacher');
        }
        await fetchTeachers();
      } catch (err) {
        setErrorMessage(err.message);
        setShowErrorNotification(true);
      }
    } else if (itemToDelete.isClass) {
      try {
        const res = await fetch('http://localhost:666/adminactions/delete-class', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ className: itemToDelete.className })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to delete class');
        }
        await fetchStudents();
        setActiveClass('All Classes');
      } catch (err) {
        setErrorMessage(err.message);
        setShowErrorNotification(true);
      }
    } else {
      try {
        const res = await fetch('http://localhost:666/adminactions/students', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            class: itemToDelete.item.class,
            email: itemToDelete.item.email
          })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to delete student');
        }
        await fetchStudents();
      } catch (err) {
        setErrorMessage(err.message);
        setShowErrorNotification(true);
      }
    }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setErrorMessage('');
  }, [itemToDelete, fetchStudents, fetchTeachers]);

  const cancelDeleteItem = useCallback(() => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setErrorMessage('');
  }, []);

  const closeColumnMismatchModal = useCallback(() => {
    setShowColumnMismatchModal(false);
    setErrorMessage('');
  }, []);

  const debouncedSetSearchQuery = useCallback(debounce((value) => {
    setSearchQuery(value);
  }, 300), []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch = !searchQuery || fullName.includes(searchLower) || student.email.toLowerCase().includes(searchLower);
      const matchesClass = activeClass === 'All Classes' || student.class === activeClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, activeClass]);

  return (
    <div className='scrollable-container'>
      <div className="dashboard">
        <div className="dashboard-header">
          {settingsVisible && (
            <div className='settings-holder'>
              <Settings />
            </div>
          )}
          <div className="header-actions">
            <img src={Notely} className="notely-image" alt="Notely logo" />
            <h1>Notely Admin Console</h1>
          </div>
          <div
            style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'rgb(35,35,125)' }}
            onClick={() => setSettingsVisible(!settingsVisible)}
            className="profileNameHolder"
          >
            <p style={{ margin: 0 }}>
              {user?.lastname.split(" ").slice(-1)[0] || 'Guest'}
            </p>
            <img
              src={Profile}
              className="profilePic"
              alt="profile"
              loading="lazy"
              style={{ marginLeft: '8px' }}
            />
          </div>
        </div>

        {showErrorNotification && errorMessage && (
          <div className="error-notification" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        {activeView === 'students' && (
          <div className="class-navigation">
            {availableClasses.map((className) => (
              <button
                key={className}
                className={`class-button ${activeClass === className ? 'active' : ''}`}
                onClick={() => setActiveClass(className)}
              >
                {className}
              </button>
            ))}
          </div>
        )}

        <div className="summary-cards">
          <div className={`summary-card ${activeView === 'students' ? 'active' : ''}`} onClick={() => handleCardClick('students')}>
            <div className="card-icon"><GraduationCap size={32} /></div>
            <div className="card-content">
              <h3>Students</h3>
              <div className="card-number">{students.length}</div>
              <p>Total enrolled students across all classes</p>
            </div>
          </div>
          <div className={`summary-card ${activeView === 'teachers' ? 'active' : ''}`} onClick={() => handleCardClick('teachers')}>
            <div className="card-icon"><UserIcon size={32} /></div>
            <div className="card-content">
              <h3>Teachers</h3>
              <div className="card-number">{teachers.length}</div>
              <p>Active teaching staff members</p>
            </div>
          </div>
        </div>

        {activeView === 'students' && (
          <div className="table-section">
            <div className="table-header">
              <h2><GraduationCap size={20} /> Students ({classStudentCounts[activeClass] || filteredStudents.length})</h2>
              <div className="header-actions">
                <div className="search-bar">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => debouncedSetSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="tools-dropdown">
                  <button className="tools-button" onClick={() => setShowToolsDropdown(!showToolsDropdown)}>
                    Tools <ChevronDown size={16} />
                  </button>
                  {showToolsDropdown && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleToolAction('add-student')}><Plus size={16} /> Add Student</button>
                      <button onClick={() => handleToolAction('replace-class')}><Upload size={16} /> Replace Class</button>
                      <button onClick={() => handleToolAction('remove-class')}><Trash2 size={16} /> Remove This Class</button>
                    </div>
                  )}
                </div>
                <button
                  className="add-button"
                  onClick={() => setShowAddClassModal(true)}
                >
                  Add
                </button>
              </div>
            </div>
            <StudentsTable
              students={filteredStudents}
              activeClass={activeClass}
              onEdit={handleEditStudent}
              onAdd={handleAddStudent}
              onDelete={(student) => handleDeleteItem(student, false)}
            />
          </div>
        )}

        {activeView === 'teachers' && (
          <div className="table-section">
            <div className="table-header">
              <h2><UserIcon size={20} /> Teachers ({teachers.length})</h2>
              <div className="header-actions">
                <div className="tools-dropdown">
                  <button className="tools-button" onClick={() => setShowToolsDropdown(!showToolsDropdown)}>
                    Tools <ChevronDown size={16} />
                  </button>
                  {showToolsDropdown && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleToolAction('add-teacher')}><Plus size={16} /> Add Teacher</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <TeachersTable
              teachers={teachers}
              onEdit={handleEditTeacher}
              onAdd={handleAddTeacher}
              onDelete={(teacher) => handleDeleteItem(teacher, true)}
            />
          </div>
        )}

        <StudentModal
          isOpen={studentModalOpen}
          onClose={() => {
            setStudentModalOpen(false);
            setEditingStudent(null);
          }}
          onSave={handleSaveStudent}
          student={editingStudent}
          isEditing={!!editingStudent}
          classes={availableClasses.filter(cls => cls !== 'All Classes')}
        />

        <TeacherModal
          isOpen={teacherModalOpen}
          onClose={() => {
            setTeacherModalOpen(false);
            setEditingTeacher(null);
          }}
          onSave={handleSaveTeacher}
          teacher={editingTeacher}
          isEditing={!!editingTeacher}
        />

        {showReplaceConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Replace Class Data</h2>
                <button className="modal-close-button" onClick={() => {
                  setShowReplaceConfirmModal(false);
                  setReplaceFile(null);
                  setErrorMessage('');
                  setShowErrorNotification(false);
                }}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  You are about to replace the data for class <strong>{activeClass}</strong> with the data from the selected file.
                </p>
                {replaceFile && (
                  <div className="file-info">
                    <FileText size={20} />
                    <span>{replaceFile.name}</span>
                  </div>
                )}
                {activeClass === 'All Classes' && (
                  <p className="error-text">Please select a specific class to replace.</p>
                )}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowReplaceConfirmModal(false);
                      setReplaceFile(null);
                      setErrorMessage('');
                      setShowErrorNotification(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="submit-button"
                    onClick={handleReplaceClass}
                    disabled={activeClass === 'All Classes' || !replaceFile}
                  >
                    Replace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showColumnMismatchModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title-container">
                  <AlertTriangle size={24} className="error-icon" />
                  <h2 className="error-title">Column Mismatch</h2>
                </div>
                <button className="modal-close-button" onClick={closeColumnMismatchModal}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {showAddClassModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add New Class</h2>
                <button className="modal-close-button" onClick={() => {
                  setShowAddClassModal(false);
                  setNewClassName('');
                  setErrorMessage('');
                  setShowErrorNotification(false);
                }}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <p>Enter a class name (e.g., Y1A, Y2B, Y3C).</p>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value.toUpperCase())}
                  placeholder="e.g., Y1A"
                  className="modal-input"
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowAddClassModal(false);
                      setNewClassName('');
                      setErrorMessage('');
                      setShowErrorNotification(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="submit-button"
                    onClick={handleAddClass}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && itemToDelete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Confirm Delete</h2>
                <button className="modal-close-button" onClick={cancelDeleteItem}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                {errorMessage && (
                  <div className="error-message" role="alert">
                    <span>{errorMessage}</span>
                  </div>
                )}
                <p>
                  Are you sure you want to delete the {itemToDelete.isTeacher ? 'teacher' : itemToDelete.isClass ? 'class' : 'student'} <strong>{itemToDelete.isTeacher ? `${itemToDelete.item.firstName} ${itemToDelete.item.lastName}` : itemToDelete.isClass ? itemToDelete.className : `${itemToDelete.item.firstName} ${itemToDelete.item.lastName}`}</strong>{!itemToDelete.isTeacher && !itemToDelete.isClass ? ` from class <strong>${itemToDelete.item.class}</strong>` : ''}?
                </p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={cancelDeleteItem}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="submit-button"
                    onClick={confirmDeleteItem}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;