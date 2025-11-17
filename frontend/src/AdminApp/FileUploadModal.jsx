import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const FileUploadModal = ({ isOpen, onClose, onUpload, classes, mode = 'create' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('students');
  const [selectedClass, setSelectedClass] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleUpload = () => {
    if (!file) return;
    if (mode === 'update' && !selectedClass) return; // Ensure a class is selected in update mode
    onUpload(file, mode === 'update' ? selectedClass : null);
    setFile(null);
    setFileType('students');
    setSelectedClass('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'update' ? 'Update Class with New File' : 'Upload Data'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Select the type of data to upload:
          </p>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="students">Student Data (all_students.xlsx)</option>
            {/* Optionally add admin type if needed later */}
          </select>

          {mode === 'update' && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Select the class to update:
              </p>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">-- Select a Class --</option>
                {classes.filter(cls => cls !== 'All Classes').map(cls => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-2">
            Upload an Excel file. {mode === 'create' ? 'Each sheet represents a class.' : 'This will replace the selected class data.'}
          </p>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono">
            {fileType === 'students' ? (
              'First Name,Last Name,Email,Gender'
            ) : (
              ''
            )}
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <FileText size={20} className="text-blue-600" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          ) : (
            <>
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">
                Drag and drop your Excel file here, or
              </p>
              <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                browse to choose a file
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleChange}
                />
              </label>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || (mode === 'update' && !selectedClass)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'update' ? 'Update' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;