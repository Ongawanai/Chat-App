import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { socket } from '../socket.js';

export const AddChannel = (props) => {
  const channels = props.channels;
  const onHide = props.onHide;

  const [errorMessage, setErrorMessage] = useState(null);
  const renderError = (err) => {
    const error = err ? <div className='invalid-feedback'>{err}</div> : null;
    return error;
  };
  const channelsNames = channels.map((channel) => channel.name);
  const channelSchema = Yup.object().shape({
    channel: Yup.string().required('Обязательное поле').notOneOf(channelsNames, 'Такой канал уже существует'),
  });

  return (
    <>
      <Modal show onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={{ channel: '' }}
            validationSchema={channelSchema}
            onSubmit={(values) => {
              socket.emit('newChannel', { name: values.channel });
              setErrorMessage('');
              onHide();
            }}
          >
            {({ errors, isSubmitting }) => (
              <Form>
                <div className='form-floating mb-3'>
                  <Field
                    className='mb-2 form-control'
                    id='channel'
                    type='channel'
                    name='channel'
                    placeholder='Название канала'
                    autoFocus
                  />
                  {errors.channel ? <div className='invalid'>{errors.channel}</div> : null}
                  <label className='visually-hidden' htmlFor='channel'>
                    Название канала
                  </label>
                </div>
                <div className='d-flex justify-content-end'>
                  <button type='button' className='me-2 btn btn-secondary' onClick={onHide}>
                    Отменить
                  </button>
                  <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
                    Отправить
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};
