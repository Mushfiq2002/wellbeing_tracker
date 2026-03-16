import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sleepReducer from './slices/sleepSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sleep: sleepReducer,
    },
});
