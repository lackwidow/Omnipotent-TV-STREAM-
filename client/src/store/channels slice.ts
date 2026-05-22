import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  group: string;
}

interface ChannelsState {
  list: Channel[];
  loading: boolean;
  error: string | null;
}

const initialState: ChannelsState = {
  list: [],
  loading: false,
  error: null
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setChannels, setLoading, setError } = channelsSlice.actions;
export default channelsSlice.reducer;
