import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';

export default configureStore({
  reducer: {
    //messages: messagesReducer,
    channels: channelsReducer,
  },
});
