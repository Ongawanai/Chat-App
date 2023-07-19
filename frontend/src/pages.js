import React, { useEffect, useRef, useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './components/App';
import { actions as channelsActions } from './slices/channelsSlice';
import { actions as messagesActions } from './slices/messagesSlice';
import store from './slices/index.js';

export const Build404 = () => (
  <div id="error-page">
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
    const error = err ? <div className="invalid-tooltip">{err}</div> : null;
    return error;
  };

  return (
    <div className="col-12 col-md-8 col-xxl-6">
      <h1 className="text-center mb-4">Войти</h1>
      <div className="card shadow-sm">
        <div className="card-body row p-5">
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
              <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                <div className="form-floating mb-3">
                  <Field className="form-control" type="username" name="username" placeholder="Ваш Ник" />
                  <ErrorMessage name="username" component="div" />
                </div>
                <div className="form-floating mb-3">
                  <Field className="form-control" type="password" name="password" placeholder="Пароль" />
                  <ErrorMessage name="password" component="div" />
                </div>
                {renderError(errorMessage)}
                <div className="form-floating mb-3">
                  <button className="w-100 mb-3 btn btn-outline-primary" type="submit" disabled={isSubmitting}>
                    Войти
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="card-footer p-4">
          <div className="text-center">
            <span>Нет аккаунта?</span>
            {' '}
            <a href="/signup">Регистрация</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BuildPage = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    axios
      .get('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(channelsActions.setChannels(response.data.channels));
        dispatch(messagesActions.setMessages(response.data.messages));
      });
  }, []);
  const channels = Object.values(useSelector((state) => state.channels.channels));
  const messages = Object.values(useSelector((state) => state.messages.messages));
  const onChange = (e) => setName(e.target.value);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical border">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((channel) => (
              <li key={channel.id} className="nav-item w-100">
                <button type="button" className="w-100 rounded-0 text-start btn btn-secondary">
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>название канала</b>
              </p>
              <span className="text-muted">кол-во сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              Сообщения
            </div>
            <div className="mt-auto px-5 py-3">
              <form noValidate className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2 form-control"
                    value={name}
                    onChange={onChange}
                  />
                  <button type="submit" className="btn btn-group-vertical" disabled="">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                      />
                    </svg>
                    <span className="visually-hidden">Отправить</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
