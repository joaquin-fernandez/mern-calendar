export const events = [
    {
        id: '1',
        title: 'Evento de prueba',
        notes: 'Este es un evento de prueba',
        start: new Date('2025-01-01 10:00:00'),
        end: new Date('2025-01-01 11:00:00'),
    },
    {
        id: '2',
        title: 'Evento de prueba 2',
        notes: 'Este es un evento de prueba 2',
        start: new Date('2025-01-02 10:00:00'),
        end: new Date('2025-01-02 11:00:00'),
    },
];

export const initialState = {
    events: [],
    activeEvent: null,
    isLoadingEvents: true,
};

export const calendarWithEventsState = {
    events: [...events],
    activeEvent: null,
    isLoadingEvents: false,
};

export const calendarWithActiveEventState = {
    events: [...events],
    activeEvent: { ...events[0] },
    isLoadingEvents: false,
};
