import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { selectors as channelSelector } from '../slices/channelsSlice.js';

export const getChannels = (state) => state.channels;

export const getActiveChannel = (state) => state.channels.activeChannel;

const AllChannels = () => useSelector(channelSelector.selectAll);

export const getActiveChannelInfo = createSelector(
  AllChannels,
  (state) => state.channels.activeChannel,
  (channels, activeChannel) => channels.find((channel) => channel.id === activeChannel),
);
