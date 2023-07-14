import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../slices/modalsSlice.js';
import { selectors as channelSelectors } from '../slices/channelsSlice.js';
import SocketContext from '../contexts/socketContext.js';

export const AddChannelModal = () => {
  const dispatch = useDispatch();
  const onHide = () => dispatch(hideModal('addChannel'));
  const channels = useSelector(channelSelectors.selectAll);

  const channelsNames = channels.map(({ name }) => name);

  const { sendNewChannel } = useContext(SocketContext);
  const channelSchema = Yup.object().shape({
    channel: Yup.string().required('Обязательное поле').notOneOf(channelsNames, 'Такой канал уже существует'),
  });

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ channel: '' }}
          validationSchema={channelSchema}
          onSubmit={(values) => {
            sendNewChannel({ name: values.channel });
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
  );
};
