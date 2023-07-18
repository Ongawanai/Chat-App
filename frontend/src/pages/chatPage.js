import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AddChannelModal } from '../modals/addChannel.js';
import { DeleteChannelModal } from '../modals/deleteChannel';
import { setActiveChannel, setChannels } from '../slices/channelsSlice.js';
import { setMessages } from '../slices/messagesSlice.js';
import { AddChannelButton } from '../components/AddChannelButton';
import { Channels } from '../components/Channels';
import { ChatHeader } from '../components/ChatHeader.jsx';
import { MessageBox } from '../components/MessageBox.jsx';
import { MessageForm } from '../components/MessageForm.jsx';
import AuthContext from '../contexts/authContext.js';
import { RenameChannelModal } from '../modals/renameChannel.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const BuildPage = () => {
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(setChannels(response.data.channels));
        dispatch(setActiveChannel(response.data.currentChannelId));
        dispatch(setMessages(response.data.messages));
      })
      .catch(function (error) {
        toast.error(t('dataError'));
      });
  }, []);

  const modals = useSelector((state) => state.modals);

  return (
    <div className='container h-100 my-4 overflow-hidden rounded shadow'>
      <div className='row h-100 bg-white flex-md-row'>
        <div className='col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>{t('channels')}</b>
            <AddChannelButton />
          </div>
          <Channels />
        </div>
        <div className='col p-0 h-100'>
          <div className='d-flex flex-column h-100'>
            <ChatHeader />
            <MessageBox />
            <MessageForm />
          </div>
        </div>
      </div>
      {modals.addChannel ? <AddChannelModal /> : null}
      {modals.deleteChannel ? <DeleteChannelModal /> : null}
      {modals.renameChannel ? <RenameChannelModal /> : null}
    </div>
  );
};
