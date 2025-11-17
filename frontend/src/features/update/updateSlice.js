import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';

const API_URL = 'https://note-app-backend-rh2b.onrender.com/update';

export const updateNote = createAsyncThunk('update/updateNote', async ({noteId,file,description}, thunkAPI) => {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('noteId', noteId);
    formData.append('file', file);
    formData.append('description',description);
    try {
      const res = await api.put(`${API_URL}/updateNote`,formData,{headers: {
            Authorization: `Bearer ${token}`
        },
     });
      return res.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
    }
  });

  export const updateAssessment = createAsyncThunk('update/updateAssessment', async ({AssessmentId,file,description}, thunkAPI) => {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('AssessmentId', AssessmentId);
    formData.append('file', file);
    formData.append('description',description);
    try {
      const res = await api.put(`${API_URL}/updateAssessment`, formData,{headers: {
            Authorization: `Bearer ${token}`
        },
     });
      return res.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
    }
  });
  

const initialState = {
    updateStatus:'idle',
    updateError:null,
}

const updateSlice = createSlice({
    name:'updateSlice',
    initialState,
    reducers: {},
    extraReducers:(builder) => {
        builder
    .addCase(updateNote.pending,(state) => {
        state.updateStatus = 'loading';
    })
    .addCase(updateNote.fulfilled,(state) => {
        state.updateStatus = 'succeeded';
    })
    .addCase(updateNote.rejected,(state,action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload?.message || action.error.message || 'delete failed';
    })
    .addCase(updateAssessment.pending,(state) => {
        state.deleteStatus = 'loading';
    })
    .addCase(updateAssessment.fulfilled,(state) => {
        state.updateStatus = 'succeeded';
    })
    .addCase(updateAssessment.rejected,(state,action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload?.message || action.error.message || 'delete failed';
    })
    }
})

export default updateSlice.reducer;
