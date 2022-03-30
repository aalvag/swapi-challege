import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getFilms = createAsyncThunk('addFilm', async film => {
  try {
    const { data } = await axios(film);

    return data;
  } catch (error) {
    return [];
  }
});

export const filmsSlice = createSlice({
  name: 'films',
  initialState: {
    films: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearState: state => {
      state.films = [];
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(getFilms.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFilms.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.films.push(action.payload);
    });
    builder.addCase(getFilms.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  }
});
