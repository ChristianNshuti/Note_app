import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';

const API_URL = "http://localhost:666/filtered-assessments";

export const filterNP = createAsyncThunk('filter/filterNP',async(filters,thunkAPI)=> {
    try{
        const token = localStorage.getItem('accessToken');
        const res = await api.post(`${API_URL}/`,filters,{headers: {
            Authorization: `Bearer ${token}`
        }});
        return res.data.filteredTests;
    }catch(error){
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Something went wrong' });
    }
} )

const initialState = {
    filterStatus:'idle',
    filterError:[],
    filterData:[],
}

const filterSlice = createSlice({
    name:'filter',
    initialState,
    reducers:{},
    extraReducers: (builder)=>
        builder
    .addCase(filterNP.pending,(state)=>{
        state.filterStatus = "filtering";
    })
    .addCase(filterNP.fulfilled,(state,action)=>{
        state.filterStatus = "filtered";
        state.filterData=action.payload
    })
    .addCase(filterNP.rejected,(state,action)=>{
        state.filterStatus = "failed";
        state.filterError = action.payload.error;
    })}
)

export default filterSlice.reducer