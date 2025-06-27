import { act, renderHook } from '@testing-library/react';
import { useUiStore } from '../../src/hooks/useUiStore';
import { Provider } from 'react-redux';
import { uiSlice } from '../../src/store';
import { configureStore } from '@reduxjs/toolkit';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            calendar: null,
            ui: uiSlice.reducer,
            auth: null,
        },
        preloadedState: {
            ui: { ...initialState },
        },
    });
};

describe('Pruebas en useUiStore', () => {
    test('Debe de regresar el estado por defecto', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function),
        });
    });

    test('openDateModal debe de colocar en true el isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        const { openDateModal } = result.current;
        act(() => {
            openDateModal();
        });
        expect(result.current.isDateModalOpen).toBe(true);
    });

    test('closeDateModal debe de colocar en false el isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        const { closeDateModal } = result.current;
        act(() => {
            closeDateModal();
        });
        expect(result.current.isDateModalOpen).toBe(false);
    });

    test('toggleDateModal debe de cambiar el isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        act(() => {
            result.current.toggleDateModal();
        });
        expect(result.current.isDateModalOpen).toBe(true);
        act(() => {
            result.current.toggleDateModal();
        });
        expect(result.current.isDateModalOpen).toBe(false);
    });
});
