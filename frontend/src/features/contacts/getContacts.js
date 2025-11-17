import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:666/contacts';

export const getContacts = createAsyncThunk('contacts/getContacts',async()=> {
    try{
        const response = await axios.get(`${API_URL}/`);
        return response.data
    }catch(error){
        console.log(error);
    }
})

const initialState = {
    contacts:[],
    contactStatus:null,
    contactError:null
}

const contactSlice = createSlice({
    name:'contacts',
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
    .addCase(getContacts.pending,(state)=>{
        state.contactStatus = 'loading'
    })
    .addCase(getContacts.fulfilled,(state,action) => {
        state.contactStatus = 'succeeded';
        state.contacts = action.payload.data;
    })
    .addCase(getContacts.rejected,(state,action) => {
        state.contactStatus = 'failed';
        state.contactError = action.payload;
    })
    }
})

export default contactSlice.reducer;

