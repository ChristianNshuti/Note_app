import { useEffect, useMemo, useRef, useState } from 'react';
import Styles from './NotesOnly.module.css'
import Down from '../assets/down.webp';
import PastIcon from '../assets/exam.webp'
import Browser from '../assets/viewBrowser.webp'
import Download from '../assets/download.webp'
import Save from '../assets/savedPiece.webp'
import NoteIcon from '../assets/note2.webp'
import { useDispatch,useSelector } from 'react-redux';
import { filterNP } from '../features/filter/filterSlice';
import { removeSavedNA } from '../features/save/saveNotesAssessmentsSlice';
import ErrorBoundary from '../ErrorBoundary/Error'



export default function NotesOnly(){
    const {removeSavedNAStatus} = useSelector((state)=> state.saves);
    const [openDropdown, setOpenDropdown] = useState(null); 
    const dispatch = useDispatch();
    const wrapperRefs = useRef([]);
    const [course,setCourse] = useState('Any');
    const [grade,setGrade] = useState('Any');
    const [year,setYear] = useState('Any');
    const savedVisited=true;
    const {filterStatus,filterError,filterData} = useSelector((state) => state.filter);
    const filters = { savedVisited , type:'Notes', grade, subject: course, category: 'Any' , term: 'Any' , year};
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const unSave = async (document_id, type) => {
        try {
            await dispatch(removeSavedNA({ document_id, type })).unwrap();
            dispatch(filterNP(filters));
        } catch (error) {
            console.error("Failed to unsave:", error);
        }
    };


    const handleDownload = (filePath) => {
        if (filePath.includes('cloudinary.com')) {
            const url = new URL(filePath);
            const parts = url.pathname.split('/');
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex !== -1) {
                parts.splice(uploadIndex + 1, 0, 'fl_attachment');
                const newPath = parts.join('/');
                url.pathname = newPath;
                window.open(url.toString(), '_blank');
            } 
            else {
                window.open(filePath, '_blank');
            }
        }
    };    

    const handleViewInBrowser = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['docx', 'doc', 'pptx', 'ppt', 'xlsx'].includes(extension)) {
            const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
            window.open(officeUrl, '_blank');
        }
        else if(extension === 'pdf') {
            window.open(url, '_blank');
        } 
        else {
            const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
            window.open(googleViewerUrl, '_blank');
        }
    };

    
    const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    return date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
    };

    // ✅ Check if the date is this week (Monday to Sunday)
    const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return date >= monday && date <= sunday;
        };

// ✅ Check if the date is this month
    const isThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    return date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth();
    };

    useEffect(() => {
        const filters = { savedVisited , type: 'Notes', grade, subject: course, category: 'Any', term: 'Any', year };
        dispatch(filterNP(filters));
    }, [course, grade, year, dispatch]);


    useEffect(() => {
        function handleClickOutside(event) {
            const clickedInsideAny = wrapperRefs.current.some(ref =>
                ref && ref.contains(event.target)
            );

            if (!clickedInsideAny) {
                setOpenDropdown(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const toggleDropdown = (index) => {
        setOpenDropdown(prev => (prev === index ? null : index));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    const currentNotes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filterData?.slice(start, end);
    }, [currentPage, itemsPerPage, filterData]);

    const totalPages = useMemo(() => Math.ceil((filterData?.length || 0) / itemsPerPage), [filterData]);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1,totalPages));
    }

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1,1));
    }

    useEffect(() => {
        if (currentNotes.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentNotes, currentPage]);

    return(
      <div className={Styles.savedNotesMain}>
             
              <h2 className={Styles.savedHeading}>Saved Notes</h2>

             <div className={Styles.filtersDiv}>
                        <p className={Styles.filterText}>Filter by:</p>
        
                        {['Subject', 'Grade', 'Year'].map((label, index) => {
                                                        const options = {
                                0:[
                                    {label:'Database',value:'Database'},
                                    { label:'JavaScript',value:'Javascript'},
                                    {label:'Blockchain',value:'Blockchain'}],
                                1: [
                                    {label:'Year 3',value:3},
                                    {label:'Year 2',value:2},
                                    {label:'Year 1',value:1}],
                                2: [
                                    {label:'2025',value:2025},
                                    {label:'2024',value:2024},
                                    {label:'2023',value:2023}],
                            }[index];
        
                            return (
                                <div
                                    key={label}
                                    className={Styles.customSelectWrapper}
                                    ref={el => (wrapperRefs.current[index] = el)} 
                                >
                                    <div
                                        className={Styles.customSelect}
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        <span>{label}</span>
                                        <img src={Down} loading="lazy"/>
                                    </div>
        
                                    <div
                                        className={Styles.dropdownMenu}
                                        style={{ display: openDropdown === index ? 'block' : 'none' }}
                                    >
                                    {options.map(option => (
                                    <div key={option.label} className={Styles.option} onClick={()=> {if(index === 0){
                                        setCourse(option.value);
                                    }
                                    else if(index === 1) {
                                        setGrade(option.value);
                                    }
                                    else if(index === 2) {
                                        setYear(option.value);
                                    }}}>
                                        {option.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}


                    </div>



                    <div className={Styles.savedNotes}>
                          {/* Here i add place holder note links */}


                            {filterStatus === "filtering" && (<div className={Styles.loaderContainer}>
                                                                <div className={Styles.spinner}></div>
                                                                <span>Loading...</span>
                                                              </div>
                            )}
                            {filterStatus === "failed" && <p>{filterError}</p>}
                            {filterStatus === "filtered" && ( filterData.length > 0 ? (
                                currentNotes.map((oneFilterData,index) =>{
                                    const [firstname] = oneFilterData.uploaderName.split(' ');
                                    return (
                            
                            <div className={Styles.documentItself} key={index}>
                                <div>
                                    <div className={Styles.leftDocument}>
                                        <img src={`../src/assets/noteicons/${oneFilterData.lesson.toLowerCase().replace(/\s+/g, '')}.webp`} loading="lazy"/>
                
                                    </div>
                                    <div className={Styles.rightDocument}>
                                        <p className={Styles.docTitle}>{oneFilterData.lesson}</p>
                                        <p className={Styles.docDescription}>
                                           {oneFilterData.description}
                                        </p>
                                    </div>
                                </div> 
                
                
                              
                                <div className={Styles.furtherActions}>
                                    <div className={Styles.tooltipWrapper}>
                                        <p>uploaded by {firstname}</p>
                                        <div className={Styles.tooltip}>{oneFilterData.uploaderName}</div>
                                    </div>


                                    <div className={Styles.tooltipWrapper}>
                                        <img src={Save} alt="Save" onClick={() => unSave(oneFilterData._id,'Notes')} loading="lazy"/>
                                        <div className={Styles.tooltip}>{removeSavedNAStatus === 'removing' ? 'unsaving...':'Unsave'}</div>
                                    </div>
                
                                    <div className={Styles.tooltipWrapper}>
                                        <img src={Download} alt="Download" onClick={()=>handleDownload(oneFilterData.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip}>Download</div>
                                    </div>
                
                                    <div className={Styles.tooltipWrapper}>
                                        <img src={Browser} alt="View in browser" onClick={()=>handleViewInBrowser(oneFilterData.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip}>View in browser</div>
                                    </div>
                                </div>
                
                            </div>
                            )})):(
                                <ErrorBoundary />
                            ))}        
                            {(filterData?.length > itemsPerPage && filterStatus === 'filtered')&& (
                                    <div className={Styles.pagination}>
                                        <button onClick={goToPrevPage} disabled={currentPage === 1}>
                                            Prev
                                        </button>
                                            <span> Page {currentPage} of {totalPages} </span>
                                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                                            Next
                                        </button>
                                    </div>
                        )}
                      
                    </div>


      </div>
    )
}
