import { parseISO } from 'date-fns';

export const convertDateEvents = (events) => {
    return events.map((event) => {
        const { start, end } = event;
        return {
            ...event,
            start: parseISO(start),
            end: parseISO(end),
        };
    });
};
