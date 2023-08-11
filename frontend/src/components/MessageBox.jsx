import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { selectors as messageSelectors } from '../slices/messagesSlice.js';
import { getActiveChannel } from '../selectors/channelsSelector.js';
import { getActiveMessages } from '../selectors/messagesSelector.js';

const MessageBox = () => {
  const activeChannel = useSelector(getActiveChannel);
  const activeChannelMessages = useSelector(getActiveMessages);
  const messages = useSelector(messageSelectors.selectAll);

  const messageArea = useRef(null);
  useEffect(() => {
    messageArea.current.scrollTo(0, messageArea.current.scrollHeight);
  }, [activeChannel, messages]);

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
