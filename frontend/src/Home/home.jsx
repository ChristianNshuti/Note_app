import React, { useDebugValue, useEffect, useState } from "react";
import Styles from './home.module.css'
import Add from '../assets/more.webp'
import NoteIcon from '../assets/note1.webp'
import NoteIcon2 from '../assets/note2.webp'
import PastIcon from '../assets/exam.webp'
import Browser from '../assets/viewBrowser.webp'
import Download from '../assets/download.webp'
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../features/notes/getNotesSlice';
import { fetchAssessments } from '../features/notes/getAssessmentsSlice';




export default function Home(){

    const { notes,noteStatus,noteError,userNoteUploads } = useSelector((state)=> state.notes);
    const { assessments,assessmentStatus,assessmentError,userAssessmentsUploads} = useSelector((state)=> state.assessments);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const recentOnes = true;
    const { user,status } = useSelector((state) => state.auth);
    const [NotesTime,setNotesTime] = useState('');
    const [PaperTime,setPaperTime] = useState('');
    const location = useLocation();
    const [activeTime, setActiveTime] = useState("");
    const [activePastTime, setActivePastTime] = useState("");

    useEffect(() => {

    if (location.pathname === '/') {
        dispatch(fetchNotes({ year: 'Any', subject: 'Any', recentOnes }));
        dispatch(fetchAssessments({ grade: 'Any', subject: 'Any', recentOnes }));
    }
    }, [location.pathname, dispatch]);

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


    const dailyNotes = notes?.filter(note => isToday(note.createdAt))
    const weeklyNotes = notes?.filter(note => isThisWeek(note.createdAt));
    const monthlyNotes = notes?.filter(note => isThisMonth(note.createdAt));
    const dailyPastpapers = assessments?.filter(paper => isToday(paper.createdAt));
    const weeklyPastpapers = assessments?.filter(paper => isThisWeek(paper.createdAt));
    const monthlyPastpapers = assessments?.filter(paper => isThisMonth(paper.createdAt));
    
    const userWeeklyNotes = (userNoteUploads || []).filter(note => isThisWeek(note.createdAt));
    const userWeeklyPastpapers = (userAssessmentsUploads || []).filter(paper => isThisWeek(paper.createdAt));


    const totalNotes = notes?.length || 0;
    const totalPastpapers = assessments?.length || 0;

    const notesToday = dailyNotes?.length || 0;
    const notesThisWeek = weeklyNotes?.length || 0;
    const notesThisMonth = monthlyNotes?.length || 0;
    const pastpapersToday = dailyPastpapers?.length || 0;
    const pastpapersThisWeek = weeklyPastpapers?.length || 0;
    const pastpapersThisMonth = monthlyPastpapers?.length || 0;
    const userNotesThisWeek = userWeeklyNotes?.length || 0;
    const userAssessmentsThisWeek = userWeeklyPastpapers?.length || 0;
    

    const remainingNotesToday = notesToday - 2;
    const remainingNotesThisWeek = notesThisWeek - 2;
    const remainingNotesThisMonth = notesThisMonth - 2;
    const remainingPastpapersToday = pastpapersToday - 2;
    const remainingPastpapersThisWeek = pastpapersThisWeek - 2;
    const remainingPastpapersThisMonth = pastpapersThisMonth - 2;
    const remainingNotes = totalNotes - 2;
    const remainingPastpapers = totalPastpapers - 2;

    const noteContributionPercent = totalNotes > 0
    ? Math.min(100, Math.round((notesThisWeek / totalNotes) * 100))
    : 0;

    const pastpaperContributionPercent = totalPastpapers > 0
    ? Math.min(100, Math.round((pastpapersThisWeek / totalPastpapers) * 100))
    : 0;

    const userNotesUploadsPercent = notesThisWeek > 0
    ? Math.min(100, Math.round((userNotesThisWeek / notesThisWeek) * 100))
    : 0;

    const userAssessmentsUploadsPercent = pastpapersThisWeek > 0
    ? Math.min(100, Math.round((userAssessmentsThisWeek / pastpapersThisWeek) * 100))
    : 0;




    function handleAllNotes(){
        navigate('/notes');
    }

    function handleAllPastpapers(){
        navigate('/pastpapers');
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
      } else {
        window.open(filePath, '_blank');
      }
    }
  };  




    const allRecentNotes = (notes || []).slice(0, 2);
    const allRecentPastpapers = (assessments || []).slice(0, 2);
    const allRecentNotesToday = (dailyNotes || []).slice(0, 2);
    const allRecentNotesThisWeek = (weeklyNotes || []).slice(0, 2);
    const allRecentNotesThisMonth = (monthlyNotes || []).slice(0, 2);
    const allRecentPastPapersToday = (dailyPastpapers || []).slice(0,2);
    const allRecentPastPapersThisWeek = (weeklyPastpapers || []).slice(0,2);
    const allRecentPastPapersThisMonth = (monthlyPastpapers || []).slice(0,2);

    const handleOpenRecentNotes = () => {
            navigate(`/recentNotes?time=${NotesTime || ''}`);
    }

    const handleOpenRecentAssessments = () => {
        navigate(`/recentPastpapers?time=${PaperTime || ''}`);
    }

    return(
        <div className={Styles.homeMain}>
            <div className={Styles.scrollArea}>
            <h2 className={Styles.hiThere}> 
                 👋 &nbsp;Hi there, {user?.username || 'Guest'} !
            </h2>


            <div className={Styles.contributionSection}>


                <div className={Styles.contributionClass}>
                    <div className={Styles.verticalLine}></div>
                      <div className={Styles.contributionData}>
                        <p>Contributions</p>
                        <p>{noteContributionPercent}%</p>
                        <h2><span className={Styles.contributionSpecialWord}>+{notesThisWeek} notes </span>this week</h2>
                      </div>   
                </div>





                <div className={Styles.contributionClass}>
                    <div className={Styles.verticalLine}></div>
                      <div className={Styles.contributionData}>
                        <p>Contributions</p>
                        <p>{pastpaperContributionPercent}%</p>
                        <h2><span className={Styles.contributionSpecialWord}>+{pastpapersThisWeek} pastpapers </span>this week</h2>
                      </div>   
                </div>







                <div className={Styles.contributionClass}>
                    <div className={Styles.verticalLine}></div>
                      <div className={Styles.contributionData}>
                        <p>Your contributions</p>
                        <p>{userNotesUploadsPercent}%</p>
                        <h2><span className={Styles.contributionSpecialWord}>+{userNotesThisWeek > 0  ? userNotesThisWeek : '0'} notes </span>this week</h2>
                      </div>   
                </div>





                <div className={Styles.contributionClass}>
                    <div className={Styles.verticalLine}></div>
                      <div className={Styles.contributionData}>
                        <p>Your contributions</p>
                        <p>{userAssessmentsUploadsPercent}%</p>
                        <h2><span className={Styles.contributionSpecialWord}>+{userAssessmentsThisWeek > 0 ? userAssessmentsThisWeek : '0'} pastpapers </span>this week</h2>
                      </div>   
                </div>

 


            </div><br /><br /><br />


            

            <h2 className={Styles.notesText}>Notes</h2>

            <div className={Styles.linksToVisit}>
           <a
            onClick={() => {
                if (activeTime === "today") {
                setNotesTime("");
                setActiveTime("");
                } else {
                setNotesTime("today");
                setActiveTime("today");
                }
            }}
            className={activeTime === "today" ? Styles.active : ""}
            >Today</a>

            <a
            onClick={() => {
                if (activeTime === "this week") {
                setNotesTime("");
                setActiveTime("");
                } else {
                setNotesTime("this week");
                setActiveTime("this week");
                }
            }}
            className={activeTime === "this week" ? Styles.active : ""}
            >This week</a>

                <a
                onClick={() => {
                    if (activeTime === "this month") {
                    setNotesTime("");
                    setActiveTime("");
                    } else {
                    setNotesTime("this month");
                    setActiveTime("this month");
                    }
                }}
                className={activeTime === "this month" ? Styles.active : ""}
                >This month</a>
            </div>

        

        <div className={Styles.newDocuments}>

            {noteStatus === "loading" && (<div className={Styles.loaderContainer}>
                                            <div className={Styles.spinner}></div>
                                            <span>Loading...</span>
                                      </div>
            )}

            {noteStatus === "failed" && <p>{noteError}</p>}
            {(noteStatus === "succeeded" && NotesTime === '') && (  allRecentNotes.length > 0 ? (
            allRecentNotes.map((recentNote,index)=> {
                const [firstname] = recentNote.uploaderName.split(' ');
                return (
            <div className={Styles.documentItself} key={index}>
                <div>
                    <div className={Styles.leftDocument}>
                        <img src={`../src/assets/noteicons/${recentNote.lesson.toLowerCase().replace(/\s+/g, '')}.webp`} loading="lazy"/>

                    </div>
                    <div className={Styles.rightDocument}>
                        <p className={Styles.docTitle}>{recentNote.lesson}</p>
                        <p className={Styles.docDescription}>
                            {recentNote.description}
                        </p>
                    </div>
                </div> 


              
                <div className={Styles.furtherActions}>
                    <div className={Styles.tooltipWrapper}>
                        <p>uploaded by {firstname}</p>
                        <div className={Styles.tooltip}>{recentNote.uploaderName}</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Download} alt="Download" onClick={()=> handleDownload(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>Download</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>View in browser</div>
                    </div>
                </div>

            </div>


          


        )})):(
            <p>No recent notes</p>
        ))}


            {noteStatus === "failed" && <p>{noteError}</p>}
            {(noteStatus === "succeeded" && NotesTime === 'today') && ( notesToday > 0 ? (
            allRecentNotesToday.map((recentNote,index)=> {
                const [firstname] = recentNote.uploaderName.split(' ');
                return (
            <div className={Styles.documentItself} key={index}>
                <div>
                    <div className={Styles.leftDocument}>
                        <img src={`../src/assets/noteicons/${recentNote.lesson.toLowerCase().replace(/\s+/g, '')}.webp`} loading="lazy"/>

                    </div>
                    <div className={Styles.rightDocument}>
                        <p className={Styles.docTitle}>{recentNote.lesson}</p>
                        <p className={Styles.docDescription}>
                            {recentNote.description}
                        </p>
                    </div>
                </div> 


              
                <div className={Styles.furtherActions}>
                    <div className={Styles.tooltipWrapper}>
                        <p>uploaded by {firstname}</p>
                        <div className={Styles.tooltip}>{recentNote.uploaderName}</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Download} alt="Download" onClick={()=> handleDownload(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>Download</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>View in browser</div>
                    </div>
                </div>

            </div>


          


        )})):(
            <p>No recent notes</p>
        ))}



            {noteStatus === "failed" && <p>{noteError}</p>}
            {(noteStatus === "succeeded" && NotesTime === 'this week') && ( notesThisWeek > 0 ? (
            allRecentNotesThisWeek.map((recentNote,index)=> {
                const [firstname] = recentNote.uploaderName.split(' ');
                return (
            <div className={Styles.documentItself} key={index}>
                <div>
                    <div className={Styles.leftDocument}>
                        <img src={`../src/assets/noteicons/${recentNote.lesson.toLowerCase().replace(/\s+/g, '')}.webp`} loading="lazy"/>

                    </div>
                    <div className={Styles.rightDocument}>
                        <p className={Styles.docTitle}>{recentNote.lesson}</p>
                        <p className={Styles.docDescription}>
                            {recentNote.description}
                        </p>
                    </div>
                </div> 


              
                <div className={Styles.furtherActions}>
                    <div className={Styles.tooltipWrapper}>
                        <p>uploaded by {firstname}</p>
                        <div className={Styles.tooltip}>{recentNote.uploaderName}</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Download} alt="Download" onClick={()=> handleDownload(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>Download</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>View in browser</div>
                    </div>
                </div>

            </div>


          


        )})):(
            <p>No recent notes</p>
        ))}



            {noteStatus === "failed" && <p>{noteError}</p>}
            {(noteStatus === "succeeded" && NotesTime === 'this month') && ( notesThisMonth > 0 ? (
            allRecentNotesThisMonth.map((recentNote,index)=> {
                const [firstname] = recentNote.uploaderName.split(' ');
                return (
            <div className={Styles.documentItself} key={index}>
                <div>
                    <div className={Styles.leftDocument}>
                        <img src={`../src/assets/noteicons/${recentNote.lesson.toLowerCase().replace(/\s+/g, '')}.webp`} loading="lazy"/>

                    </div>
                    <div className={Styles.rightDocument}>
                        <p className={Styles.docTitle}>{recentNote.lesson}</p>
                        <p className={Styles.docDescription}>
                            {recentNote.description}
                        </p>
                    </div>
                </div> 


              
                <div className={Styles.furtherActions}>
                    <div className={Styles.tooltipWrapper}>
                        <p>uploaded by {firstname}</p>
                        <div className={Styles.tooltip}>{recentNote.uploaderName}</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Download} alt="Download" onClick={()=> handleDownload(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>Download</div>
                    </div>

                    <div className={Styles.tooltipWrapper}>
                        <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentNote.fileUrl)} loading="lazy"/>
                        <div className={Styles.tooltip}>View in browser</div>
                    </div>
                </div>

            </div>


          


        )})):(
            <p>No recent notes </p>
        ))}

        {(() => {
        let remaining = 0;

        if (NotesTime === '' && notes?.length > 2) {
            remaining = remainingNotes;
        } else if (NotesTime === 'today' && notesToday > 2) {
            remaining = remainingNotesToday;
        } else if (NotesTime === 'this week' && notesThisWeek > 2) {
            remaining = remainingNotesThisWeek;
        } else if (NotesTime === 'this month' && notesThisMonth > 2) {
            remaining = remainingNotesThisMonth;
        }

        return remaining > 0 && (
            <div className={Styles.viewmoreContainer}>
            <span className={Styles.viewmore} onClick={handleOpenRecentNotes}>view more(+{remaining})</span>
            </div>
        );
        })()}

        </div>




  {/*Okkkkkkkkkkkkkkkk here i switch to recent pastpapers */}

            




                <h2 className={Styles.notesText}>Pastpapers</h2>

                <div className={Styles.linksToVisit}>
            <a
            onClick={() => {
                if (activePastTime === "today") {
                setPaperTime("");
                setActivePastTime("");
                } else {
                setPaperTime("today");
                setActivePastTime("today");
                }
            }}
            className={activePastTime === "today" ? Styles.active : ""}
            >Today</a>

 <a
            onClick={() => {
                if (activePastTime === "this week") {
                setPaperTime("");
                setActivePastTime("");
                } else {
                setPaperTime("this week");
                setActivePastTime("this week");
                }
            }}
            className={activePastTime === "this week" ? Styles.active : ""}
            >This week</a>


            <a
            onClick={() => {
                if (activePastTime === "this month") {
                setPaperTime("");
                setActivePastTime("");
                } else {
                setPaperTime("this month");
                setActivePastTime("this month");
                }
            }}
            className={activePastTime === "this month" ? Styles.active : ""}
            >This month</a>

                </div>



                <div className={Styles.newDocuments}>

                    {assessmentStatus === 'loading' && (<div className={Styles.loaderContainer}>
                                                        <div className={Styles.spinner}></div>
                                                        <span>Loading...</span>
                                                    </div>
                                                   )}

                {assessmentStatus === 'failed' && <p>{assessmentError}</p>}
                {(assessmentStatus === 'succeeded' && PaperTime === '' )&& ( allRecentPastpapers.length > 0 ? (
                allRecentPastpapers.map((recentPastPaper,index) => {
                const [firstname] = recentPastPaper.uploaderName.split(' '); 
                return (
                <div className={Styles.documentItself} key={index}>
                    <div>
                        <div className={Styles.leftDocument}>
                           <img src={PastIcon} />

                        </div>
                        <div className={Styles.rightDocument}>
                            <p className={Styles.docTitle}>{recentPastPaper.lesson}</p>
                            <p className={Styles.docDescription}>
                                {recentPastPaper.description}
                            </p>
                        </div>
                    </div> 


                
                    <div className={Styles.furtherActions}>
                        <div className={Styles.tooltipWrapper}>
                            <p>uploaded by {firstname}</p>
                            <div className={Styles.tooltip}>{recentPastPaper.uploaderName}</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Download} alt="Download" onClick={()=> handleDownload(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>Download</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>View in browser</div>
                        </div>
                    </div>

                </div>
                )})):(
                    <p>No recent past papers</p>
                ))}


                {assessmentStatus === 'failed' && <p>{assessmentError}</p>}
                {(assessmentStatus === 'succeeded' && PaperTime === 'today' )&& ( pastpapersToday > 0 ? (
                allRecentPastPapersToday.map((recentPastPaper,index) => {
                const [firstname] = recentPastPaper.uploaderName.split(' '); 
                return (
                <div className={Styles.documentItself} key={index}>
                    <div>
                        <div className={Styles.leftDocument}>
                           <img src={PastIcon} />

                        </div>
                        <div className={Styles.rightDocument}>
                            <p className={Styles.docTitle}>{recentPastPaper.lesson}</p>
                            <p className={Styles.docDescription}>
                                {recentPastPaper.description}
                            </p>
                        </div>
                    </div> 


                
                    <div className={Styles.furtherActions}>
                        <div className={Styles.tooltipWrapper}>
                            <p>uploaded by {firstname}</p>
                            <div className={Styles.tooltip}>{recentPastPaper.uploaderName}</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Download} alt="Download" onClick={()=> handleDownload(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>Download</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>View in browser</div>
                        </div>
                    </div>

                </div>
                )})):(
                    <p>No recent past papers</p>
                ))}



                {assessmentStatus === 'failed' && <p>{assessmentError}</p>}
                {(assessmentStatus === 'succeeded' && PaperTime === 'this week' )&& ( pastpapersThisWeek > 0 ? (
                allRecentPastPapersThisWeek.map((recentPastPaper,index) => {
                const [firstname] = recentPastPaper.uploaderName.split(' '); 
                return (
                <div className={Styles.documentItself} key={index}>
                    <div>
                        <div className={Styles.leftDocument}>
                           <img src={PastIcon} />

                        </div>
                        <div className={Styles.rightDocument}>
                            <p className={Styles.docTitle}>{recentPastPaper.lesson}</p>
                            <p className={Styles.docDescription}>
                                {recentPastPaper.description}
                            </p>
                        </div>
                    </div> 


                
                    <div className={Styles.furtherActions}>
                        <div className={Styles.tooltipWrapper}>
                            <p>uploaded by {firstname}</p>
                            <div className={Styles.tooltip}>{recentPastPaper.uploaderName}</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Download} alt="Download" onClick={()=> handleDownload(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>Download</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>View in browser</div>
                        </div>
                    </div>

                </div>
                )})):(
                    <p>No recent past papers</p>
                ))}




                {assessmentStatus === 'failed' && <p>{assessmentError}</p>}
                {(assessmentStatus === 'succeeded' && PaperTime === 'this month' ) && ( pastpapersThisMonth > 0 ? (
                allRecentPastPapersThisMonth.map((recentPastPaper,index) => {
                const [firstname] = recentPastPaper.uploaderName.split(' '); 
                return (
                <div className={Styles.documentItself} key={index}>
                    <div>
                        <div className={Styles.leftDocument}>
                           <img src={PastIcon} />

                        </div>
                        <div className={Styles.rightDocument}>
                            <p className={Styles.docTitle}>{recentPastPaper.lesson}</p>
                            <p className={Styles.docDescription}>
                                {recentPastPaper.description}
                            </p>
                        </div>
                    </div> 


                
                    <div className={Styles.furtherActions}>
                        <div className={Styles.tooltipWrapper}>
                            <p>uploaded by {firstname}</p>
                            <div className={Styles.tooltip}>{recentPastPaper.uploaderName}</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Download} alt="Download" onClick={()=> handleDownload(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>Download</div>
                        </div>

                        <div className={Styles.tooltipWrapper}>
                            <img src={Browser} alt="View in browser" onClick={()=> handleViewInBrowser(recentPastPaper.fileUrl)} loading="lazy"/>
                            <div className={Styles.tooltip}>View in browser</div>
                        </div>
                    </div>

                </div>
                )})):(
                    <p>No recent past papers</p>
                ))}


        {(() => {
        let remaining = 0;

        if (PaperTime === '' && assessments?.length > 2) {
            remaining = remainingPastpapers;
        } else if (PaperTime === 'today' && pastpapersToday > 2) {
            remaining = remainingPastpapersToday;
        } else if (PaperTime === 'this week' && pastpapersThisWeek > 2) {
            remaining = remainingPastpapersThisWeek;
        } else if (PaperTime === 'this month' && pastpapersThisMonth > 2) {
            remaining = remainingPastpapersThisMonth;
        }

        return remaining > 0 && (
            <div className={Styles.viewmoreContainer}>
            <span className={Styles.viewmore} onClick={handleOpenRecentAssessments}>view more(+{remaining})</span>
            </div>
        );
        })()}
                </div>




         
 {/*Okkkkkkkkkkkkkkkk here i am out of recent pastpapers */}


          </div>
        </div>
    )
}