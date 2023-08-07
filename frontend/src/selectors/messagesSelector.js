import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { selectors as messageSelectors } from '../slices/messagesSlice.js';

export const getMessages = (state) => state.messages;

const allMessages = () => useSelector(messageSelectors.selectAll);

export const getActiveMessages = createSelector(
  allMessages,
  (state) => state.channels.activeChannel,
  (messages, activeChannel) => messages.filter((message) => message.channelId === activeChannel),
);
