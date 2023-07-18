import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../components/App';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const RegistrationPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const SignupSchema = Yup.object().shape({
    password: Yup.string().min(6, t('min6')).required(t('req')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('mustMatch'))
      .required(t('req')),
    username: Yup.string().min(3, t('min3')).max(20, t('max20')).required(t('req')),
  });
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
                  setErrorMessage(t('userExist'));
                } else {
                  setErrorMessage(error.response.data);
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className='col-12 col-md-6 mt-3 mt-mb-0'>
                <h1 className='text-center mb-4'>{t('login')}</h1>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='username' name='username' placeholder='Ваш Ник' />
                  <label className='form-label' for='username'>
                    {t('username')}
                  </label>
                  <ErrorMessage className='message-error' name='username' component='div' />
                </div>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='password' name='password' placeholder='Пароль' />
                  <label className='form-label' for='password'>
                    {t('password')}
                  </label>
                  <ErrorMessage className='message-error' name='password' component='div' />
                </div>
                <div className='form-floating mb-3'>
                  <Field className='form-control' type='password' name='confirmPassword' placeholder='Подтвердите пароль' />
                  <label className='form-label' for='confirmPassword'>
                    {t('confirmPassword')}
                  </label>
                  <ErrorMessage className='message-error' name='confirmPassword' component='div' />
                </div>
                <div className='form-floating mb-3'>
                  {errorMessage ? <div className='message-error'>{errorMessage}</div> : null}
                  <button className='w-100 mb-3 btn btn-outline-primary' type='submit' disabled={isSubmitting}>
                    {t('login')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
