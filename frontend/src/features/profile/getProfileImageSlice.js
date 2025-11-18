// features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//API_URL
const API_URL = 'http://localhost:666/profile'

// Fetch single user image
export const fetchUserProfileImage = createAsyncThunk(
  "users/fetchUserProfileImage",
  async (userId, thunkAPI) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/${userId}/profile-image`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // send JWT
        },});
      const data = await res.json();
      return { [userId]: data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch multiple users images
export const fetchMultipleProfileImages = createAsyncThunk(
  "users/fetchMultipleProfileImages",
  async (userIds, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken"); 
      const res = await fetch(`${API_URL}/profile-images`,{
        method: "POST",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // send JWT
        },
        body: JSON.stringify({ userIds }),
      });
      const data = await res.json();
      // Convert array to object for easy lookup: { userId: {userId, name, profileImage} }
      const imagesMap = {};
      data.forEach(u => {
        imagesMap[u.userId] = u;
      });
      return imagesMap;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profiles: {}, // { userId: { userId, name, profileImage } }
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfileImage.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = { ...state.profiles, ...action.payload };
      })
      .addCase(fetchUserProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMultipleProfileImages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMultipleProfileImages.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = { ...state.profiles, ...action.payload };
      })
      .addCase(fetchMultipleProfileImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default profileSlice.reducer;
