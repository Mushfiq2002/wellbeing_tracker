import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sleepReducer from './slices/sleepSlice';
import studyReducer from './slices/studySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sleep: sleepReducer,
        study: studyReducer,
    },
});
