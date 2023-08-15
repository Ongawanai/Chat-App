/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addChannel: null,
  deleteChannel: null,
  renameChannel: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, { payload }) => {
      const [modalType, id] = payload;
      state[modalType] = id;
    },
    hideModal: (state, { payload }) => {
      state[payload] = null;
    },
  },
});

export const {
  showModal, hideModal, deleteChannelModal, renameChannelModal,
} = modalsSlice.actions;
export default modalsSlice.reducer;
