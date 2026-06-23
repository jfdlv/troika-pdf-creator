import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, collection, getDocs, getDoc, addDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

export const getBackgroundsThunk = createAsyncThunk('data/getBackgrounds', async () => {
  const backgrounds = [];
  const querySnapshot = await getDocs(collection(database, 'backgrounds'));
  querySnapshot.forEach((snapshot) => {
    backgrounds.push({ id: snapshot.id, ...snapshot.data() });
  });
  return backgrounds;
});

export const addBackgroundThunk = createAsyncThunk(
  'data/addBackground',
  async (backgroundData, { dispatch, rejectWithValue }) => {
    try {
      await addDoc(collection(database, 'backgrounds'), backgroundData);
      await dispatch(getBackgroundsThunk());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDamageTableThunk = createAsyncThunk('data/getDamageTable', async () => {
  const docRef = doc(database, 'util', 'damageTable');
  const snapshot = await getDoc(docRef);
  return snapshot.data();
});

const dataSlice = createSlice({
  name: 'data',
  initialState: { backgrounds: [], damageTable: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBackgroundsThunk.fulfilled, (state, action) => {
        state.backgrounds = action.payload;
      })
      .addCase(getDamageTableThunk.fulfilled, (state, action) => {
        state.damageTable = action.payload;
      });
  },
});

export default dataSlice.reducer;
