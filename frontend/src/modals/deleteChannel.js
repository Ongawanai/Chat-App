import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../slices/modalsSlice.js';
import SocketContext from '../contexts/socketContext.js';

export const DeleteChannelModal = () => {
  const dispatch = useDispatch();
  const onHide = () => dispatch(hideModal('deleteChannel'));
  const channelId = useSelector((state) => state.modals.deleteChannel);

  const { sendRemoveChannel } = useContext(SocketContext);

  const deleteAndClose = () => {
    sendRemoveChannel({ id: channelId });
    onHide();
  };
  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Вы уверены?</p>
        <button onClick={deleteAndClose} className='btn btn-danger' type='submit' value='remove'>
          Удалить
        </button>
      </Modal.Body>
    </Modal>
  );
};
