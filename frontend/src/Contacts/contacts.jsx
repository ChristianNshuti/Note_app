import Styles from './contacts.module.css'
import Search from "../assets/search.webp"
import Profile2 from '../assets/profile2.webp'
import Email from '../assets/email.webp'
import Linkedin from '../assets/linkedin.webp'
import Phone from '../assets/phone.webp'
import Name from '../assets/name.webp'
import { getContacts } from '../features/contacts/getContacts'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


export default function Contacts(){

    const {contacts,contactStatus,contactError} = useSelector((state)=>state.contacts);
        const [searchTerm,setSearchTerm] = useState('');
        const dispatch = useDispatch()

        const filteredContacts = contacts?.filter(contact => 
            `${contact.first_name} ${contact.last_name} ${contact.courses} ${contact.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

        useEffect(()=>{
            dispatch(getContacts());
        },[dispatch])

    return(
         <div className={Styles.contactsMain}>
              <div className={Styles.contactsMenu}>


                 <div className={Styles.leftMenu}>
                    <h2>Contacts</h2>
                    <p>Find your Teacher's contacts</p>
                 </div> 



                 <div className={Styles.middleMenu}>

                      <div className={Styles.middleHeader}>
                          <input type="text" placeholder="Search here" onChange={(e)=> setSearchTerm(e.target.value)}/>
                          <button><img src={Search} loading="lazy" /></button>
                      </div>

                 </div> 


                 <div className={Styles.rightMenu}>
                 </div>        



              </div>


              <div className={Styles.scrollArea}>
                 
                 {contactStatus === 'loading' && <p>Loading...</p>}
                                  {contactStatus === 'failed' && <p>{contactError}</p>}
                                  {contactStatus === 'succeeded' && ( contacts ? (
                                     filteredContacts.map((contact,index) => (
                                  <div className={Styles.contactSection} key={index}>
                                     <img src={Profile2} alt="Teacher profile" className={Styles.profileTeacher} loading="lazy" />
                                     <p className={Styles.profileName}>{contact.last_name}</p>
                                     <p className={Styles.teacherOf}>{contact.courses}</p>
                 
                 
                                     <div className={Styles.contactsDiv}>
                 
                 
                 
                                         <div className={Styles.row}>
                                             <img src={Name} alt="Name Icon" className={Styles.icon} loading="lazy"/>
                                             <span className={Styles.text}>{`${contact.first_name} ${contact.last_name}`}</span>
                                         </div>
                 
                 
                                         <div className={Styles.row}>
                                             <img src={Email} alt="Email Icon" className={Styles.icon} loading="lazy"/>
                                             <span className={Styles.text}>{contact.email}</span>
                                         </div>
                 
                 
                                         <div className={Styles.row}>
                                             <img src={Phone} alt="Phone Icon" className={Styles.icon} loading="lazy"/>
                                             <span className={Styles.text}>{contact.phone_number}</span>
                                         </div>
                 
                 
                 
                 
                                     </div>
                 
                                  </div>   
                                  )))  : (
                                     <p>No contacts available</p>
                                  ))}             
                 <Link to="/developers" className={Styles.visitUs}>
                     The minds behind RCA Notely
                 </Link>
              </div> 
              
         </div>
    )
}