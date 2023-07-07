import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, { payload }) => {
      state.channels = payload;
    },
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
