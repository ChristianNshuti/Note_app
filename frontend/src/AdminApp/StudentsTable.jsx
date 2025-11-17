import React from 'react';
import { Mail, User, Edit, Plus, Trash2 } from 'lucide-react';
import './Dashboard.css';

const StudentsTable = ({ students = [], activeClass, onEdit, onAdd, onDelete }) => {
  // Filter students based on activeClass
  const currentStudents = activeClass === 'All Classes' 
    ? students
    : students.filter(student => student.class === activeClass);



  return (
    <div className="data-table">
      <div className="table-container">
        {currentStudents.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr key={`${student.email}-${index}`}>
                  <td className="name-cell">
                    <div className="student-avatar">
                      {student.firstName?.charAt(0) || '?'}
                    </div>
                    {student.firstName || 'N/A'}
                  </td>
                  <td>{student.lastName || 'N/A'}</td>
                  <td>
                    <a href={`mailto:${student.email}`} className="email-link">
                      <Mail size={14} />
                      {student.email}
                    </a>
                  </td>
                  <td>
                    <span className={`gender-badge ${student.gender?.toLowerCase() || 'unknown'}`}>
                      {student.gender || 'Unknown'}
                    </span>
                  </td>
                  <td>{student.class || 'N/A'}</td>
                  <td>
                    <button 
                      onClick={() => onEdit(student, student.class)}
                      className="action-button action-edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(student)}
                      className="action-button action-delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No students found{activeClass !== 'All Classes' ? ` in ${activeClass}` : ''}</p>
            <p>Available classes: {[...new Set(students.map(student => student.class))].join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsTable;