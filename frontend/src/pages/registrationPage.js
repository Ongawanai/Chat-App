import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../components/App';
import { useNavigate } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  password: Yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Обязательное поле'),
  username: Yup.string().min(3, 'Минимум 3 символа').max(20, 'Максимум 20 символов').required('Обязательное поле'),
});

export const RegistrationPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  return (
    <div className='col-12 col-md-8 col-xxl-6'>
      <div className='card shadow-sm'>
        <div className='card-body d-flex flex-column flex-md-row justify-content-around align-items-center row p-5'>
          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              try {
                const { username, password } = values;
                const response = await axios.post('/api/v1/signup', { username, password });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                auth.logIn();
                setErrorMessage('');
                navigate('/');
              } catch (error) {
                if (error.response.status === 409) {
                  setErrorMessage('Такой пользователь уже существует');
                } else {
                  setErrorMessage(error.response.data);
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className='col-12 col-md-6 mt-3 mt-mb-0'>
                <h1 className='text-center mb-4'>Войти</h1>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='username' name='username' placeholder='Ваш Ник' />
                  <label className='form-label' for='username'>
                    Имя пользователя
                  </label>
                  <ErrorMessage className='message-error' name='username' component='div' />
                </div>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='password' name='password' placeholder='Пароль' />
                  <label className='form-label' for='password'>
                    Пароль
                  </label>
                  <ErrorMessage className='message-error' name='password' component='div' />
                </div>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='password' name='confirmPassword' placeholder='Подтвердите пароль' />
                  <label className='form-label' for='confirmPassword'>
                    Подтвердите пароль
                  </label>
                  <ErrorMessage className='message-error' name='confirmPassword' component='div' />
                </div>
                <div className='form-floating mb-3'>
                  {errorMessage ? <div className='message-error'>{errorMessage}</div> : null}
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
