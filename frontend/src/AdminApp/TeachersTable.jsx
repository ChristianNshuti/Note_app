import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './Dashboard.css';

const TeachersTable = ({ teachers = [], onEdit, onAdd, onDelete }) => {
  return (
    <div className="data-table">
      <div className="table-container">
        {teachers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.firstName || 'N/A'}</td>
                  <td>{teacher.lastName || 'N/A'}</td>
                  <td>{teacher.email || 'N/A'}</td>
                  <td>{teacher.phone || 'N/A'}</td>
                  <td>
                    {teacher.courses && teacher.courses.length > 0
                      ? teacher.courses.join(', ')
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      onClick={() => onEdit(teacher)}
                      className="action-button action-edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(teacher)}
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
            <p>No teachers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersTable;