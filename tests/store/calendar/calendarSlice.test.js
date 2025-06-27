import {
    calendarSlice,
    clearActiveEvent,
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onLogoutCalendar,
    onSetActiveEvent,
    onUpdateEvent,
} from '../../../src/store/calendar/calendarSlice';
import {
    calendarWithActiveEventState,
    calendarWithEventsState,
    events,
    initialState,
} from '../../fixtures/calendarStates';

describe('Pruebas en calendarSlice', () => {
    test('Debe de regresar el estado por defecto', () => {
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
    });

    test('onSetActiveEvent debe de activar el evento', () => {
        const state = calendarSlice.reducer(
            calendarWithEventsState,
            onSetActiveEvent(events[0])
        );
        expect(state).toEqual(calendarWithActiveEventState);
    });

    test('onAddNewEvent debe de agregar el evento', () => {
        const newEvent = {
            id: '3',
            title: 'Evento de prueba 3',
            notes: 'Este es un evento de prueba 3',
            start: new Date('2025-01-03 10:00:00'),
            end: new Date('2025-01-03 11:00:00'),
        };
        const state = calendarSlice.reducer(
            calendarWithEventsState,
            onAddNewEvent(newEvent)
        );
        expect(state.events).toEqual([...events, newEvent]);
    });

    test('onUpdateEvent debe de actualizar el evento', () => {
        const event = {
            id: '1',
            title: 'Evento de prueba 1 (Actualizado)',
            notes: 'Este es un evento de prueba 1 (Actualizado)',
            start: new Date('2025-01-01 12:00:00'),
            end: new Date('2025-01-01 13:00:00'),
        };
        const state = calendarSlice.reducer(
            calendarWithEventsState,
            onUpdateEvent(event)
        );
        expect(state.events[0]).toEqual(event);
    });

    test('onDeleteEvent debe de eliminar el evento y limpiar el activeEvent', () => {
        const state = calendarSlice.reducer(
            calendarWithActiveEventState,
            onDeleteEvent()
        );
        expect(state.events).toEqual([events[1]]);
        expect(state.activeEvent).toBeNull();
    });

    test('clearActiveEvent debe de limpiar el activeEvent', () => {
        const state = calendarSlice.reducer(
            calendarWithActiveEventState,
            clearActiveEvent()
        );
        expect(state.activeEvent).toBeNull();
    });

    test('onLoadEvents debe de cargar los eventos', () => {
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        expect(state).toEqual(calendarWithEventsState);
    });

    test('onLogoutCalendar debe de volver a un estado inicial', () => {
        const state = calendarSlice.reducer(
            calendarWithActiveEventState,
            onLogoutCalendar()
        );
        expect(state).toEqual(initialState);
    });
});
