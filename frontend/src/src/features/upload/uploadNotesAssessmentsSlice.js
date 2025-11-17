import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';

const API_URL = 'http://localhost:666/upload-document';

export const uploadNoteAndAssessment = createAsyncThunk(
    'notes/uploadNoteAndAssessment', 
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await api.post(`${API_URL}/`,formData, {
                headers: { 'Content-Type': 'multipart/form-data','Authorization': `Bearer ${token}` },
                withCredentials: true
            });
            return res.data;  // Return the response data
        } catch (error) {
            console.error('upload error:',error);
            return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
        }
    }
);

const initialState = ({
    uploadStatus:'idle',
    uploadError:null
})

const uploadSlice = createSlice({
    name:'uploadSlice',
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
    .addCase(uploadNoteAndAssessment.pending,(state)=>{
        state.uploadStatus='uploading'
    })
    .addCase(uploadNoteAndAssessment.fulfilled,(state)=>{
        state.uploadStatus='uploaded'
    })
    .addCase(uploadNoteAndAssessment.rejected,(state,action)=>{
        state.uploadStatus='failed';
        state.uploadError= action.payload?.error || action.error.message || 'Upload failed';
    })
    }
})

export default uploadSlice.reducer;