import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './components/App';
import resources from './locales/index.js';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import { io } from 'socket.io-client';
import { addChannel, setChannels, deleteChannel } from './slices/channelsSlice.js';
import { addMessage } from './slices/messagesSlice.js';
import SocketContext from './contexts/socketContext.js';

const init = async () => {
  const Socket = io('http://localhost:3000/');
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
  });

  const addNewChannel = (payload) => {
    store.dispatch(addChannel(payload));
  };

  const removeChannel = ({ id }) => {
    store.dispatch(deleteChannel(id));
  };

  const addNewMessage = (payload) => {
    store.dispatch(addMessage(payload));
  };

  const sendNewMessage = (data) => {
    console.log(data);
    Socket.emit('newMessage', data);
  };
  const sendNewChannel = (data) => {
    Socket.emit('newChannel', data);
  };
  const sendRemoveChannel = (data) => {
    Socket.emit('removeChannel', data);
  };
  const sendRenameChannel = (data) => {
    Socket.emit('renameChannel', data);
  };

  Socket.on('newMessage', addNewMessage);
  Socket.on('newChannel', addNewChannel);
  Socket.on('removeChannel', removeChannel);

  return (
    <Provider store={store}>
      <SocketContext.Provider
        value={{
          sendNewMessage,
          sendNewChannel,
          sendRemoveChannel,
          sendRenameChannel,
        }}
      >
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </SocketContext.Provider>
    </Provider>
  );
};

export default init;
