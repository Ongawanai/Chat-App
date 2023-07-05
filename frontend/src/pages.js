import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './App';

export const Build404 = () => (
  <div id='error-page'>
    <h1>Oops!</h1>
    <p>Sorry, an unexpected error has occurred.</p>
    <p>
      <i>Not Found</i>
    </p>
  </div>
);

const SignupSchema = Yup.object().shape({
  password: Yup.string().min(5, 'Минимум 5 символов').max(20, 'Максимум 20 символов').required('Обязательное поле'),
  username: Yup.string().required('Обязательное поле'),
});

export const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const renderError = (err) => {
    const error = err ? <div className='invalid-tooltip'>{err}</div> : null;
    return error;
  };

  return (
    <div className='col-12 col-md-8 col-xxl-6'>
      <h1 className='text-center mb-4'>Войти</h1>
      <div className='card shadow-sm'>
        <div className='card-body row p-5'>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              try {
                const response = await axios.post('/api/v1/login', values);
                setErrorMessage('');
                localStorage.setItem('token', response.data.token);
                auth.logIn();
                navigate('/');
              } catch (error) {
                setErrorMessage('Неверные имя пользователя или пароль');
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className='col-12 col-md-6 mt-3 mt-mb-0'>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='username' name='username' placeholder='Ваш Ник' />
                  <ErrorMessage name='username' component='div' />
                </div>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='password' name='password' placeholder='Пароль' />
                  <ErrorMessage name='password' component='div' />
                </div>
                {renderError(errorMessage)}
                <div className='form-floating mb-3'>
                  <button className='w-100 mb-3 btn btn-outline-primary' type='submit' disabled={isSubmitting}>
                    Войти
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='card-footer p-4'>
          <div className='text-center'>
            <span>Нет аккаунта?</span> <a href='/signup'>Регистрация</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BuildPage = () => {
  const navigate = useNavigate();
  return <div>Good!</div>;
};
