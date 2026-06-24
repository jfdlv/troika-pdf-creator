import { createSlice } from '@reduxjs/toolkit';

const characterSlice = createSlice({
  name: 'character',
  initialState: { characterInfo: {} },
  reducers: {
    setCharacterInfo(state, action) {
      state.characterInfo = action.payload;
    },
    updateAdvancedSkillRank(state, action) {
      const { key, rank } = action.payload;
      state.characterInfo.background.advancedSkills[key] = rank;
    },
    updateWeaponDamage(state, action) {
      const { weapon, values } = action.payload;
      if (!state.characterInfo.customDamageValues) {
        state.characterInfo.customDamageValues = {};
      }
      state.characterInfo.customDamageValues[weapon] = values;
    },
  },
});

export const { setCharacterInfo, updateAdvancedSkillRank, updateWeaponDamage } = characterSlice.actions;
export default characterSlice.reducer;
