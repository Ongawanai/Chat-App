import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.js';
import routes from '../routes.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const SignupSchema = Yup.object().shape({
    password: Yup.string().required(t('req')),
    username: Yup.string().required(t('req')),
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center row p-5">
              <h1 className="text-center mb-4">
                {t('login')}
                {' '}
              </h1>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={SignupSchema}
                onSubmit={async (values) => {
                  try {
                    const response = await axios.post(routes.loginPath(), values);
                    auth.logIn(response.data.token, response.data.username);
                    setErrorMessage('');
                    navigate(routes.chatPagePath());
                  } catch (error) {
                    setErrorMessage(t('wrongNameOrPass'));
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                    <div className="form-floating mb-3">
                      <Field className="form-control" type="username" id="username" name="username" placeholder="Ваш Ник" />
                      <label className="form-label" htmlFor="username">
                        {t('nickname')}
                      </label>
                      <ErrorMessage className="message-error" name="username" component="div" />
                    </div>
                    <div className="form-floating mb-3">
                      <Field className="form-control" type="password" id="password" name="password" placeholder="Пароль" />
                      <label className="form-label" htmlFor="password">
                        {t('password')}
                      </label>
                      <ErrorMessage className="message-error" name="password" component="div" />
                    </div>
                    <div className="form-floating mb-3">
                      {errorMessage ? <div className="message-error">{errorMessage}</div> : null}
                      <button className="w-100 mb-3 btn btn-outline-primary" type="submit" disabled={isSubmitting}>
                        {t('login')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('noAcc')}</span>
                {' '}
                <a href="/signup">{t('registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
