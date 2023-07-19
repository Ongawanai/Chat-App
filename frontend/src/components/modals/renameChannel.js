import { Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useRef } from 'react';
import { hideModal } from '../../slices/modalsSlice';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import * as Yup from 'yup';
import SocketContext from '../../contexts/socketContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';

export const RenameChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onHide = () => dispatch(hideModal('renameChannel'));

  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const nameField = useRef(null);
  useEffect(() => {
    nameField.current.focus();
  }, []);

  const channelId = useSelector((state) => state.modals.renameChannel);
  const { sendRenameChannel } = useContext(SocketContext);
  const currentChannel = channels.find((channel) => channel.id === channelId);

  const channelSchema = Yup.object().shape({
    channel: Yup.string().required('Обязательное поле').notOneOf(channelsNames, 'Такой канал уже существует'),
  });

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('rename')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ channel: currentChannel.name }}
          validationSchema={channelSchema}
          onSubmit={(values) => {
            sendRenameChannel({ id: channelId, name: filter.clean(values.channel) });
            onHide();
            toast.success(t('channelRenamed'));
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
