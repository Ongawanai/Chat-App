import { Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { hideModal } from '../slices/modalsSlice';
import { selectors as channelSelectors } from '../slices/channelsSlice.js';
import * as Yup from 'yup';
import SocketContext from '../contexts/socketContext';

export const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const onHide = () => dispatch(hideModal('renameChannel'));

  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const channelId = useSelector((state) => state.modals.renameChannel);
  console.log(channelId);
  const { sendRenameChannel } = useContext(SocketContext);

  const channelSchema = Yup.object().shape({
    channel: Yup.string().required('Обязательное поле').notOneOf(channelsNames, 'Такой канал уже существует'),
  });

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ channel: '' }}
          validationSchema={channelSchema}
          onSubmit={(values) => {
            console.log(values.channel);
            sendRenameChannel({ id: channelId, name: values.channel });
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
                {errors.channel ? <div className='message-error'>{errors.channel}</div> : null}
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
