import { createSlice } from '@reduxjs/toolkit';

const characterSlice = createSlice({
  name: 'character',
  initialState: { characterInfo: {} },
  reducers: {
    setCharacterInfo(state, action) {
      state.characterInfo = action.payload;
    },
  },
});

export const { setCharacterInfo } = characterSlice.actions;
export default characterSlice.reducer;
