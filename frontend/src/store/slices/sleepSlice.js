import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// Fetch sleep logs for the logged-in user
export const fetchSleepLogs = createAsyncThunk(
    'sleep/fetchLogs',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/sleep');
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch sleep logs';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add a new sleep log
export const addSleepLog = createAsyncThunk(
    'sleep/addLog',
    async (sleepData, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/sleep', sleepData);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to add sleep log';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const sleepSlice = createSlice({
    name: 'sleep',
    initialState: {
        logs: [],
        isLoading: false,
        isError: false,
        message: '',
    },
    reducers: {
        resetSleepState: (state) => {
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchSleepLogs
            .addCase(fetchSleepLogs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSleepLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(fetchSleepLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // addSleepLog
            .addCase(addSleepLog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addSleepLog.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs.unshift(action.payload);
            })
            .addCase(addSleepLog.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetSleepState } = sleepSlice.actions;
export default sleepSlice.reducer;
