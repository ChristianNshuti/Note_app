import { useState, useRef, useEffect, useMemo } from 'react'
import Styles from './Activity.module.css'
import Search from '../assets/search.webp'
import NoteImage from '../assets/cybersecurity.webp'
import Timestamp from '../assets/clock.webp'
import Save from '../assets/save.webp'
import Update from '../assets/update.webp'
import Delete from '../assets/delete.webp'
import { deleteAssessment,deleteNote } from '../features/delete/deleteSlice'
import { useDispatch,useSelector } from 'react-redux';
import { fetchNotes } from '../features/notes/getNotesSlice'
import { fetchAssessments } from '../features/notes/getAssessmentsSlice'
import { checkAuth } from '../features/auth/authSlice'
import { updateAssessment,updateNote } from '../features/update/updateSlice'
import { parseISO, isToday, isThisWeek, format,differenceInCalendarWeeks } from 'date-fns';




export default function Activity() {

    const [showModal, setShowModal] = useState(false)
    const [isTruncated, setIsTruncated] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [activeFilter, setActiveFilter] = useState('All uploads')
    const [activeCourse, setActiveCourse] = useState('All courses')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [newDescription, setNewDescription] = useState('')
    const [isHeaderVisible, setIsHeaderVisible] = useState(true) // New state for header visibility
    const descRef = useRef(null)
    const searchRef = useRef(null)
    const lastScrollY = useRef(0) // Track last scroll position

    //integration definitions
    const recentOnes = true; //because the route returns user uploads when we send recentOnes set to true
    const [viewAllUploads,setViewAllUploads] = useState(true); // to switch between alluploads,notes and pastpapers
    const [viewNotes,setViewNotes] = useState(false);
    const [viewPastPapers,setViewPastPapers] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const {userNoteUploads,notesStatus,notesError} = useSelector((state)=> state.notes);
    const {userAssessmentsUploads,assessmentsStatus,assessmentsError} = useSelector((state) => state.assessments);
    const {updateError,updateStatus} = useSelector((state) => state.update);
    const {deleteError,deleteStatus} = useSelector((state) => state.delete);
    const {uploadStatus} = useSelector((state)=>state.upload);
    const [subject,setTeacherSubject] = useState('Any');
    const [id,setId] = useState(null);
    const [type,setType] = useState('');
    const [fileName,setFileName] = useState('');
    const [fileUrl,setFileUrl] = useState('');
    const [searchTerm,setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const [currentPageThisWeek, setCurrentPageThisWeek] = useState(1);
    const [currentPageLastWeek, setCurrentPageLastWeek] = useState(1);
    const [currentPageOlder, setCurrentPageOlder] = useState(1);
    const [modalContent, setModalContent] = useState({ title: '', description: '' });

    useEffect(() => {
        setCurrentPageThisWeek(1);
        setCurrentPageLastWeek(1);
        setCurrentPageOlder(1);
    }, [searchTerm, viewAllUploads, viewNotes, viewPastPapers]);

    const handleMode = (all, notes, past) => {
        setViewAllUploads(all);
        setViewNotes(notes);
        setViewPastPapers(past);
    };

    const deleteNA = async (id,type,fileName,subject) => {
    try {
        if (type === "Assessments") {
            await dispatch(deleteAssessment({ AssessmentId: id,fileName })).unwrap();
        } else {
            await dispatch(deleteNote({ noteId: id,fileName })).unwrap();
        }

        // Refetch after deletion
        dispatch(fetchNotes({ year: 'Any', subject, recentOnes }));
        dispatch(fetchAssessments({ grade: 'Any', subject, recentOnes }));

        
    } catch (error) {
        console.error("Deletion failed", error);
    }
    }

    const updateNA = async (id,fileUrl,newDescription,type,subject) => {
    try {
        if (!fileUrl || !id || !type) return;
        const file = fileUrl instanceof File ? fileUrl : null;

        if (type === 'Notes') {
            await dispatch(updateNote({ noteId: id, file, description : newDescription }));
        } else {
            await dispatch(updateAssessment({ AssessmentId: id, file, description : newDescription }));
        }

        // Refetch after update
        dispatch(fetchNotes({ year: 'Any', subject, recentOnes }));
        dispatch(fetchAssessments({ grade: 'Any', subject, recentOnes }));
    } catch (error) {
        console.error("Update Failed", error);
        console.log(updateError);
    }
    }

    const handleShowModal = (title,description) => {
        setModalContent({ title, description });
        setShowModal(true);
    };

    useEffect(()=>{
        if (!user) dispatch(checkAuth());
        dispatch(fetchNotes({year:'Any',subject,recentOnes}));
        dispatch(fetchAssessments({grade:'Any',subject,recentOnes}));
    },[dispatch,subject,uploadStatus]);


        // Inside the component, so it re-computes on each render
    const courses = Array.isArray(user?.courses) ? user.courses : [];



    const filteredNotes = subject === 'Any' 
        ? userNoteUploads || [] 
        : (userNoteUploads || []).filter(note => note.lesson === subject);

    const filteredAssessments = subject === 'Any'                           // Added filteredNotes and filteredAssessments logic
        ? userAssessmentsUploads || []
        : (userAssessmentsUploads || []).filter(assessment => assessment.lesson === subject);


    const filteredUploads = [
        ...(viewNotes ? filteredNotes : []),
        ...(viewPastPapers ? filteredAssessments : []),
        ...(viewAllUploads ? [...filteredNotes, ...filteredAssessments] : [])
    ]

    const searchedUploads = filteredUploads.filter((item) => {
    const search = searchTerm.toLowerCase();
    // You can filter by description, lesson, or other fields
    return (
        item.description.toLowerCase().includes(search) ||
        item.noteName?.toLowerCase().includes(search) ||
        item.assessmentName?.toLowerCase().includes(search)
    );
    });


const thisWeekUploads = useMemo(() =>
  searchedUploads.filter(item =>
    isThisWeek(parseISO(item.createdAt))
  ), [searchedUploads]);

const lastWeekUploads = useMemo(() =>
  searchedUploads.filter(item => {
    const date = parseISO(item.createdAt);
    const now = new Date();
    const isThisWeekUpload = isThisWeek(date, { weekStartsOn: 1 });
    const weeksAgo = differenceInCalendarWeeks(now, date, { weekStartsOn: 1 });

    return weeksAgo === 1 && !isThisWeekUpload;
  }), [searchedUploads]);

const olderUploads = useMemo(() =>
  searchedUploads.filter(item => {
    const date = parseISO(item.createdAt);
    const now = new Date();
    const weeksAgo = differenceInCalendarWeeks(now, date, { weekStartsOn: 1 });

    return weeksAgo > 1;
  }), [searchedUploads]);

const thisWeekPerPage = 3;
const paginatedThisWeekUploads = useMemo(() => {
  const start = (currentPageThisWeek - 1) * thisWeekPerPage;
  const end = start + thisWeekPerPage;
  return thisWeekUploads.slice(start, end);
}, [thisWeekUploads, currentPageThisWeek]);

const lastWeekPerPage = 3;
const paginatedLastWeekUploads = useMemo(() => {
  const start = (currentPageLastWeek - 1) * lastWeekPerPage;
  const end = start + lastWeekPerPage;
  return lastWeekUploads.slice(start, end);
}, [lastWeekUploads, currentPageLastWeek]);

const olderPerPage = 3;
const paginatedOlderUploads = useMemo(() => {
  const start = (currentPageOlder - 1) * olderPerPage;
  const end = start + olderPerPage;
  return olderUploads.slice(start, end);
}, [olderUploads, currentPageOlder]);

const uploadsPerPage = 3;

const totalPagesThisWeek = Math.ceil(thisWeekUploads.length / uploadsPerPage);
const totalPagesLastWeek = Math.ceil(lastWeekUploads.length / uploadsPerPage);
const totalPagesOlder = Math.ceil(olderUploads.length / uploadsPerPage);

    useEffect(() => {
    if (paginatedThisWeekUploads.length === 0 && currentPageThisWeek > 1) {
        setCurrentPageThisWeek(currentPageThisWeek - 1);
    }
    }, [paginatedThisWeekUploads, currentPageThisWeek]);

    useEffect(() => {
    if (paginatedLastWeekUploads.length === 0 && currentPageLastWeek > 1) {
        setCurrentPageLastWeek(currentPageLastWeek - 1);
    }
    }, [paginatedLastWeekUploads, currentPageLastWeek]);

    useEffect(() => {
    if (paginatedOlderUploads.length === 0 && currentPageOlder > 1) {
        setCurrentPageOlder(currentPageOlder - 1);
    }
    }, [paginatedOlderUploads, currentPageOlder]);

    

    // Existing useEffect for text truncation
    useEffect(() => {
        const el = descRef.current
        if (el && el.scrollWidth > el.clientWidth) {
            setIsTruncated(true)
        }
    }, [])

    // Existing useEffect for search click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearching(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // New useEffect for scroll handling
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY <= 0) {
                // At the top, always show header
                setIsHeaderVisible(true)
            } else if (currentScrollY > lastScrollY.current) {
                // Scrolling down, show header
                setIsHeaderVisible(true)
            } else {
                // Scrolling up, hide header
                setIsHeaderVisible(false)
            }

            lastScrollY.current = currentScrollY // Update last scroll position
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleClick = () => {
        setIsSearching(true)
    }

    const handleDeleteConfirm = () => {
        setShowDeleteConfirm(true)
    }

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false)
    }

    const handleDelete = () => {
        setShowDeleteConfirm(false);
        deleteNA(id,type,fileName)
    }

    const handleUpdateClick = () => {
        setShowUpdateModal(true)
    }

    const handleUpdateCancel = () => {
        setShowUpdateModal(false)
        setNewDescription('')
    }

    const handleUpdateSubmit = (id,type,newDescription,fileUrl) => {
        updateNA(id,fileUrl,newDescription,type)
        setShowUpdateModal(false)
        setNewDescription('')
    }

    
    return (
        <div className={Styles.activityMainDiv}>
            <div className={Styles.activityMain}>
                <h1 className={`${Styles.h1} ${isHeaderVisible ? Styles.visible : Styles.hidden}`}>
                    Activity
                </h1>
                <div className={Styles.contentHolder}>
                    <div className={Styles.filtersDiv}>
                        <div className={Styles.filterOptions}>
                            {['All uploads', 'Notes', 'Pastpapers'].map((filter) => (
                                <p
                                    key={filter}
                                    onClick={() => {
                                        setActiveFilter(filter);
                                        if (filter === "All uploads") handleMode(true, false, false);
                                        else if (filter === "Notes") handleMode(false, true, false);
                                        else handleMode(false, false, true);
                                        }}

                                    className={`${Styles.filterOption} ${activeFilter === filter ? Styles.activeFilter : ''}`}
                                >
                                    {filter}
                                </p>
                            ))}
                        </div>
                        <div
                            ref={searchRef}
                            onClick={!isSearching ? handleClick : undefined}
                            className={Styles.searchContainer}
                        >
                            <img src={Search} alt="search icon" className={Styles.searchIcon} />
                            {!isSearching ? (
                                <p className={Styles.searchText}>Search keyword</p>
                            ) : (
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Type to search..."
                                    className={Styles.searchInput}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                    {([...paginatedThisWeekUploads,...paginatedLastWeekUploads,...paginatedOlderUploads].length > 0) ? (//Added searchedUploads.length instead of what was there!
                    <div className={Styles.courseFilters}>
                        {courses.length > 0 ? (
                        [...courses].map((course) => (
                            <div
                                key={course}
                                className={`${Styles.courseOption} ${activeCourse === course ? Styles.activeCourse : ''}`}
                                onClick={() => {setActiveCourse(course); setTeacherSubject(course)}}
                            >
                                {course}
                            </div>
                        ))) : (
                            "" //Teacher has no courses
                        )}
                    </div> 
                    ) : (
                        <p className={Styles.nothingToShow}>Nothing uploaded yet!</p>
                        )}
                        </div>

                    {paginatedThisWeekUploads.length > 0 ?  (
                    <div className={Styles.elementsNow}>
                        <h4>This Week</h4>

                        {paginatedThisWeekUploads.map((thisWeekUpload,index) => (








                        <div className={Styles.mainDocument} key={index} >
                            <div className={Styles.docStuffs}>
                                <div className={Styles.imageHolder}>
                                    <img src={viewNotes === true ? `../src/assets/noteicons/${thisWeekUpload.lesson.toLowerCase().replace(/\s+/g, '')}.webp` : (viewAllUploads && thisWeekUpload.type === 'Notes') ? `../src/assets/noteicons/${thisWeekUpload.lesson.toLowerCase().replace(/\s+/g, '')}.webp` : NoteImage } alt="note" />
                                </div>
                                <div className={Styles.textSection}>
                                    <h3>{thisWeekUpload.noteName || thisWeekUpload.assessmentName}</h3>
                                    <div>
                                        

                                             <p className={Styles.description}>
                                            {thisWeekUpload.description.length <= 50
                                                ? thisWeekUpload.description
                                                : `${thisWeekUpload.description.slice(0, 50)}...`}
                                            </p>


                                            {thisWeekUpload.description.length > 50 && (
                                                <button className={Styles.readMoreBtn} onClick={
                                                    () => handleShowModal(
                                                        thisWeekUpload.noteName || thisWeekUpload.assessmentName,
                                                        thisWeekUpload.description
                                                    )
                                                }
                                                >
                                                    Read More
                                                </button>
                                            )}



                                    </div>
                                </div>
                            </div>
                            <div className={Styles.timestampDiv}>
                                <img src={Timestamp} />
                                <div>
                                    <p>{format(parseISO(thisWeekUpload.createdAt), 'dd MMM, yyyy')}</p>
                                    <p>{format(parseISO(thisWeekUpload.createdAt), 'hh:mm aa')}</p> 
                                </div>
                            </div>
                            <div className={Styles.activityDiv}>
                                <button data-tooltip="Update" onClick={() => {handleUpdateClick(),setId(thisWeekUpload._id),setType(thisWeekUpload.type)}}><img src={Update} alt="Update" /></button>
                                <button data-tooltip="Delete" onClick={() => {handleDeleteConfirm(),setId(thisWeekUpload._id),setType(thisWeekUpload.type),setFileName(thisWeekUpload.publicId)}}><img src={Delete} alt="Delete" /></button>
                            </div>
                        </div>

                                                                ))}
                    </div>
 

                                            ) : (
                                        ""
                            )}

                        {paginatedThisWeekUploads.length > 0 && (
                        <div className={Styles.pagination}>
                            <button onClick={() => setCurrentPageThisWeek(p => Math.max(1, p - 1))} disabled={currentPageThisWeek === 1}>Previous</button>
                                <span>Page {currentPageThisWeek}</span>
                            <button onClick={() => setCurrentPageThisWeek(p => p + 1)} disabled={currentPageThisWeek === totalPagesThisWeek}>Next</button>
                        </div>
                        )}


                        {paginatedLastWeekUploads.length > 0 && (
                        <div className={Styles.elementsNow}>
                        <h4>Last week</h4>


                        {paginatedLastWeekUploads.map((lastWeekUpload,index) => (




                        <div className={Styles.mainDocument} key={index} >
                            <div className={Styles.docStuffs}>
                                <div className={Styles.imageHolder}>
                                    <img src={viewNotes === true ? `../src/assets/noteicons/${lastWeekUpload.lesson.toLowerCase().replace(/\s+/g, '')}.webp` : (viewAllUploads && lastWeekUpload.type === 'Notes') ? `../src/assets/noteicons/${lastWeekUpload.lesson.toLowerCase().replace(/\s+/g, '')}.webp` : NoteImage } alt="note" />
                                </div>
                                <div className={Styles.textSection}>
                                    <h3>{lastWeekUpload.noteName || lastWeekUpload.assessmentName}</h3>
                                    <div>
                                        <p ref={descRef}>
                                            {lastWeekUpload.description}
                                        </p>

                                         <p className={Styles.description}>
                                            {lastWeekUpload.description.length <= 50
                                                ? lastWeekUpload.description
                                                : `${lastWeekUpload.description.slice(0, 50)}...`}
                                            </p>

                                        {lastWeekUpload.description.length > 50 && (
                                                <button className={Styles.readMoreBtn} onClick={
                                                    () => handleShowModal(
                                                        lastWeekUpload.noteName || lastWeekUpload.assessmentName,
                                                        lastWeekUpload.description
                                                    )
                                                }
                                                >
                                                    Read More
                                                </button>
                                            )}

                                    </div>
                                </div>
                            </div>
                            <div className={Styles.timestampDiv}>
                                <img src={Timestamp} />
                                <div>
                                    <p>{format(parseISO(lastWeekUpload.createdAt), 'dd MMM, yyyy')}</p>
                                    <p>{format(parseISO(lastWeekUpload.createdAt), 'hh:mm aa')}</p> 
                                </div>
                            </div>
                            <div className={Styles.activityDiv}>
                                <button data-tooltip="Save"><img src={Save} alt="Save" /></button>
                                <button data-tooltip="Update" onClick={() => {handleUpdateClick(),setId(lastWeekUpload._id),setType(lastWeekUpload.type)}}><img src={Update} alt="Update" /></button>
                                <button data-tooltip="Delete" onClick={() => {handleDeleteConfirm(),setId(lastWeekUpload._id),setType(lastWeekUpload.type),setFileName(lastWeekUpload.publicId)}}><img src={Delete} alt="Delete" /></button>
                            </div>
                        </div>

                          ))} 
                    </div>
                        )}  

                        {paginatedLastWeekUploads.length > 0 && (
                        <div className={Styles.pagination}>
                            <button onClick={() => setCurrentPageLastWeek(p => Math.max(1, p - 1))} disabled={currentPageLastWeek === 1}>Previous</button>
                                <span>Page {currentPageLastWeek}</span>
                            <button onClick={() => setCurrentPageLastWeek(p => p + 1)} disabled={currentPageLastWeek === totalPagesLastWeek}>Next</button>
                        </div>
                        )}

                        {paginatedOlderUploads.length > 0 && (
                              <div className={Styles.elementsNow}>
                        <h4>Older uploads</h4>

 
                        {paginatedOlderUploads.map((olderUpload,index) => (




                        <div className={Styles.mainDocument} key={index} >
                            <div className={Styles.docStuffs}>
                                <div className={Styles.imageHolder}>
                                    <img src={viewNotes === true ? `../src/assets/noteicons/${olderUpload.lesson.toLowerCase().replace(/\s+/g, '')}.webp` : (viewAllUploads && olderUpload.type === 'Notes') ? `../src/assets/noteicons/${olderUpload.lesson.toLowerCase().replace(/\s+/g, '')}.webp` : NoteImage } alt="note" />
                                </div>
                                <div className={Styles.textSection}>
                                    <h3>{olderUpload.noteName || olderUpload.assessmentName}</h3>
                                    <div>
                                        <p className={Styles.description}>
                                            {olderUpload.description.length <= 50
                                                ? olderUpload.description
                                                : `${olderUpload.description.slice(0, 50)}...`}
                                            </p>

                                        {olderUpload.description.length > 50 && (
                                                <button className={Styles.readMoreBtn} onClick={
                                                    () => handleShowModal(
                                                        olderUpload.noteName || olderUpload.assessmentName,
                                                        olderUpload.description
                                                    )
                                                }
                                                >
                                                    Read More
                                                </button>
                                            )}

                                    </div>
                                </div>
                            </div>
                            <div className={Styles.timestampDiv}>
                                <img src={Timestamp} />
                                <div>
                                    <p>{format(parseISO(olderUpload.createdAt), 'dd MMM, yyyy')}</p>
                                    <p>{format(parseISO(olderUpload.createdAt), 'hh:mm aa')}</p> 
                                </div>
                            </div>
                            <div className={Styles.activityDiv}>
                                <button data-tooltip="Save"><img src={Save} alt="Save" /></button>
                                <button data-tooltip="Update" onClick={() => {handleUpdateClick(),setId(olderUpload._id),setType(olderUpload.type)}}><img src={Update} alt="Update" /></button>
                                <button data-tooltip="Delete" onClick={() => {handleDeleteConfirm(),setId(olderUpload._id),setType(olderUpload.type),setFileName(olderUpload.publicId)}}><img src={Delete} alt="Delete" /></button>
                            </div>
                        </div>
                            ))}
                          </div>
                        )}

                        {paginatedOlderUploads.length > 0 && (
                        <div className={Styles.pagination}>
                            <button onClick={() => setCurrentPageOlder(p => Math.max(1, p - 1))} disabled={currentPageOlder === 1}>Previous</button>
                                <span>Page {currentPageOlder}</span>
                            <button onClick={() => setCurrentPageOlder(p => p + 1)} disabled={currentPageOlder === totalPagesOlder}>Next</button>
                        </div>
                        )}

                        

            </div>
            {showModal && (
                <div className={Styles.overlay}>
                    <div className={Styles.modal}>
                        <h3>{modalContent.title}</h3>
                        <p>
                            {modalContent.description}
                        </p>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}                    
            {showDeleteConfirm && (
                <div className={Styles.overlay}>
                    <div className={Styles.modal}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this item?</p>
                        <div className={Styles.modalButtons}>
                            <button onClick={handleDeleteCancel} className={Styles.cancelButton}>Cancel</button>
                            <button onClick={() => {handleDelete()}} className={Styles.confirmButton} style={{ backgroundColor: 'rgb(220,53,69)' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {showUpdateModal && (
                <div className={Styles.overlay}>
                    <div className={Styles.modal}>
                        <h3>Update Item</h3>
                        <div className={Styles.updateForm}>
                            <label htmlFor="newDescription">New Description</label>
                            <textarea
                                id="newDescription"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Enter new description..."
                                className={Styles.updateInput}
                            />
                            <label htmlFor="newFile">Upload File</label>
                            <input
                                id="newFile"
                                type="file"
                                className={Styles.updateInput}
                                  onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                setFileUrl(e.target.files[0]);  // Set the selected file object here
                                }
                            }} 
                            />
                            <div className={Styles.modalButtons}>
                                <button onClick={handleUpdateCancel} className={Styles.cancelButton}>Cancel</button>
                                <button onClick={() => {handleUpdateSubmit(id,type,newDescription,fileUrl)}} className={Styles.confirmButton}>{updateStatus === 'loading' ? 'updating...' : 'update'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}