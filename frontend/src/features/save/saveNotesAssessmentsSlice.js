import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';

const API_URL = 'http://localhost:666/noteSaved';

export const save = createAsyncThunk('saves/save',async({ document_id,type },thunkAPI) => {
    try{
        const token = localStorage.getItem('accessToken');   
        const res = await api.post(`${API_URL}/save`,{ document_id,type },{headers: {
            Authorization: `Bearer ${token}`
        }});
        return res.data.message;
    }catch(error){
        console.log(error);
    }
})

export const fetchSavedNotes = createAsyncThunk('saves/fetchSavedNotes', async (_, thunkAPI) => {
    try {
          const token = localStorage.getItem('accessToken');
        const res = await api.get(`${API_URL}/getSavedNotes`, {headers: {
            Authorization: `Bearer ${token}`
        }});
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
});

export const fetchSavedAssessments = createAsyncThunk('saves/fetchSavedAssessments', async (_, thunkAPI) => {
    try {
          const token = localStorage.getItem('accessToken');
        const res = await api.get(`${API_URL}/getSavedAssessments`, {headers: {
            Authorization: `Bearer ${token}`
        }});
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
});

export const removeSavedNA = createAsyncThunk('saves/removeSavedNA', async ({document_id,type},thunkAPI) => {
    try {
          const token = localStorage.getItem('accessToken');
        const res = await api.post(`${API_URL}/removeSave`,{document_id,type}, {headers: {
            Authorization: `Bearer ${token}`
        }});
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
});



const initialState = {
    saveStatus:'idle',
    saveError:null,
    savedNotesStatus:'idle',
    savedNotesError:null,
    savedAssessmentsStatus:'idle',
    savedAssessmentsError:null,
    removeSavedNAStatus:'idle',
    removeSavedNAError:null,
    savedY1Notes:[],
    savedY2Notes:[],
    savedY3Notes:[],
    recentlySavedNotes:[],
    recentlySavedAssessments:[],
    savedY1Assessments:[],
    savedY2Assessments:[],
    savedY3Assessments:[],
}

const savesSlice = createSlice({
    name:'saves',
    initialState,
    reducers:{

    },
    extraReducers:(builder) => {
            builder
        .addCase(save.pending,(state)=>{
            state.saveStatus= 'saving';
        })
        .addCase(save.fulfilled,(state)=>{
            state.saveStatus= 'saved';
        })
        .addCase(save.rejected,(state,action)=>{
            state.saveStatus= 'failed';
            state.saveError=action.payload;
        })
        .addCase(fetchSavedNotes.pending,(state)=>{
            state.savedNotesStatus='loading';
        })
        .addCase(fetchSavedNotes.fulfilled,(state,action)=>{
            state.savedNotesStatus='succeeded';
            state.savedY1Notes=action.payload.year1SavedNotes;
            state.savedY2Notes=action.payload.year2SavedNotes;
            state.savedY3Notes=action.payload.year3SavedNotes;
            state.recentlySavedNotes = action.payload.recentlySavedNotes;
        })
        .addCase(fetchSavedNotes.rejected,(state,action)=>{
            state.savedNotesStatus='failed';
            state.savedNotesError=action.payload;
        })
        .addCase(fetchSavedAssessments.pending,(state)=>{
            state.savedAssessmentsStatus='loading';
        })
        .addCase(fetchSavedAssessments.fulfilled,(state,action)=>{
            state.savedAssessmentsStatus='succeeded';
            state.savedY1Assessments=action.payload.year1SavedAssessments;
            state.savedY2Assessments=action.payload.year2SavedAssessments;
            state.savedY3Assessments=action.payload.year3SavedAssessments;
            state.recentlySavedAssessments = action.payload.recentlySavedAssessments;
        })
        .addCase(fetchSavedAssessments.rejected,(state,action)=>{
            state.savedAssessmentsStatus='failed';
            state.savedAssessmentsError=action.payload;
        })
        .addCase(removeSavedNA.pending,(state)=>{
            state.removeSavedNAStatus='removing';
        })
        .addCase(removeSavedNA.fulfilled,(state)=>{
            state.removeSavedNAStatus='removed';
        })
        .addCase(removeSavedNA.rejected,(state,action)=>{
            state.removeSavedNAStatus='failed';
            state.removeSavedNAError=action.payload.message;
        })
    }
})

export default savesSlice.reducer;