import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../socket.js';
import { AddChannelModal } from '../modals/addChannel.js';
import { DeleteChannelModal } from '../modals/deleteChannel';
import { selectors as channelSelectors, setActiveChannel, setChannels } from '../slices/channelsSlice.js';
import { selectors as messageSelectors, setMessages } from '../slices/messagesSlice.js';
import { AddChannelButton } from '../components/AddChannelButton';
import modalsSlice from '../slices/modalsSlice';
import { Channels } from '../components/Channels';
import { ChatHeader } from '../components/ChatHeader.jsx';
import { MessageBox } from '../components/MessageBox.jsx';
import { MessageForm } from '../components/MessageForm.jsx';
import AuthContext from '../contexts/authContext.js';

export const BuildPage = () => {
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.currentChannelId);
        dispatch(setChannels(response.data.channels));
        dispatch(setActiveChannel(response.data.currentChannelId));
        dispatch(setMessages(response.data.messages));
      });
  }, []);

  /* useEffect(() => {
    const onDelete = (payload) => {
      dispatch(channelsActions.deleteChannel(payload.id));
      if (payload.id === channel.id) {
        setChannel({
          id: 1,
          name: 'general',
          removable: false,
        });
      }
    };
    const onAddMessage = (payload) => {
      dispatch(messagesActions.addMessage(payload));
    };
    const onAddChannel = (payload) => {
      dispatch(channelsActions.addChannel(payload));
      setChannel(payload);
    };

    socket.on('newMessage', onAddMessage);
    socket.on('newChannel', onAddChannel);
    socket.on('removeChannel', onDelete);

    return () => {
      socket.off('newMessage', onAddMessage);
      socket.off('newChannel', onAddChannel);
      socket.off('removeChannel', onDelete);
    };
  }, [channel]);
  */
  const messages = useSelector(messageSelectors.selectAll);

  const modals = useSelector((state) => state.modals);

  return (
    <div className='container h-100 my-4 overflow-hidden rounded shadow'>
      <div className='row h-100 bg-white flex-md-row'>
        <div className='col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>Каналы</b>
            <AddChannelButton />
          </div>
          <ul id='channels-box' className='nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
            <Channels />
          </ul>
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
    </div>
  );
};
