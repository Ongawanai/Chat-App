import { useSelector } from 'react-redux';
import { selectors as messageSelectors } from '../slices/messagesSlice.js';

export const MessageBox = () => {
  const messages = useSelector(messageSelectors.selectAll);
  const activeChannel = useSelector((state) => state.channels.activeChannel);

  const activeChannelMessages = messages.filter((message) => message.channelId === activeChannel);

  return (
    <div id='messages-box' className='chat-messages overflow-auto px-5'>
      <div className='text-break mb-2'>
        {activeChannelMessages.map((message) => (
          <p key={message.id}>
            <b>{message.username}</b>: {message.body}
          </p>
        ))}
      </div>
    </div>
  );
};
