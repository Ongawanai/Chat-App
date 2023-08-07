import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { selectors as channelSelector } from '../slices/channelsSlice.js';

export const getChannels = (state) => state.channels;

export const getActiveChannel = (state) => state.channels.activeChannel;

const allChannels = () => useSelector(channelSelector.selectAll);

export const getActiveChannelInfo = createSelector(
  allChannels,
  (state) => state.channels.activeChannel,
  (channels, activeChannel) => channels.find((channel) => channel.id === activeChannel),
);
