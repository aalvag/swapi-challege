import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getCharacters = createAsyncThunk(
  'characters/getCharacters',
  async (characters, thunkAPI) => {
    try {
      const { data } = await axios(characters);

      const homeworld = await axios(data.homeworld);

      const response = {
        ...data,
        homeworldName: homeworld.data.name
      };

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: 'Characters not found'
      });
    }
  }
);

export const charactersSlice = createSlice({
  name: 'characters',
  initialState: {
    characters: [],
    isLoading: false,
    error: null
  },
  extraReducers: builder => {
    builder.addCase(getCharacters.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCharacters.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.characters.push(action.payload);
    });
    builder.addCase(getCharacters.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  }
});
