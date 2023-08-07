import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getActiveChannelInfo } from '../selectors/channelsSelector.js';
import { getActiveMessages } from '../selectors/messagesSelector.js';

const ChatHeader = () => {
  const { t } = useTranslation();

  const activeChannelMessages = useSelector(getActiveMessages);
  const activeChannel = useSelector(getActiveChannelInfo);
  const activeChannelName = activeChannel ? activeChannel.name : '';

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          #
          {' '}
          {activeChannelName}
        </b>
      </p>
      <span className="text-muted">
        {activeChannelMessages.length}
        {' '}
        {t('messages', { count: activeChannelMessages.length })}
      </span>
    </div>
  );
};

export default ChatHeader;
