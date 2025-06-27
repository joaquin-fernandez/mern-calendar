import { AppRouter } from '../../src/router/AppRouter';
import { render, screen } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { installGlobals } from '@remix-run/node';

installGlobals();

jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/calendar/pages/CalendarPage', () => ({
    CalendarPage: () => <div>Calendario</div>,
}));

describe('Pruebas en AppRouter', () => {
    const mockCheckAuthToken = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debe de mostrar la pantalla de carga y llamar al checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken,
        });

        render(<AppRouter />);

        expect(screen.getByText('Loading...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    });

    test('Debe de mostrar el login en caso de no estar autenticado', () => {
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken,
        });

        render(<AppRouter />);
        expect(screen.getByText('Ingresar')).toBeTruthy();
    });

    test('Debe de mostrar el calendario en caso de estar autenticado', () => {
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken,
        });

        render(<AppRouter />);
        expect(screen.getByText('Calendario')).toBeTruthy();
    });
});
