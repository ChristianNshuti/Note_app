import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './Dashboard.css';

const TeacherModal = ({ isOpen, onClose, onSave, teacher, isEditing }) => {
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    courses: []
  });

  useEffect(() => {
    if (isEditing && teacher) {
      setFormData({
        id: teacher.id || '',
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        courses: teacher.courses || []
      });
    } else {
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        courses: []
      });
    }
  }, [isEditing, teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoursesChange = (e) => {
    const courses = e.target.value.split(',').map(c => c.trim()).filter(c => c);
    setFormData(prev => ({ ...prev, courses }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const teacherData = {
      id: formData.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      courses: formData.courses
    };
    onSave(teacherData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Teacher' : 'Add Teacher'}</h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Courses (comma-separated)</label>
            <input
              type="text"
              name="courses"
              value={formData.courses.join(', ')}
              onChange={handleCoursesChange}
              className="form-input"
              placeholder="e.g., Mathematics, Science"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;