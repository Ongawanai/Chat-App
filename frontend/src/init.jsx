import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './components/App';
import resources from './locales/index.js';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import { io } from 'socket.io-client';
import { addChannel, deleteChannel, renameChannel } from './slices/channelsSlice.js';
import { addMessage } from './slices/messagesSlice.js';
import SocketContext from './contexts/socketContext.js';
import filter from 'leo-profanity';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

const init = async () => {
  const Socket = io();
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
  });

  filter.loadDictionary(i18n.language);

  const rollbarConfig = {
    accessToken: '6a4f0b93d51648eda09e8d6633db082f',
    environment: 'testenv',
  };

  const addNewChannel = (payload) => {
    store.dispatch(addChannel(payload));
  };

  const removeChannel = ({ id }) => {
    store.dispatch(deleteChannel(id));
  };

  const addNewMessage = (payload) => {
    store.dispatch(addMessage(payload));
  };

  const changeChannelName = (payload) => {
    const { name, removable, id } = payload;
    store.dispatch(renameChannel({ id, changes: { name, removable } }));
  };

  const sendNewMessage = (data) => {
    Socket.emit('newMessage', data);
  };
  const sendNewChannel = (...args) =>
    new Promise((resolve, reject) => {
      Socket.emit(...args, (response) => {
        resolve(response.data);
      });
    });

  const sendRemoveChannel = (data) => {
    Socket.emit('removeChannel', data);
  };
  const sendRenameChannel = (data) => {
    Socket.emit('renameChannel', data);
  };

  const api = {
    sendChannel: (channel) => sendNewChannel('newChannel', channel),
  };

  Socket.on('newMessage', addNewMessage);
  Socket.on('newChannel', addNewChannel);
  Socket.on('removeChannel', removeChannel);
  Socket.on('renameChannel', changeChannelName);

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <SocketContext.Provider
            value={{
              sendNewMessage,
              sendNewChannel,
              sendRemoveChannel,
              sendRenameChannel,
              api,
            }}
          >
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </SocketContext.Provider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
