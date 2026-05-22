import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice';

const store = configureStore({
  reducer: {
    channels: channelsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
