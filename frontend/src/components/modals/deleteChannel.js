import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { hideModal } from '../../slices/modalsSlice.js';
import SocketContext from '../../contexts/socketContext.js';

const DeleteChannelModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onHide = () => dispatch(hideModal('deleteChannel'));
  const channelId = useSelector((state) => state.modals.deleteChannel);

  const { sendRemoveChannel } = useContext(SocketContext);

  const deleteAndClose = () => {
    sendRemoveChannel({ id: channelId });
    onHide();
    toast.success(t('channelDeleted'));
  };
  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('youSure')}</p>
        <div className="d-flex justify-content-end">
          <button onClick={onHide} className="btn btn-secondary me-2" type="submit" value="remove">
            {t('cancel')}
          </button>
          <button onClick={deleteAndClose} className="btn btn-danger" type="submit" value="remove">
            {t('delete')}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteChannelModal;
