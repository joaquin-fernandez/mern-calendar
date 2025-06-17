import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useEffect, useState } from 'react';
import { localizer, getMessagesES } from '../../helpers';
import { useCalendarStore, useUiStore } from '../../hooks';
import { CalendarEvent, CalendarModal } from '../components';

export const CalendarBig = () => {
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
    const { openDateModal } = useUiStore();

    const [lastView, setLastView] = useState(
        localStorage.getItem('lastView') || 'week'
    );

    const eventStyleGetter = (event, start, end, isSelected) => {};

    const onDoubleClick = (event) => {
        openDateModal();
    };

    const onSelect = (event) => {
        setActiveEvent(event);
    };

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
    };

    useEffect(() => {
        startLoadingEvents();
    }, []);

    return (
        <>
            <Calendar
                culture='es'
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor='start'
                endAccessor='end'
                style={{ height: 'calc(100vh - 80px)', padding: 10 }}
                components={{
                    event: CalendarEvent,
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />
            <CalendarModal />
        </>
    );
};
