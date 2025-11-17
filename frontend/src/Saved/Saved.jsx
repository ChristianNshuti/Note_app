import Styles from './Saved.module.css'
import PastIcon from '../assets/exam.webp'
import Browser from '../assets/viewBrowser.webp'
import Download from '../assets/download.webp'
import Add from '../assets/more.webp'
import NoteIcon from '../assets/note1.webp'
import SavedImg from '../assets/savedPiece.webp'
import { useNavigate } from 'react-router-dom'
import { fetchSavedAssessments } from '../features/save/saveNotesAssessmentsSlice'
import { fetchSavedNotes } from '../features/save/saveNotesAssessmentsSlice'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { removeSavedNA } from '../features/save/saveNotesAssessmentsSlice'



export default function Saved(){

    const {removeSavedNAStatus} = useSelector((state)=> state.saves);
    const navigate = useNavigate();
    const { recentlySavedNotes , savedNotesStatus , savedNotesError ,
      savedAssessmentsStatus , recentlySavedAssessments,savedY1Assessments,
      savedY2Assessments,savedY3Assessments,savedY1Notes,savedY2Notes,
      savedY3Notes
    } = useSelector((state) => state.saves);
    const dispatch = useDispatch();

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


  const unSave = async (document_id, type) => {
    try {
        await dispatch(removeSavedNA({ document_id, type })).unwrap();
        dispatch(fetchSavedNotes());
        dispatch(fetchSavedAssessments());
    } catch (error) {
        console.error("Failed to unsave:", error);
    }
  };

    useEffect(()=>{
        dispatch(fetchSavedNotes());
        dispatch(fetchSavedAssessments());
    },[dispatch]);



    function navigateToSavedNotes() {
        navigate('/savednotes');
      }

    function navigateToSavedPastpapers() {
        navigate('/savedpastpapers');
    }


  const allRecentNotes = (recentlySavedNotes || []).slice(0,3);
  const allRecentAssessments = (recentlySavedAssessments || []).slice(0,3);
  const totalSavedAssessments = [...savedY1Assessments,...savedY2Assessments,...savedY3Assessments];
  const totalSavedNotes = [...savedY1Notes,...savedY2Notes,...savedY3Notes];

    return (
      <>
          <div className={Styles.savedMain}>
            <div className={Styles.scrollArea}>

                     <h2 className={Styles.savedHeading}>Saved documents</h2>
                     <h3 className={Styles.notesHeading}>Notes</h3>
                     <h4 className={Styles.recentHeading}>Recently saved, </h4>


                            
                                <div className={Styles.newDocuments}>
                            {savedNotesStatus === "loading" && (<div className={Styles.loaderContainer}>
                                                                    <div className={Styles.spinner}></div>
                                                                    <span>Loading...</span>
                                </div>
                            )}
                            {savedNotesStatus === "failed" && <p>{savedNotesError}</p>}
                            {savedNotesStatus === "succeeded" && ( allRecentNotes.length > 0 ? (
                                allRecentNotes.map((note, index) =>{
                                    const [firstname] = note.uploaderName.split(' ');
                                  return (
                                    <div className={Styles.documentItself} key={note._id || index}>
                                    <div>
                                        <div className={Styles.leftDocument}>
                                        <img src={`../src/assets/noteicons/${note.lesson.toLowerCase().replace(/\s+/g, '')}.webp`} loading="lazy"/>
                                        </div>
                                        <div className={Styles.rightDocument}>
                                        <p className={Styles.docTitle}>{note.lesson}</p>
                                        <p className={Styles.docDescription}>{note.description}</p>
                                        </div>
                                    </div>

                                    <div className={Styles.furtherActions}>
                                        <div className={Styles.tooltipWrapper}>
                                        <p>uploaded by {firstname}</p>
                                        <div className={Styles.tooltip}>{note.uploaderName}</div>
                                        </div>
                                        <div className={Styles.tooltipWrapper}>
                                        <img src={SavedImg} alt="Save" onClick={()=>unSave(note._id,'Notes')} loading="lazy"/>
                                        <div className={Styles.tooltip}>{removeSavedNAStatus === 'removing' ? 'unsaving...':'Unsave'}</div>
                                        </div>
                                        <div className={Styles.tooltipWrapper}>
                                        <img src={Download} alt="Download" onClick={()=>handleDownload(note.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip}>Download</div>
                                        </div>
                                        <div className={Styles.tooltipWrapper}>
                                        <img src={Browser} alt="View in browser" onClick={()=>handleViewInBrowser(note.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip}>View in browser</div>
                                        </div>
                                    </div>
                                    </div>
                                )})
                                ) : (
                                <p>Nothing saved yet</p>
                                ))}

                                  {totalSavedNotes?.length > 2 && (
                                 <button className={Styles.viewMore} onClick={navigateToSavedNotes}>
                                        <img src={Add} alt="Add" loading="lazy"/>
                                        <div className={Styles.tooltip}>View more</div>
                                 </button>   
                                 )}  


                        </div>








                     <h3 className={Styles.notesHeading}>Pastpapers </h3>
                     <h4 className={Styles.recentHeading}>Recently saved, </h4>


                                <div className={Styles.newDocuments}>
                            {savedAssessmentsStatus === "loading" && (<div className={Styles.loaderContainer}>
                                                                        <div className={Styles.spinner}></div>
                                                                        <span>Loading...</span>
                                                                      </div>
                            )}

                            {savedAssessmentsStatus === "failed" && <p>{savedAssessmentsError}</p>}
                            {savedAssessmentsStatus === "succeeded" && ( allRecentAssessments.length > 0 ? (
                                allRecentAssessments.map((assessment, index) => {
                                  const [firstname] = assessment.uploaderName.split(' ');
                                    return (
                                    <div className={Styles.documentItself} key={assessment._id || index}>
                                    <div>
                                        <div className={Styles.leftDocument}>
                                        <img src={PastIcon} loading="lazy"/>
                                        </div>
                                        <div className={Styles.rightDocument}>
                                        <p className={Styles.docTitle}>{assessment.lesson}</p>
                                        <p className={Styles.docDescription}>{assessment.description}</p>
                                        </div>
                                    </div>

                                    <div className={Styles.furtherActions}>
                                        <div className={Styles.tooltipWrapper}>
                                        <p>uploaded by {firstname}</p>
                                        <div className={Styles.tooltip}>{assessment.uploaderName}</div>
                                        </div>
                                        <div className={Styles.tooltipWrapper}>
                                        <img src={SavedImg} alt="Save" onClick={() => unSave(assessment._id, 'Assessments')} loading="lazy"/>
                                        <div className={Styles.tooltip}>{removeSavedNAStatus === 'removing' ? 'unsaving...':'Unsave'}</div>
                                        </div>
                                        <div className={Styles.tooltipWrapper}>
                                        <img src={Download} alt="Download" onClick={()=>handleDownload(assessment.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip}>Download</div>
                                        </div>
                                        <div className={Styles.tooltipWrapper}>
                                        <img src={Browser} alt="View in browser" onClick={()=>handleViewInBrowser(assessment.fileUrl)} loading="lazy"/>
                                        <div className={Styles.tooltip}>View in browser</div>
                                        </div>
                                    </div>
                                    </div>
                                )})
                                ) : (
                                <p>Nothing saved yet</p>
                                ))}


                                            
                                {totalSavedAssessments.length > 2 && (
                                 <button className={Styles.viewMore} onClick={navigateToSavedPastpapers}>
                                        <img src={Add} alt="Add" loading="lazy"/>
                                        <div className={Styles.tooltip}>View more</div>
                                 </button>  
                                 )}   

                            </div>


                    </div>

           </div>
      </>
    )

}