import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notesReducer from '../features/notes/getNotesSlice';
import uploadReducer from '../features/upload/uploadNotesAssessmentsSlice';
import assessmentsReducer from '../features/notes/getAssessmentsSlice';
import savesReducer from '../features/save/saveNotesAssessmentsSlice';
import setCourseReducer from '../features/notes/courseSetSlice';
import filterReducer from '../features/filter/filterSlice';
import contactsReducer from '../features/contacts/getContacts';
import deleteReducer from '../features/delete/deleteSlice';
import updateReducer from '../features/update/updateSlice';
import profileReducer from '../features/profile/getProfileImageSlice';
import authMiddleware from '../API/tokenAPI';



export const store = configureStore({
    reducer:{
    auth:authReducer,
    notes:notesReducer,
    assessments:assessmentsReducer,
    upload:uploadReducer,
    saves:savesReducer,
    setCourse:setCourseReducer,
    filter:filterReducer,
    contacts:contactsReducer,
    delete:deleteReducer,
    update:updateReducer,
    profile:profileReducer
    }});




export default store