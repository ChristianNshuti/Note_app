import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';

const API_URL='http://localhost:666/get-assessments';

export const fetchAssessments = createAsyncThunk('assessments/fetchAssessments',async ({ grade, subject,recentOnes }, thunkAPI) => {
    try {
        const token = localStorage.getItem('accessToken');
        
      const res = await api.post(`${API_URL}/`, {grade,subject,recentOnes }, { headers: {
            Authorization: `Bearer ${token}`
        }});
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
    }
  });
  

const initialState = {
    assessments:[],
    assessmentStatus:'idle',
    assessmentError:null,
    userAssessmentsUploads:[]
}

const assessmentsSlice = createSlice({
    name:'assessments',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
    .addCase(fetchAssessments.pending,(state) => {
        state.assessmentStatus = 'loading';
    })
    .addCase(fetchAssessments.fulfilled,(state,action) => {
        state.assessmentStatus = 'succeeded';
        state.assessments = action.payload.assessments;
        state.userAssessmentsUploads = action.payload.userUploads;
    })
    .addCase(fetchAssessments.rejected,(state,action) => {
        state.assessmentStatus = 'failed';
        state.assessmentError = action.payload?.message || action.error.message || 'Upload failed';
    });
    },
});

export default assessmentsSlice.reducer;
