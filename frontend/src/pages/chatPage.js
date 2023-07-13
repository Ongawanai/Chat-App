import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import { socket } from '../socket.js';
import cn from 'classnames';
import { AddChannel } from '../modals/addChannel.js';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { ModalFooter } from 'react-bootstrap';
import { DeleteChannel } from '../modals/deleteChannel';
import { selectors as channelSelectors } from '../slices/channelsSlice.js';

export const BuildPage = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [modal, setModal] = useState(null);
  const [changingChannel, setChangingChannel] = useState('');
  const [channel, setChannel] = useState({
    id: 1,
    name: 'general',
    removable: false,
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(channelsActions.setChannels(response.data.channels));
        dispatch(messagesActions.setMessages(response.data.messages));
      });
  }, []);
  useEffect(() => {
    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });
    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
      setChannel(payload);
    });
    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.deleteChannel(payload.id));
      console.log(channel);
      if (payload.id === channel.id) {
        console.log(`pay: ${payload.id} id:${channel.id}`);
        setChannel({
          id: 1,
          name: 'general',
          removable: false,
        });
      }
    });
  });

  const channels = useSelector(channelSelectors.selectAll);
  const messages = useSelector((state) => state.messages.messages);
  const onChange = (e) => setName(e.target.value);

  const channelClass = (channelName) =>
    cn('w-100', 'rounded-0', 'text-start', 'btn', 'text-truncate', {
      'btn-secondary': channel.name === channelName,
    });

  const hideModal = () => setModal(null);

  const changeChannel = (e) => {
    e.preventDefault();
    const targetChannelName = e.target.value;
    const targetChannel = channels.find(({ name }) => name === targetChannelName);
    setChannel(targetChannel);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const message = e.target[0].value;
    const id = channel.id;
    console.log(channel);
    socket.emit('newMessage', { body: message, channelId: id, username: localStorage.username });
    setName('');
  };

  const removeChannel = (channelId) => {
    setChangingChannel(channelId);
    setModal('delete');
  };

  const renderModal = () => {
    if (!modal) {
      return null;
    }

    if (modal === 'delete') {
      console.log('heh');
      return <DeleteChannel channelId={changingChannel} onHide={hideModal} />;
    }

    return <AddChannel channels={channels} onHide={hideModal} />;
  };

  const renderChannels = () => {
    const preparedChannels = channels.map((currChanel) => {
      if (currChanel.removable) {
        return (
          <li key={currChanel.id} className='nav-item w-100'>
            <Dropdown as={ButtonGroup} className='d-flex dropdown btn-group'>
              <button
                onClick={changeChannel}
                value={currChanel.name}
                type='button'
                className={channelClass(currChanel.name)}
              >
                <span className='me-1'># </span>
                {currChanel.name}
              </button>
              <Dropdown.Toggle
                className={`rounded-0 btn ${currChanel.name === channel.name ? ' btn-secondary' : ''}`}
                variant='none'
                id='dropdown-split-basic'
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => removeChannel(currChanel.id)}>Удалить</Dropdown.Item>
                <Dropdown.Item href='#/action-2'>Переименовать</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        );
      }
      return (
        <li key={currChanel.id} className='nav-item w-100'>
          <button onClick={changeChannel} value={currChanel.name} type='button' className={channelClass(currChanel.name)}>
            <span className='me-1'># </span>
            {currChanel.name}
          </button>
        </li>
      );
    });
    return preparedChannels;
  };
  const preparedChannels = renderChannels();

  return (
    <div className='container h-100 my-4 overflow-hidden rounded shadow'>
      <div className='row h-100 bg-white flex-md-row'>
        <div className='col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>Каналы</b>
            <button type='button' onClick={() => setModal('add')} className='p-0 text-primary btn btn-group-vertical border'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='20' height='20' fill='currentColor'>
                <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z'></path>
                <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'></path>
              </svg>
              <span className='visually-hidden'>+</span>
            </button>
          </div>
          <ul id='channels-box' className='nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
            {preparedChannels}
          </ul>
        </div>
        <div className='col p-0 h-100'>
          <div className='d-flex flex-column h-100'>
            <div className='bg-light mb-4 p-3 shadow-sm small'>
              <p className='m-0'>
                <b># {channel.name}</b>
              </p>
              <span className='text-muted'>кол-во сообщений</span>
            </div>
            <div id='messages-box' className='chat-messages overflow-auto px-5'>
              {messages
                .filter((message) => message.channelId === channel.id)
                .map((message) => (
                  <p key={message.id}>
                    <b>{message.username}</b>: {message.body}
                  </p>
                ))}
            </div>
            <div className='mt-auto px-5 py-3'>
              <form onSubmit={sendMessage} noValidate className='py-1 border rounded-2'>
                <div className='input-group has-validation'>
                  <input
                    name='body'
                    aria-label='Новое сообщение'
                    placeholder='Введите сообщение...'
                    className='border-0 p-0 ps-2 form-control'
                    value={name}
                    onChange={onChange}
                  ></input>
                  <button type='submit' className='btn btn-group-vertical' disabled=''>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='20' height='20' fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'
                      ></path>
                    </svg>
                    <span className='visually-hidden'>Отправить</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          {renderModal(channels)}
        </div>
      </div>
    </div>
  );
};
