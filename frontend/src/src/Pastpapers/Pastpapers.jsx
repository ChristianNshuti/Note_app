import { useEffect, useRef, useState } from 'react';
import Styles from './Pastpapers.module.css';
import Down from '../assets/down.webp';
import PastIcon from '../assets/exam.webp'
import Browser from '../assets/viewBrowser.webp'
import Download from '../assets/download.webp'
import Save from '../assets/save.webp'
import Saved from '../assets/savedPiece.webp'
import { useDispatch,useSelector } from 'react-redux';
import { save } from '../features/save/saveNotesAssessmentsSlice';
import { filterNP } from '../features/filter/filterSlice';
import { removeSavedNA } from '../features/save/saveNotesAssessmentsSlice'
import ErrorBoundary from '../ErrorBoundary/Error'


export default function Pastpapers() {
    const [openDropdown, setOpenDropdown] = useState(null); 
    const wrapperRefs = useRef([]);
    const {filterStatus,filterError,filterData} = useSelector((state) => state.filter);
    const { course:reduxCourse,year:reduxYear } = useSelector((state)=> state.setCourse); 
    const { saveStatus,saveError,removeSavedNAStatus } = useSelector((state)=> state.saves);
    const course = reduxCourse || localStorage.getItem("selectedCourse");
    const year = reduxYear || localStorage.getItem("selectedYear");
    const [filterTerm,setTerm] = useState('Any');
    const [filterCategory,setCategory] = useState('Any');
    const [filterYear,setYear] = useState('Any');
    const [savedAssessments,setSavedAssessments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
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

    const savedAssessmentIds = new Set(savedAssessments.map(savedAssessment => savedAssessment._id));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPapers = filterData?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filterData?.length / itemsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1,totalPages));
    }

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1,1));
    }

    return (
        <div className={Styles.pastpaperMain}>
            <div className={Styles.filtersDiv}>
                <p className={Styles.filterText}>Filter by:</p>

                {['Term', 'Category', 'Year'].map((label, index) => {
                  const options = {
                    0: [
                        { label: 'First Term', value: 1 },
                        { label: 'Second Term', value: 2 },
                        { label: 'Third Term', value: 3 },
                    ],
                    1: [
                        { label: 'Exams', value: 'Examination' },
                        { label: 'CATs', value: 'CAT' }
                    ],
                    2: [
                        { label: '2025', value: '2025' },
                        { label: '2024', value: '2024' },
                        { label: '2023', value: '2023' }
                    ],
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
                                        setTerm(option.value);
                                    }
                                    else if(index === 1) {
                                        setCategory(option.value);
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

            <div className={Styles.pastpapers}>


                    {filterStatus === 'filtering' && (<div className={Styles.loaderContainer}>
                                                        <div className={Styles.spinner}></div>
                                                        <span>Loading...</span>
                                                      </div>
                    )}

                    {filterStatus === 'failed' && <p>{filterError}</p>}
                    {filterStatus === 'filtered' && ( filterData.length > 0 ? (
                    currentPapers.map((oneFilterData,index) => {
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
    );
}
