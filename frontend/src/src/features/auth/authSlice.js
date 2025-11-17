import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../API/tokenAPI';
import axios from 'axios';


const API_URL = 'http://localhost:666/auth';



export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      const { message, accessToken, redirectTo, roleToken } = res.data;
      return { message, accessToken, redirectTo, roleToken };

    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);















export const selectRole = createAsyncThunk(
  'auth/selectRole',
  async ({ email, role }, { rejectWithValue }) => {
    try {
      console.log('API is called for now!');
      const res = await axios.post(
        `${API_URL}/select-role`,
        { email, role },
        { withCredentials: true }
      );
      const { accessToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);





















export const register = createAsyncThunk('auth/register', async({email,password}) => {
    const res = await axios.post(`${API_URL}/register`,{email,password},{withCredentials:true});
    return res.data.message;
});


export const logout = createAsyncThunk('auth/logout',async(_,{rejectWithValue}) => {
    try {
        const res = await axios.post(`${API_URL}/logout`,{},{withCredentials:true});
        return res.data.message;
    }   
    catch(error) {
        throw new Error(error.response?.data?.error || error.message);
    }
})

export const checkAuth = createAsyncThunk('auth/checkAuth', async(_,{dispatch,rejectWithValue})=>{
    const token = localStorage.getItem('accessToken');   

    try{
     const res = await api.get(`${API_URL}/check`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
     });

    return res.data;
    }
     catch(error) {

        return rejectWithValue({
            error: error.response?.data?.error || error.message,
            authenticated: error.response?.data?.authenticated,
            tokenExpired: error.response?.data?.tokenExpired
        });
    }});

    export const renewAccessToken = createAsyncThunk('auth/renewAccessToken', async(_,{rejectWithValue})=>{
    try{
     const res = await axios.post(`${API_URL}/renewAccessToken`,{},{withCredentials:true});
     const {accessToken} = res.data;
     localStorage.setItem('accessToken',accessToken)
        return res.data.message;

    }
     catch(error) {
        return rejectWithValue({
            error: error.response?.data?.error || error.message,
            authenticated: error.response?.data?.authenticated
        });
    }});

  export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (formData, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('accessToken');

        const res = await api.post(`${API_URL}/updateUser`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // important for file uploads
          },
        });

        const accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        return res.data; // should include updatedUser and accessToken
      } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
      }
    }
  );


export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/forgotPassword`, { email }, { withCredentials: true });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);



export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/resetPassword`,
        { token, newPassword },
        { withCredentials: true }
      );
      return res.data.message; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


const initialState = { 
    user:null,
    status:'idle',
    error:null,
    authenticated:null,
    loading:null,
    updateStatus:'idle',
    registerStatus : 'idle'
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout:(state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
            builder
        .addCase(login.pending,(state) => {
            state.loginStatus = 'loading';
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loginStatus = 'succeeded';
            state.authenticated = true;
        })
        .addCase(login.rejected,(state,action) => {
            state.loginStatus = 'failed';
            state.error = action.error.message;
        })
        .addCase(checkAuth.pending,(state)=>{
            state.loading = true;
        })
        .addCase(checkAuth.fulfilled,(state,action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.authenticated = action.payload.authenticated;
        })
        .addCase(checkAuth.rejected,(state,action)=>{
        state.error = action.payload?.error;
        state.loading = false;
        state.authenticated = action.error?.authenticated;

        })
        .addCase(register.pending,(state)=> {
            state.registerStatus = 'registering'
        })
        .addCase(register.fulfilled,(state) => {
            state.registerStatus = 'fulfilled'
        })
        .addCase(register.rejected,(state,action)=>{
            state.registerStatus = 'failed';
            state.error = action.error.message;
        })
        .addCase(logout.pending,(state,action) => {
            state.status = 'exiting';
        })
        .addCase(logout.fulfilled,(state) => {
            state.status = 'succeeded';
            localStorage.removeItem('accessToken');
        })
        .addCase(logout.rejected,(state) => {
            state.status = 'failed';
        })
        .addCase(updateUser.pending,(state)=>{
            state.status = 'updating';
        })
        .addCase(updateUser.fulfilled,(state,action)=>{
            state.status = 'updated';
            state.user = action.payload.updatedUser;
        })
        .addCase(updateUser.rejected,(state)=>{
            state.status = 'failed';
        })
        .addCase(forgotPassword.pending,(state) => {
            state.status = 'pending';
        })
        .addCase(forgotPassword.fulfilled,(state) => {
            state.status = 'succeeded';
        })
        .addCase(forgotPassword.rejected,(state) => {
            state.status = 'failed';
        })






        .addCase(selectRole.pending, (state) => {
           state.status = 'loading';
           state.error = null;
        })
        .addCase(selectRole.fulfilled, (state, action) => {
           state.status = 'succeeded';
           state.authenticated = true;
           state.accessToken = action.payload;

        })
        .addCase(selectRole.rejected, (state, action) => {
           state.status = 'failed';
           state.error = action.payload || action.error.message;
        });
    },
});

export default authSlice.reducer
