import React, { useContext, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../slices/modalsSlice.js';
import { selectors as channelSelectors } from '../slices/channelsSlice.js';
import SocketContext from '../contexts/socketContext.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onHide = () => dispatch(hideModal('addChannel'));
  const channels = useSelector(channelSelectors.selectAll);
  const nameField = useRef(null);
  useEffect(() => {
    nameField.current.focus();
  }, []);

  const channelsNames = channels.map(({ name }) => name);

  const { sendNewChannel } = useContext(SocketContext);
  const channelSchema = Yup.object().shape({
    channel: Yup.string().required(t('req')).notOneOf(channelsNames, t('channelExist')),
  });

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ channel: '' }}
          validationSchema={channelSchema}
          onSubmit={(values) => {
            sendNewChannel({ name: values.channel });
            onHide();
            toast.success(t('channelCreated'));
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
                  placeholder={t('channelName')}
                  innerRef={nameField}
                />
                {errors.channel ? <div className='message-error'>{errors.channel}</div> : null}
                <label className='visually-hidden' htmlFor='channel'>
                  {t('channelName')}
                </label>
              </div>
              <div className='d-flex justify-content-end'>
                <button type='button' className='me-2 btn btn-secondary' onClick={onHide}>
                  {t('cancel')}
                </button>
                <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
                  {t('send')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
