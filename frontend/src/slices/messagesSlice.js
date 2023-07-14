import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { deleteChannel } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: messagesAdapter.setAll,
    addMessage: messagesAdapter.addOne,
    deleteMessages: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteChannel, (state, action) => {
      const channelId = action.payload.id;
      const restEntities = Object.values(state.entities).filter((e) => e.channelId !== channelId);
      messagesAdapter.setAll(state, restEntities);
    });
  },
});

export const { setMessages, addMessage, deleteMessages } = messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
