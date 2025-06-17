import { useDispatch, useSelector } from 'react-redux';
import {
    clearActiveEvent,
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onSetActiveEvent,
    onUpdateEvent,
} from '../store';
import { calendarApi } from '../apis';
import { convertDateEvents, getErrorList } from '../helpers';
import { useAlert } from './useAlert';

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector((state) => state.calendar);
    const { user } = useSelector((state) => state.auth);
    const { showAlert } = useAlert();

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };

    const resetActiveEvent = () => {
        dispatch(clearActiveEvent());
    };

    const startSavingEvent = async (calendarEvent) => {
        try {
            if (calendarEvent.id) {
                // Update
                const { data } = await calendarApi.put(
                    `/events/${calendarEvent.id}`,
                    calendarEvent
                );
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            // Create
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(
                onAddNewEvent({ ...calendarEvent, id: data.event.id, user })
            );
        } catch (error) {
            showAlert({
                title: 'Error al guardar',
                text: getErrorList(error),
                icon: 'error',
                timer: 1500,
            });
        }
    };

    const startDeletingEvent = async () => {
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            showAlert({
                title: 'Error al eliminar',
                text: getErrorList(error),
                icon: 'error',
                timer: 1500,
            });
        }
    };

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertDateEvents(data.events);
            dispatch(onLoadEvents(events));
        } catch (error) {}
    };

    return {
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        setActiveEvent,
        resetActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents,
    };
};
