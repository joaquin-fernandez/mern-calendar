import {
    onCloseDateModal,
    onOpenDateModal,
    uiSlice,
} from '../../../src/store/ui/uiSlice';

describe('Pruebas en uiSlice', () => {
    test('Debe de regresar el estado por defecto', () => {
        expect(uiSlice.getInitialState()).toEqual({
            isDateModalOpen: false,
        });
    });

    test('Debe de cambiar el estado de isDateModalOpen correctamente', () => {
        let state = uiSlice.getInitialState();
        state = uiSlice.reducer(state, onOpenDateModal());
        expect(state.isDateModalOpen).toBe(true);

        state = uiSlice.reducer(state, onCloseDateModal());
        expect(state.isDateModalOpen).toBe(false);
    });
});
