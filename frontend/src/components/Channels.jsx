import { useDispatch, useSelector } from 'react-redux';
import { selectors as channelSelectors, setActiveChannel } from '../slices/channelsSlice.js';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import cn from 'classnames';
import { deleteChannelModal, renameChannelModal } from '../slices/modalsSlice.js';
import { useTranslation } from 'react-i18next';

export const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector(channelSelectors.selectAll);

  const activeChannelId = useSelector((state) => state.channels.activeChannel);
  const activeChannel = channels.find((channel) => channel.id === activeChannelId);

  const channelClass = (channelName) =>
    cn('w-100', 'text-start', 'btn', 'text-truncate', {
      'btn-secondary': activeChannel.name === channelName,
    });

  const changeChannel = (e) => {
    e.preventDefault();
    const targetChannelName = e.target.value;
    const targetChannel = channels.find(({ name }) => name === targetChannelName);
    dispatch(setActiveChannel(targetChannel.id));
  };

  const deleteClick = (id) => () => {
    dispatch(deleteChannelModal(id));
  };

  const renameClick = (id) => () => {
    dispatch(renameChannelModal(id));
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
                <span className='me-1 non-clickable'># </span>
                {currChanel.name}
              </button>
              <Dropdown.Toggle
                className={`btn ${currChanel.name === activeChannel.name ? ' btn-secondary' : ''}`}
                variant='none'
                id='dropdown-split-basic'
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={deleteClick(currChanel.id)}>{t('delete')}</Dropdown.Item>
                <Dropdown.Item onClick={renameClick(currChanel.id)}>{t('renameButton')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        );
      }
      return (
        <li key={currChanel.id} className='nav-item w-100'>
          <button onClick={changeChannel} value={currChanel.name} type='button' className={channelClass(currChanel.name)}>
            <span className='me-1 non-clickable'># </span>
            {currChanel.name}
          </button>
        </li>
      );
    });
    return preparedChannels;
  };
  const preparedChannels = renderChannels();

  return (
    <ul id='channels-box' className='nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
      {preparedChannels}
    </ul>
  );
};
