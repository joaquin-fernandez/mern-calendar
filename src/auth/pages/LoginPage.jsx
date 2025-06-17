import { useEffect, useState } from 'react';
import { useAlert, useAuthStore, useForm } from '../../hooks';
import './LoginPage.css';

const loginFormFields = {
    loginEmail: '',
    loginPassword: '',
};

const registerFormFields = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPasswordConfirmation: '',
};

export const LoginPage = () => {
    const { showAlert } = useAlert();
    const { startLogin, startRegister, errorMessage } = useAuthStore();
    const [isSignUp, setIsSignUp] = useState(false);

    const {
        loginEmail,
        loginPassword,
        onInputChange: onLoginInputChange,
    } = useForm(loginFormFields);
    const {
        registerName,
        registerEmail,
        registerPassword,
        registerPasswordConfirmation,
        onInputChange: onRegisterInputChange,
    } = useForm(registerFormFields);

    const onLoginSubmit = (e) => {
        e.preventDefault();
        startLogin({ email: loginEmail, password: loginPassword });
    };

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        if (registerPassword !== registerPasswordConfirmation) {
            return showAlert({
                title: 'Las contraseñas no coinciden',
                text: 'Por favor, comprueba que las contraseñas sean iguales',
                icon: 'error',
            });
        }
        startRegister({
            email: registerEmail,
            password: registerPassword,
            name: registerName,
        });
    };

    useEffect(() => {
        if (errorMessage)
            showAlert({
                title: 'Error en la autenticación',
                text: errorMessage,
                icon: 'error',
                timer: 5000,
            });
    }, [errorMessage]);

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    };

    return (
        <div className='container login-container'>
            <div className='row justify-content-center'>
                {!isSignUp && (
                    <div className='col-md-6 login-form-1 animate__animated animate__fadeIn animate__faster'>
                        <h3>Ingreso</h3>
                        <form onSubmit={onLoginSubmit}>
                            <div className='form-group mb-2'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Correo'
                                    name='loginEmail'
                                    value={loginEmail}
                                    onChange={onLoginInputChange}
                                />
                            </div>
                            <div className='form-group mb-2'>
                                <input
                                    type='password'
                                    className='form-control'
                                    placeholder='Contraseña'
                                    name='loginPassword'
                                    value={loginPassword}
                                    onChange={onLoginInputChange}
                                />
                            </div>
                            <div className='d-grid mt-3'>
                                <input
                                    type='submit'
                                    className='btnSubmit'
                                    value='Ingresar'
                                />
                            </div>
                            <button
                                className='btnSignUp'
                                onClick={toggleSignUp}
                            >
                                No tengo cuenta aún
                            </button>
                        </form>
                    </div>
                )}

                {isSignUp && (
                    <div className='col-md-6 login-form-2 animate__animated animate__fadeIn animate__faster'>
                        <h3>Registro</h3>
                        <form onSubmit={onRegisterSubmit}>
                            <div className='form-group mb-2'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nombre'
                                    name='registerName'
                                    value={registerName}
                                    onChange={onRegisterInputChange}
                                />
                            </div>
                            <div className='form-group mb-2'>
                                <input
                                    type='email'
                                    className='form-control'
                                    placeholder='Correo'
                                    name='registerEmail'
                                    value={registerEmail}
                                    onChange={onRegisterInputChange}
                                />
                            </div>
                            <div className='form-group mb-2'>
                                <input
                                    type='password'
                                    className='form-control'
                                    placeholder='Contraseña'
                                    name='registerPassword'
                                    value={registerPassword}
                                    onChange={onRegisterInputChange}
                                />
                            </div>

                            <div className='form-group mb-2'>
                                <input
                                    type='password'
                                    className='form-control'
                                    placeholder='Repita la contraseña'
                                    name='registerPasswordConfirmation'
                                    value={registerPasswordConfirmation}
                                    onChange={onRegisterInputChange}
                                />
                            </div>

                            <div className='d-grid mt-3'>
                                <input
                                    type='submit'
                                    className='btnSubmit'
                                    value='Crear cuenta'
                                />
                            </div>
                            <button
                                className='btnSignIn'
                                onClick={toggleSignUp}
                            >
                                Ya tengo cuenta
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
