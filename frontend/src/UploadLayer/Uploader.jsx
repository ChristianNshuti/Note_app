import { useEffect, useState } from 'react'
import Styles from './Uploader.module.css'
import Select from 'react-select'
import Close from '../assets/close.webp'
import { uploadNoteAndAssessment } from '../features/upload/uploadNotesAssessmentsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../features/notes/getNotesSlice';
import { fetchAssessments } from '../features/notes/getAssessmentsSlice';

function UploadLayer({ toggleUploadbar,toggleUserbarOnSidebar,showUser,showUpload }) { 
  const {uploadStatus,uploadError} = useSelector((state) => state.upload);
  const [fileName, setFileName] = useState()
  const [file, setFile] = useState(null)
  const [year, setYear] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [docType, setDocType] = useState(null)
  const [category, setCategory] = useState('')
  const [term, setTerm] = useState('')
  const [yearDone, setYearDone] = useState('')
  const [description, setDescription] = useState('')
  const [docName, setDocName] = useState('')
  const dispatch = useDispatch()
  const recentOnes = true;

   const courses1 = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Embedded systems', label: 'Embedded systems' },
    { value: 'FoP', label: 'FoP' },
    { value: 'Javascript', label: 'Javascript' },
    { value: 'Networking', label: 'Networking Principles' },
    { value: 'PHP', label: 'PHP' },
    { value: 'Web user interface', label: 'Web user interface' },
    { value: 'Computer Science', label: 'Computer science'}, //doesn't have an image
    { value: 'Database', label: 'Database' },
    { value: 'English', label: 'English' },
    { value: 'Kinyarwanda', label: 'Kinyarwanda' },
    { value: 'Entrepreneurship', label: 'Entreprenuership' },
    { value: 'Citizenship', label: 'Citizenship' }
  ]

  const courses2 = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Embedded systems', label: 'Embedded systems' },
    { value: 'DSA', label: 'DSA' },
    { value: 'Java', label: 'OOP with Java' },
    { value: 'Web3', label: 'Web3' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Computer Science', label: 'Computer science'}, //doesn't have an image
    { value: '3D Models', label: '3D Models' },
    { value: 'Database', label: 'Database' },
    { value: 'English', label: 'English' },
    { value: 'Kinyarwanda', label: 'Kinyarwanda' },
    { value: 'Entrepreneurship', label: 'Entreprenuership' },
    { value: 'Citizenship', label: 'Citizenship' }
  ]

  const courses3 = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Intelligent Robotics', label: 'Intelligent Robotics' },
    { value: 'Devops', label: 'Devops' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Computer Science', label: 'Computer science'}, //doesn't have an image
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'IT Project Monetization', label: 'IT Project Monetization' },
    { value: 'English', label: 'English' },
    { value: 'Kinyarwanda', label: 'Kinyarwanda' },
    { value: 'Entrepreneurship', label: 'Entreprenuership' },
    { value: 'Citizenship', label: 'Citizenship' }
  ]

  const getCourses = () => {
    if (year === '1') return courses1
    if (year === '2') return courses2
    if (year === '3') return courses3
    return []
  }

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      width: '95%',
      maxWidth: '100%',
      height: '1.8rem',
      padding: '0 2.5rem 0 1rem',
      borderRadius: '5px',
      fontSize: '1rem',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      boxShadow: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
      flexShrink: 0,
    }),
    
    valueContainer: (base) => ({
      ...base,
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      flex: 1,
      overflow: 'hidden',
    }),

    singleValue: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    }),

    placeholder: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: '#999',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      maxWidth: '100%',
      flexGrow: 0,
      flexShrink: 1,
      boxSizing: 'border-box',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }),

    indicatorsContainer: (base) => ({
      ...base,
      paddingRight: '1rem',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: 0,
      color: 'gray',
      display: 'flex',
      alignItems: 'center',
    }),

    menu: (base) => ({
      ...base,
      borderRadius: '10px',
      zIndex: 9999,
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
      color: '#333',
      padding: '10px',
    }),

  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!docType || !selectedCourse || !file) {
      alert("Please fill all required fields")
      return
    }

   const formData = new FormData()
    formData.append('type', docType)
    formData.append('userId', '') // Replace with actual user ID logic
    formData.append('name', docName)
    formData.append('grade', year)
    formData.append('lesson', selectedCourse.value)
    formData.append('description', description)
    formData.append('documentName', file.name)
    formData.append('file', file)
    formData.append('category', category)
    formData.append('term', term)
    formData.append('year', yearDone)


    try {
        dispatch(uploadNoteAndAssessment(formData)).unwrap();


    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className={Styles.uploadMain}>
      <div className={Styles.headerForm}>
      <button className={showUser && showUpload ? `${Styles.closeHolder} ${Styles.animateClose}`  : Styles.closeHolder} ><img src={Close} onClick={() => {toggleUploadbar(); toggleUserbarOnSidebar();}} alt="Close" loading="lazy"/></button>
        <h1>Upload new document</h1> 
      </div>

      <form className={Styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name of document"
          required
          className={Styles.inputText}
          onChange={(e) => setDocName(e.target.value)}
        /> 

        <select
          name="type"
          required
          className={Styles.styledSelect}
          onChange={(e) => setDocType(e.target.value)}
        >
          <option value="" disabled selected>Document Type</option>
          <option value="Notes">Notes</option>
          <option value="Assessments">Pastpapers</option>
        </select>

        <select
          name="year"
          required
          className={Styles.styledSelect}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="" disabled selected>Grade</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
        </select>

        {year && (
          <Select
            name="course"
            options={getCourses()}
            className={Styles.selectStyled}
            classNamePrefix="react-select"
            styles={customSelectStyles}
            placeholder="Select Course"
            onChange={(option) => setSelectedCourse(option)}
            menuPortalTarget={document.body}
            menuPlacement="top"
          />
        )}

        <div className={Styles.inputWrapper}>
          <input
            type="file"
            name="file"
            id="customFileInput"
            className={Styles.fileInput}
            onChange={(e) => {
              const selected = e.target.files[0]
              setFile(selected)
              setFileName(selected?.name || 'No file chosen')
            }}
          />
          <label htmlFor="customFileInput" className={Styles.fileLabel}>
            Choose File
          </label>
          <span className={Styles.fileName}>{fileName}</span>
        </div>

        <textarea
          name="description"
          placeholder="Add short description"
          className={Styles.textArea}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {docType === "Assessments" && (
          <>
            <select
              name="category"
              required
              className={Styles.styledSelect}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled selected>Category</option>
              <option value="Examination">Examination</option>
              <option value="CAT">CAT</option>
            </select>

            <select
              name="term"
              required
              className={Styles.styledSelect}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value="" disabled selected>Term</option>
              <option value="1">Term I</option>
              <option value="2">Term II</option>
              <option value="3">Term III</option>
            </select>

            <input
              type="text"
              name="yearDone"
              placeholder="Year done"
              required
              className={Styles.inputText}
              onChange={(e) => setYearDone(e.target.value)}
            />
          </>
        )}

        <button type="submit" className={Styles.submitBtn}>{uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  ) 
}

export default UploadLayer