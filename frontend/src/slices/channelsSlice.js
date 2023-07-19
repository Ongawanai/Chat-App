import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  activeChannel: 1,
  changingChannel: '',
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: channelsAdapter.setAll,
    addChannel: channelsAdapter.addOne,
    deleteChannel: (state, { payload }) => {
      if (state.activeChannel === payload) {
        state.activeChannel = 1;
      }
      channelsAdapter.removeOne(state, payload);
    },
    setChangingChannel: (state, { payload }) => {
      state.changingChannel = payload;
    },
    setActiveChannel: (state, { payload }) => {
      state.activeChannel = payload;
    },
    renameChannel: channelsAdapter.updateOne,
  },
});

export const {
  setChannels, addChannel, deleteChannel, setActiveChannel, setChangingChannel, renameChannel,
} = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
