import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser?.token,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload?.token;

      // 🔥 ONLY ONE SOURCE
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;