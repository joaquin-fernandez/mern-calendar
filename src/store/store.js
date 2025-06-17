import { configureStore } from '@reduxjs/toolkit';
import { calendarSlice } from './calendar';
import { uiSlice } from './ui';
import { authSlice } from './auth';

export const store = configureStore({
    reducer: {
        calendar: calendarSlice.reducer,
        ui: uiSlice.reducer,
        auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
