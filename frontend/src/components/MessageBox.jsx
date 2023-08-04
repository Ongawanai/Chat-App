import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { selectors as messageSelectors } from '../slices/messagesSlice.js';
import getChannels from '../selectors/channelsSelector.js';

const MessageBox = () => {
  const messages = useSelector(messageSelectors.selectAll);
  const { activeChannel } = useSelector(getChannels);
  const messageArea = useRef(null);

  useEffect(() => {
    messageArea.current.scrollTo(0, messageArea.current.scrollHeight);
  }, [activeChannel, messages]);

  const activeChannelMessages = messages.filter((message) => message.channelId === activeChannel);

  return (
    <div id="messages-box" ref={messageArea} className="chat-messages overflow-auto px-5">
      <div className="text-break mb-2">
        {activeChannelMessages.map((message) => (
          <p key={message.id}>
            <b>{message.username}</b>
            :
            {' '}
            {message.body}
          </p>
        ))}
      </div>
    </div>
  );
};

export default MessageBox;
