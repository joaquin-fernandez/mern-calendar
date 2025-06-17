import Swal from 'sweetalert2';

const initialConfigConfirmAlert = {
    title: '',
    text: '',
    icon: 'warning',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    callback: null,
};

const initialConfigAlert = {
    title: '',
    text: '',
    icon: 'success',
    showConfirmButton: false,
    timer: undefined,
};

const parseErrors = (errors) => {
    return errors.map(({ error }) => `<li>${error}</li>`).join('');
};

export const useAlert = () => {
    const showConfirmAlert = (config = {}) => {
        config = Object.assign(initialConfigConfirmAlert, config);
        const { title, text, icon, confirm, cancel, callback } = config;
        Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonColor: '#cf332e',
            cancelButtonColor: '#1e5883',
            confirmButtonText: confirm,
            cancelButtonText: cancel,
        }).then((result) => {
            if (result.isConfirmed) {
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        });
    };

    const showAlert = (config = {}) => {
        config = Object.assign(initialConfigAlert, config);
        const { title, text, icon, timer, showConfirmButton } = config;
        Swal.fire({
            title,
            text: typeof text === 'string' ? text : '',
            html:
                typeof text === 'string'
                    ? ''
                    : `<ul style="list-style-type: '❌';">${parseErrors(
                          text
                      )}</ul>`,
            icon,
            showConfirmButton: showConfirmButton,
            timer,
        });
    };

    return { showConfirmAlert, showAlert };
};
