import { fireEvent, render, screen } from '@testing-library/react';
import { FabDelete } from '../../../src/calendar';
import { useCalendarStore } from '../../../src/hooks/useCalendarStore';
import { useUiStore } from '../../../src/hooks/useUiStore';
import * as useAlertHook from '../../../src/hooks/useAlert';

jest.mock('../../../src/hooks/useCalendarStore');
jest.mock('../../../src/hooks/useUiStore');

describe('Pruebas en FabDelete', () => {
    const mockShowConfirmAlert = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debe renderizar el componente', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: false,
        });

        useUiStore.mockReturnValue({
            isDateModalOpen: false,
        });

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain('btn-danger');
        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('none');
    });

    test('Debe de mostrar el botón si hay evento seleccionado y el modal no está abierto', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
        });

        useUiStore.mockReturnValue({
            isDateModalOpen: false,
        });

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain('btn-danger');
        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('');
    });

    test('Debe de mostrar el modal si se le hace click al boton de eliminar', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
        });

        useUiStore.mockReturnValue({
            isDateModalOpen: false,
        });

        const spy = jest
            .spyOn(useAlertHook, 'useAlert')
            .mockImplementation(() => ({
                showConfirmAlert: mockShowConfirmAlert,
            }));

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click(btn);
        expect(mockShowConfirmAlert).toHaveBeenCalled();
        spy.mockRestore();
    });
});
