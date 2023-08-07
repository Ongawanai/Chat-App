import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { deleteChannelModal, renameChannelModal } from '../slices/modalsSlice.js';
import { selectors as channelSelectors, setActiveChannel } from '../slices/channelsSlice.js';
import { getActiveChannel } from '../selectors/channelsSelector.js';

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector(channelSelectors.selectAll);

  const activeChannelId = useSelector(getActiveChannel);

  const channelClass = (channelId) => cn('w-100', 'text-start', 'btn', 'text-truncate', {
    'btn-secondary': activeChannelId === channelId,
  });

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
          <li key={currChanel.id} className="nav-item w-100">
            <Dropdown as={ButtonGroup} className="d-flex dropdown btn-group">
              <button
                onClick={() => dispatch(setActiveChannel(currChanel.id))}
                value={currChanel.name}
                type="button"
                className={channelClass(currChanel.id)}
              >
                <span className="me-1 non-clickable"># </span>
                {currChanel.name}
              </button>
              <Dropdown.Toggle
                className={`btn${currChanel.id === activeChannelId ? ' btn-secondary' : ''}`}
                variant="none"
                id="dropdown-split-basic"
              >
                <span className="visually-hidden">{t('channelManagment')}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="on-top">
                <Dropdown.Item onClick={deleteClick(currChanel.id)}>{t('delete')}</Dropdown.Item>
                <Dropdown.Item onClick={renameClick(currChanel.id)}>{t('renameButton')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        );
      }
      return (
        <li key={currChanel.id} className="nav-item w-100">
          <button
            onClick={() => dispatch(setActiveChannel(currChanel.id))}
            value={currChanel.name}
            type="button"
            className={channelClass(currChanel.id)}
          >
            <span className="me-1 non-clickable"># </span>
            {currChanel.name}
          </button>
        </li>
      );
    });
    return preparedChannels;
  };
  const preparedChannels = renderChannels();

  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 h-100 d-block">
      {preparedChannels}
    </ul>
  );
};

export default Channels;
