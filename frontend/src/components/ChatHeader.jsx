import { useSelector } from 'react-redux';
import { selectors as messageSelectors } from '../slices/messagesSlice.js';
import { selectors as channelSelectors } from '../slices/channelsSlice.js';
import { useTranslation } from 'react-i18next';

export const ChatHeader = () => {
  const activeChannelId = useSelector((state) => state.channels.activeChannel);
  const messages = useSelector(messageSelectors.selectAll);
  const channels = useSelector(channelSelectors.selectAll);
  const { t } = useTranslation();

  const activeChannelMessages = messages.filter((message) => message.channelId === activeChannelId);
  const activeChannel = channels.find((channel) => channel.id === activeChannelId);
  const activeChannelName = activeChannel ? activeChannel.name : '';

  return (
    <div className='bg-light mb-4 p-3 shadow-sm small'>
      <p className='m-0'>
        <b># {activeChannelName}</b>
      </p>
      <span className='text-muted'>
        {activeChannelMessages.length} {t('messages', { count: activeChannelMessages.length })}
      </span>
    </div>
  );
};
