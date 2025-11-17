import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './Dashboard.css';

const StudentModal = ({ isOpen, onClose, onSave, student, isEditing, classes }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'Male',
    class: ''
  });

  // Initialize form only when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (isEditing && student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        gender: student.gender || 'Male',
        class: student.class || getDefaultClass()
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'Male',
        class: getDefaultClass()
      });
    }
  }, [isOpen]);

  const getDefaultClass = () => {
    return classes?.find(c => c !== 'All Classes') || '';
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    if (formData.firstName !== (student?.firstName || '')) updatedData.firstName = formData.firstName;
    if (formData.lastName !== (student?.lastName || '')) updatedData.lastName = formData.lastName;
    if (formData.email !== (student?.email || '')) updatedData.email = formData.email;
    if (formData.gender !== (student?.gender || 'Male')) updatedData.gender = formData.gender;
    if (formData.class !== (student?.class || '')) updatedData.class = formData.class;

    if (isEditing && student) {
      try {
        const response = await fetch('http://localhost:666/adminactions/students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            class: student.class,
            email: student.email,
            updates: updatedData
          })
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        onSave({ ...student, ...updatedData });
        onClose();
      } catch (error) {
        console.error('Error updating student:', error);
        alert('Failed to update student. Please try again.');
      }
    } else {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
          <button onClick={onClose} className="modal-close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {['firstName', 'lastName', 'email'].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="form-input"
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="form-select"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Class</label>
            <select
              value={formData.class}
              onChange={(e) => handleChange('class', e.target.value)}
              className="form-select"
              required
            >
              {classes
                .filter(c => c !== 'All Classes')
                .map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {isEditing ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
