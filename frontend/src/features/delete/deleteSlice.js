import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';

const API_URL = 'https://note-app-backend-rh2b.onrender.com/delete';

export const deleteNote = createAsyncThunk('delete/deleteNote', async ({noteId,fileName}, thunkAPI) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await api.delete(`${API_URL}/deleteNote`,{
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            noteId,fileName
        }
     });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
    }
  });

  export const deleteAssessment = createAsyncThunk('delete/deleteAssessment', async ({AssessmentId,fileName}, thunkAPI) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await api.delete(`${API_URL}/deleteAssessment`, { 
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            AssessmentId,fileName
        }
    });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
    }
  });
  

const initialState = {
    deleteStatus:'idle',
    deleteError:null,
}

const deleteSlice = createSlice({
    name:'deleteSlice',
    initialState,
    reducers: {},
    extraReducers:(builder) => {
        builder
    .addCase(deleteNote.pending,(state) => {
        state.deleteStatus = 'loading';
    })
    .addCase(deleteNote.fulfilled,(state) => {
        state.deleteStatus = 'succeeded';
    })
    .addCase(deleteNote.rejected,(state,action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload?.message || action.error.message || 'delete failed';
    })
    .addCase(deleteAssessment.pending,(state) => {
        state.deleteStatus = 'loading';
    })
    .addCase(deleteAssessment.fulfilled,(state) => {
        state.deleteStatus = 'succeeded';
    })
    .addCase(deleteAssessment.rejected,(state,action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload?.message || action.error.message || 'delete failed';
    })
    }
})

export default deleteSlice.reducer;
