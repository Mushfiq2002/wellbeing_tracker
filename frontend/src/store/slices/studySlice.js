import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

export const fetchStudySessions = createAsyncThunk(
    'study/fetchSessions',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/study/sessions');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch study sessions';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addStudySession = createAsyncThunk(
    'study/addSession',
    async (sessionData, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/study/sessions', sessionData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add study session';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchAcademicResults = createAsyncThunk(
    'study/fetchResults',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/study/results');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch academic results';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addAcademicResult = createAsyncThunk(
    'study/addResult',
    async (resultData, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/study/results', resultData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add academic result';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const studySlice = createSlice({
    name: 'study',
    initialState: {
        sessions: [],
        results: [],
        isLoading: false,
        isError: false,
        message: '',
    },
    reducers: {
        resetStudyState: (state) => {
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchStudySessions
            .addCase(fetchStudySessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStudySessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = action.payload;
            })
            .addCase(fetchStudySessions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // addStudySession
            .addCase(addStudySession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addStudySession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions.unshift(action.payload);
            })
            .addCase(addStudySession.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // fetchAcademicResults
            .addCase(fetchAcademicResults.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAcademicResults.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(fetchAcademicResults.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // addAcademicResult
            .addCase(addAcademicResult.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addAcademicResult.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results.unshift(action.payload);
            })
            .addCase(addAcademicResult.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetStudyState } = studySlice.actions;
export default studySlice.reducer;
