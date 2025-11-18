import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';

const API_URL = 'http://localhost:666/get-notes';

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async ({ grade, subject,recentOnes }, thunkAPI) => {
    try {
        const token = localStorage.getItem('accessToken');
        
      const res = await api.post(`${API_URL}/`, { year:grade,subject,recentOnes }, {headers: {
            Authorization: `Bearer ${token}`
        } });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
    }
  });
  

const initialState = {
    notes:null,
    noteStatus:'idle',
    noteError:null,
    userNoteUploads:[]
}

const notesSlice = createSlice({
    name:'notesSlice',
    initialState,
    reducers: {},
    extraReducers:(builder) => {
        builder
    .addCase(fetchNotes.pending,(state) => {
        state.noteStatus = 'loading';
    })
    .addCase(fetchNotes.fulfilled,(state,action) => {
        state.noteStatus = 'succeeded';
        state.notes = action.payload.notes;
        state.userNoteUploads = action.payload.userUploads;
    })
    .addCase(fetchNotes.rejected,(state,action) => {
        state.noteStatus = 'failed';
        state.noteError = action.payload?.message || action.error.message || 'Upload failed';
    })
    }
})

export default notesSlice.reducer;
