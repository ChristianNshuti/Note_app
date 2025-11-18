import Styles from './Notes.module.css'
import NoteIcon from '../assets/note1.webp'
import Browser from '../assets/viewBrowser.webp'
import Download from '../assets/download.webp'
import Save from '../assets/save.webp'
import Saved from '../assets/savedPiece.webp'
import { useSearchParams } from 'react-router-dom';
import { fetchNotes } from '../features/notes/getNotesSlice';
import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { save } from '../features/save/saveNotesAssessmentsSlice';
import { removeSavedNA } from '../features/save/saveNotesAssessmentsSlice';
import { filterNP } from "../features/filter/filterSlice";
import ErrorBoundary from '../ErrorBoundary/Error'



export default function RecentNotes(){

    const { saveStatus,saveError,removeSavedNAStatus } = useSelector((state)=> state.saves);
    const {filterData} = useSelector((state) => state.filter);
    const savedVisited = true;
    const dispatch = useDispatch();
    const grade = 1;
    const subject = 'Any';
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchParams] = useSearchParams();
    const time = searchParams.get('time') || 'all';
    const recentOnes = true;
    const year = 'Any';
    const filters = { savedVisited , type: 'Notes' , grade , subject , category: 'Any' , term: 'Any' , year };

    useEffect(()=>{
        dispatch(fetchNotes({year, subject, recentOnes }));
    },[dispatch]);

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


    const {notes,noteStatus,noteError} = useSelector((state) => state.notes);

    let recentNotes;

    if (time === 'today') {
        recentNotes = notes?.filter(n => isToday(new Date(n.createdAt)));
    } else if (time === 'this week') {
        recentNotes = notes?.filter(n => isThisWeek(new Date(n.createdAt)));
    } else if (time === 'this month') {
        recentNotes = notes?.filter(n => isThisMonth(new Date(n.createdAt)));
    } else {
        recentNotes = notes;
    }

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



    useEffect(()=> {
            const recentOnes = false;
            dispatch(filterNP(filters));
        },[dispatch, grade, subject]);
    
        const saveNote = async(document_id,type) => {
            try{
                await dispatch(save({document_id,type})).unwrap();
                dispatch(filterNP(filters));
                dispatch(fetchNotes({year, subject, recentOnes }));
            }
            catch(error) {
                console.log(saveError);
            }
        }
    
        const unSave = async (document_id, type) => {
            try {
                await dispatch(removeSavedNA({ document_id, type })).unwrap();
                dispatch(filterNP(filters));
                dispatch(fetchNotes({year, subject, recentOnes }));
            } 
            catch (error) {
                console.error("Failed to unsave:", error);
            }   
        };

    const savedNoteIds = new Set(filterData.map(savedNote => savedNote._id));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotes = recentNotes?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(recentNotes?.length / itemsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1,totalPages));
    }

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1,1));
    }

    return(
        <>
        <div className={Styles.notesMain}>
        <div className={Styles.notesContentWrapper}>
        <div className={Styles.notes}>
        { noteStatus === 'loading' && (<div className={Styles.loaderContainer}>
                                        <div className={Styles.spinner}></div>
                                        <span>Loading...</span>
                                       </div>
        )}
        { noteStatus === 'failed' && <p>{noteError}</p>}
        { noteStatus === 'succeeded' && ( recentNotes?.length > 0 ? (
            currentNotes.map((note,index)=>{
                const isSaved = savedNoteIds.has(note._id); 
                const [firstname] = note.uploaderName.split(' ');
                return (
                            <div className={Styles.documentItself} key={index}>
                                <div>
                                    <div className={Styles.leftDocument}>
                                        <img src={`/noteicons/${note.lesson.toLowerCase().replace(/\s+/g, '')}.webp`} loading="lazy"/>
                
                                    </div>
                                    <div className={Styles.rightDocument}>
                                        <p className={Styles.docTitle}>{note.noteName}</p>
                                        <p className={Styles.docDescription}>{note.description}</p>
                                    </div>
                                </div> 
                
                
                              
                                <div className={Styles.furtherActions}>
                                    <div className={Styles.tooltipWrapper}>
                                        <p>uploaded by {firstname}</p>
                                        <div className={Styles.tooltip}>{note.uploaderName}</div>
                                    </div>
                                    

                                    <div className={Styles.tooltipWrapper}>
                                        <img src={isSaved ? Saved : Save } alt="Save" onClick={isSaved ? () => unSave(note._id, "Notes") : () => saveNote(note._id,"Notes")} loading="lazy"/>
                                        <div className={Styles.tooltip}>{saveStatus === "saving" ? 'saving...' : isSaved ? removeSavedNAStatus === 'removing' ? 'unsaving...' : 'unsave' : 'save'}</div>
                                    </div>

                                    <div className={Styles.tooltipWrapper}>
                                        <img src={Download} alt="Download" onClick={()=> handleDownload(note.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip} >Download</div>
                                    </div>
                
                                    <div className={Styles.tooltipWrapper}>
                                        <img src={Browser} alt="View in browser" onClick={() => handleViewInBrowser(note.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip}>View in browser</div>
                                    </div>
                                </div>
                                </div>
                )})):(
                <ErrorBoundary />
            ))}
                </div>
                {(recentNotes?.length > itemsPerPage && noteStatus === 'succeeded')&& (
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
        </>
    )
}