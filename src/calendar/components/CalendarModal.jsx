import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import {
    addHours,
    addYears,
    differenceInSeconds,
    isSameDay,
    setHours,
    setMinutes,
    setSeconds,
} from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';
import { useAlert, useCalendarStore, useUiStore } from '../../hooks';
import { getEnvVariables } from '../../helpers';

registerLocale('es', es);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

if (getEnvVariables().VITE_MODE !== 'test') {
    Modal.setAppElement('#root');
}

const initialForm = {
    title: '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 1),
};

export const CalendarModal = () => {
    const { showAlert } = useAlert();
    const { activeEvent, startSavingEvent, resetActiveEvent } =
        useCalendarStore();
    const { isDateModalOpen, closeDateModal } = useUiStore();

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formValues, setFormValues] = useState(initialForm);

    useEffect(() => {
        adjustDates();
    }, [formValues.start, formValues.end]);

    useEffect(() => {
        if (activeEvent) {
            setFormValues({
                ...activeEvent,
            });
        }
    }, [activeEvent]);

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';
        return formValues.title.length <= 0 ? 'is-invalid' : '';
    }, [formSubmitted, formValues.title]);

    const onInputChange = ({ target }) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onDateChanged = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event,
        });
    };

    const adjustDates = () => {
        if (formValues.start >= formValues.end) {
            setFormValues({
                ...formValues,
                end: addHours(formValues.start, 1),
            });
        }
    };

    const onCloseModal = () => {
        closeDateModal();
        if (!formValues.id) resetActiveEvent();
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);
        const difference = differenceInSeconds(
            formValues.end,
            formValues.start
        );
        if (isNaN(difference) || difference <= 0) {
            showAlert({
                title: 'Fechas incorrectas',
                text: 'Revisar las fechas ingresadas',
                icon: 'error',
                timer: 1500,
            });
            return;
        }
        if (formValues.title.length <= 0) return;

        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    };

    const calculateMinTimeStart = () => {
        const today = new Date();
        if (
            isSameDay(formValues.start, today) &&
            formValues.start.getHours() < today.getHours()
        ) {
            formValues.start = today;
        }
        return isSameDay(formValues.start, today)
            ? setHours(
                  setMinutes(formValues.start, new Date().getMinutes()),
                  new Date().getHours()
              )
            : setHours(setMinutes(setSeconds(formValues.start, 0), 0), 0);
    };

    const calculateMinTimeEnd = () => {
        return isSameDay(formValues.end, formValues.start)
            ? setHours(
                  setMinutes(formValues.start, formValues.start.getMinutes()),
                  formValues.start.getHours() + 0.5
              )
            : setHours(setMinutes(setSeconds(formValues.end, 0), 0), 0);
    };

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className='modal'
            overlayClassName='modal-fondo'
            closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className='container' onSubmit={onSubmit}>
                <div className='form-group mb-2'>
                    <label>Fecha y hora inicio</label>
                    <div className='mt-2'>
                        <DatePicker
                            minDate={new Date()}
                            selected={formValues.start}
                            className='form-control'
                            onChange={(event) => onDateChanged(event, 'start')}
                            dateFormat='Pp'
                            wrapperClassName='w-100'
                            locale='es'
                            timeCaption='Hora'
                            minTime={calculateMinTimeStart()}
                            maxTime={setHours(
                                setMinutes(addYears(new Date(), 1000), 30),
                                23
                            )}
                            showTimeSelect
                        />
                    </div>
                </div>

                <div className='form-group mb-2'>
                    <label>Fecha y hora fin</label>
                    <div className='mt-2'>
                        <DatePicker
                            minDate={formValues.start}
                            selected={formValues.end}
                            className='form-control'
                            onChange={(event) => onDateChanged(event, 'end')}
                            dateFormat='Pp'
                            wrapperClassName='w-100'
                            locale='es'
                            timeCaption='Hora'
                            minTime={calculateMinTimeEnd()}
                            maxTime={setHours(
                                setMinutes(addYears(new Date(), 1000), 30),
                                23
                            )}
                            showTimeSelect
                        />
                    </div>
                </div>

                <hr />
                <div className='form-group mb-2'>
                    <label>Titulo y notas</label>
                    <input
                        type='text'
                        className={`form-control ${titleClass}`}
                        placeholder='Título del evento'
                        name='title'
                        value={formValues.title}
                        onChange={onInputChange}
                        autoComplete='off'
                    />
                    <small id='emailHelp' className='form-text text-muted'>
                        Una descripción corta
                    </small>
                </div>

                <div className='form-group mb-2'>
                    <textarea
                        type='text'
                        className='form-control'
                        placeholder='Notas'
                        rows='5'
                        name='notes'
                        value={formValues.notes}
                        onChange={onInputChange}
                    ></textarea>
                    <small id='emailHelp' className='form-text text-muted'>
                        Información adicional
                    </small>
                </div>

                <button
                    type='submit'
                    className='btn btn-outline-primary btn-block'
                >
                    <i className='far fa-save'></i>
                    <span> Guardar</span>
                </button>
            </form>
        </Modal>
    );
};
