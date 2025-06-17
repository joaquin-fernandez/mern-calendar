import { createSlice } from '@reduxjs/toolkit';

// const tempEvent = { //Example
//     _id: new Date().getTime(),
//     title: 'My Event',
//     notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
//     start: new Date(),
//     end: addHours(new Date(), 2),
// };

const initialState = {
    events: [],
    activeEvent: null,
    isLoadingEvents: true,
};

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push(payload);
            state.activeEvent = null;
        },
        onUpdateEvent: (state, { payload }) => {
            const index = state.events.findIndex(
                (event) => event.id === payload.id
            );
            state.events[index] = payload;
        },
        onDeleteEvent: (state) => {
            if (state.activeEvent) {
                state.events = state.events.filter(
                    (event) => event.id !== state.activeEvent.id
                );
                state.activeEvent = null;
            }
        },
        clearActiveEvent: (state) => {
            state.activeEvent = null;
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.isLoadingEvents = false;
            payload.forEach((event) => {
                const exists = state.events.some(
                    (dbEvent) => dbEvent.id === event.id
                );
                if (!exists) state.events.push(event);
            });
        },
        onLogoutCalendar: (state) => {
            state.events = [];
            state.activeEvent = null;
            state.isLoadingEvents = true;
        },
    },
});

export const {
    onSetActiveEvent,
    onAddNewEvent,
    onUpdateEvent,
    onDeleteEvent,
    clearActiveEvent,
    onLoadEvents,
    onLogoutCalendar,
} = calendarSlice.actions;
