import { useEffect, useRef, useState } from 'react';
import Styles from './../Pastpapers/Pastpapers.module.css';
import Down from '../assets/down.webp';
import PastIcon from '../assets/exam.webp'
import Browser from '../assets/viewBrowser.webp'
import Download from '../assets/download.webp'
import Save from '../assets/save.webp'
import Saved from '../assets/savedPiece.webp'
import { useDispatch,useSelector } from 'react-redux';
import { save } from '../features/save/saveNotesAssessmentsSlice';
import { filterNP } from '../features/filter/filterSlice';
import { removeSavedNA } from '../features/save/saveNotesAssessmentsSlice';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary/Error'


export default function RecentPastPapers() {
    const [openDropdown, setOpenDropdown] = useState(null); 
    const wrapperRefs = useRef([]);
    const {filterStatus,filterError,filterData} = useSelector((state) => state.filter);
    const { saveStatus,saveError,removeSavedNAStatus } = useSelector((state)=> state.saves);
    const course = 'Any';
    const year = 1;
    const [filterTerm,setTerm] = useState('Any');
    const [filterCategory,setCategory] = useState('Any');
    const [filterYear,setYear] = useState('Any');
    const [savedAssessments,setSavedAssessments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const time = searchParams.get('time') || 'all';
    const itemsPerPage = 6;

    let savedVisited = false;
    const filters = {
        savedVisited,
        type: 'Assessments', // You can hardcode this or get from props
        grade: year,        // assuming 'course' is a proxy for grade
        subject: course,      // same assumption unless you have separate subject
        term: filterTerm,
        category: filterCategory,
        year: filterYear
    };

    const dispatch = useDispatch();

    

    const handleViewInBrowser = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['docx', 'doc', 'pptx', 'ppt', 'xlsx'].includes(extension)) {
                const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
                window.open(officeUrl, '_blank');
        }else if(extension === 'pdf') {
                window.open(url, '_blank');
        } 
        else {
                const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
                window.open(googleViewerUrl, '_blank');
        }
    };


const fetchAllData = async () => {
        const savedData = await dispatch(filterNP({...filters, savedVisited: true})).unwrap();
        setSavedAssessments(savedData);
        await dispatch(filterNP({...filters, savedVisited: false}));
    };


   useEffect(() => {
    fetchAllData();
}, [filterTerm, filterCategory, filterYear, dispatch, course]);


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

    let recentPastpapers;
    if (time === 'today') {
        recentPastpapers = filterData.filter(n => isToday(new Date(n.createdAt)));
    } else if (time === 'this week') {
        recentPastpapers = filterData.filter(n => isThisWeek(new Date(n.createdAt)));
    } else if (time === 'this month') {
        recentPastpapers = filterData.filter(n => isThisMonth(new Date(n.createdAt)));
    } else {
        recentPastpapers = filterData;
    }


    const saveAssessment = async(document_id,type) => {
        try{
            await dispatch(save({document_id,type})).unwrap();
            await fetchAllData();
        }catch(error) {
            console.log(saveError);
        }
    }

    const unSave = async (document_id, type) => {
        try {
            await dispatch(removeSavedNA({ document_id, type })).unwrap();
            await fetchAllData();
        } 
        catch (error) {
            console.error("Failed to unsave:", error);
        }
    };


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

    const savedAssessmentIds = new Set(savedAssessments?.map(savedAssessment => savedAssessment._id));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    const currentPapers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return recentPastpapers?.slice(start, end);
    }, [currentPage, itemsPerPage, recentPastpapers]);

    const totalPages = useMemo(() => Math.ceil((recentPastpapers?.length || 0) / itemsPerPage), [recentPastpapers]);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1,totalPages));
    }

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1,1));
    }
    

    return (
        <div className={Styles.pastpaperMain}>
            <div className={Styles.pastpapers}>

                    {filterStatus === 'filtering' && (<div className={Styles.loaderContainer}>
                                                        <div className={Styles.spinner}></div>
                                                        <span>Loading...</span>
                                                      </div>
                    )}

                    {filterStatus === 'failed' && <p>{filterError}</p>}
                    {filterStatus === 'filtered' && ( recentPastpapers?.length > 0 ? (
                    currentPapers?.map((oneFilterData,index) => {
                        const isSaved = savedAssessmentIds.has(oneFilterData._id); 
                        const [firstname] = oneFilterData.uploaderName.split(' ');
                        return (
                    <div className={Styles.documentItself} key={index}>
                            <div>
                                <div className={Styles.leftDocument}>
                                    <img src={PastIcon} loading="lazy"/>

                                </div>
                                <div className={Styles.rightDocument}>
                                    <p className={Styles.docTitle}>{oneFilterData.lesson}</p>
                                    <p className={Styles.docDescription}>{oneFilterData.description}</p>
                                </div>
                            </div> 


                        
                            <div className={Styles.furtherActions}>
                                <div className={Styles.tooltipWrapper}>
                                    <p>uploaded by {firstname}</p>
                                    <div className={Styles.tooltip}>{oneFilterData.uploaderName}</div>
                                </div>


                                <div className={Styles.tooltipWrapper}>
                                    <img src={isSaved ? Saved : Save } alt="Save" onClick={isSaved ? () => unSave(oneFilterData._id,"Assessments") : () => saveAssessment(oneFilterData._id,"Assessments")} loading="lazy"/>
                                    <div className={Styles.tooltip}>{saveStatus === "saving" ? 'saving...' : isSaved ? removeSavedNAStatus === 'removing' ? 'unsaving...' : 'unsave' : 'save'}</div> 
                                </div>

                                <div className={Styles.tooltipWrapper}>
                                    <img src={Download} alt="Download" onClick={()=>handleDownload(oneFilterData.fileUrl)} loading="lazy"/>
                                    <div className={Styles.tooltip}>Download</div>
                                </div>

                                <div className={Styles.tooltipWrapper}>
                                    <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(oneFilterData.fileUrl)} loading="lazy"/>
                                    <div className={Styles.tooltip}>View in browser</div>
                                </div>
                            </div>

                        </div>
                    )})):(
                        <ErrorBoundary /> 
                    ))}
                        {(recentPastpapers?.length > itemsPerPage && filterStatus === 'filtered')&& (
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
    )}