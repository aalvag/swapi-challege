import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const { data } = await axios(
        `https://swapi.dev/api/people/?search=${username}`
      );
      if (data.results.length === 0) {
        return thunkAPI.rejectWithValue({
          message: 'User not found'
        });
      }
      const user = data.results[0];
      if (user.name !== username || user.hair_color !== password) {
        return thunkAPI.rejectWithValue({
          message: 'Username or password is incorrect'
        });
      } else {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: 'User not found'
      });
    }
  }
);

export const logoutUser = createAction('user/logout', () => {
  localStorage.removeItem('user');
  return {};
});

export const userLoginSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    isLoggedIn: false,
    error: null,
    loading: false
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.isLoggedIn = false;
      state.error = null;
      state.loading = true;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.error = null;
      state.loading = false;
      state.username = action.payload;
    },
    [loginUser.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.loading = false;
      state.error = action.payload;
    },
    [logoutUser]: (state, action) => {
      state.isLoggedIn = false;
      state.username = '';
    }
  }
});
