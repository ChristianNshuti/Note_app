import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    course:null,
    year:null
}

const setCourseSlice = createSlice({
    name:'setCourseSlice',
    initialState,
    reducers: {
        setCourse:(state,action) => {
            state.course = action.payload;
        },
        setYear:(state,action) => {
            state.year = action.payload;
        }
    },
});

export const { setCourse,setYear } = setCourseSlice.actions; 
export default setCourseSlice.reducer;


