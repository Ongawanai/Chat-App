import React from 'react';
import { Modal } from 'react-bootstrap';
import { socket } from '../socket.js';

export const DeleteChannel = (props) => {
  const { channelId, onHide } = props;
  const deleteAndClose = () => {
    socket.emit('removeChannel', { id: channelId });
    onHide();
  };
  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <button onClick={deleteAndClose} className='btn btn-danger' type='submit' value='remove'>
          Удалить
        </button>
      </Modal.Body>
    </Modal>
  );
};
