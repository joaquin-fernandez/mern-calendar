import { useAlert, useCalendarStore, useUiStore } from '../../hooks';

export const FabDelete = () => {
    const { showConfirmAlert } = useAlert();
    const { startDeletingEvent, hasEventSelected } = useCalendarStore();
    const { isDateModalOpen } = useUiStore();

    const handleClickDelete = () => {
        showConfirmAlert({
            title: 'Eliminar evento',
            text: 'Está seguro que desea eliminar este evento?',
            confirm: 'Eliminar',
            callback: startDeletingEvent,
        });
    };

    return (
        <button
            className='btn btn-danger fab-danger'
            onClick={handleClickDelete}
            style={{
                display: hasEventSelected && !isDateModalOpen ? '' : 'none',
            }}
        >
            <i className='fas fa-trash-alt'></i>
        </button>
    );
};
