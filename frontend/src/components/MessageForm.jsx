import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SocketContext from '../contexts/socketContext';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

export const MessageForm = () => {
  const [name, setName] = useState('');
  const { t } = useTranslation();
  const activeChannel = useSelector((state) => state.channels.activeChannel);
  const messageInput = useRef(null);
  useEffect(() => {
    messageInput.current.focus();
  }, [activeChannel]);

  const username = localStorage.getItem('username');
  const { sendNewMessage } = useContext(SocketContext);

  const onChange = (e) => setName(e.target.value);

  const sendMessage = (e) => {
    e.preventDefault();
    const message = filter.clean(e.target[0].value);
    sendNewMessage({ body: message, channelId: activeChannel, username });
    setName('');
  };

  return (
    <div className='mt-auto px-5 py-3'>
      <form onSubmit={sendMessage} noValidate className='py-1 border rounded-2'>
        <div className='input-group has-validation'>
          <input
            ref={messageInput}
            name='body'
            aria-label={t('newMessage')}
            placeholder={t('writeMessage')}
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
            <span className='visually-hidden'>{t('send')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
