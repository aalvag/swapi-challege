import { configureStore } from '@reduxjs/toolkit';

import { charactersSlice } from '../features/characters.js/characters';
import { filmsSlice } from '../features/films/filmsSlice';
import { userLoginSlice } from '../features/user/userLoginSlice';

const userFromLocalStorage =
  typeof window !== 'undefined'
    ? localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
    : null;

const initialState = {
  user: { username: userFromLocalStorage }
};

export const store = configureStore({
  reducer: {
    user: userLoginSlice.reducer,
    films: filmsSlice.reducer,
    characters: charactersSlice.reducer
  },
  preloadedState: initialState,
  devTools: import.meta.env.MODE !== 'production'
});
