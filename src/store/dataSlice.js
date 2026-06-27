import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, collection, getDocs, getDoc, addDoc, setDoc } from 'firebase/firestore';
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

export const getBestiaryThunk = createAsyncThunk('data/getBestiary', async () => {
  const beasts = [];
  const querySnapshot = await getDocs(collection(database, 'bestiary'));
  querySnapshot.forEach((snapshot) => {
    beasts.push({ id: snapshot.id, ...snapshot.data() });
  });
  return beasts;
});

export const addBeastThunk = createAsyncThunk(
  'data/addBeast',
  async (beastData, { dispatch, rejectWithValue }) => {
    try {
      await addDoc(collection(database, 'bestiary'), beastData);
      await dispatch(getBestiaryThunk());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBackgroundThunk = createAsyncThunk(
  'data/updateBackground',
  async ({ id, ...backgroundData }, { dispatch, rejectWithValue }) => {
    try {
      await setDoc(doc(database, 'backgrounds', id), backgroundData);
      await dispatch(getBackgroundsThunk());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBeastThunk = createAsyncThunk(
  'data/updateBeast',
  async ({ id, ...beastData }, { dispatch, rejectWithValue }) => {
    try {
      await setDoc(doc(database, 'bestiary', id), beastData);
      await dispatch(getBestiaryThunk());
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

export const getSpellsThunk = createAsyncThunk('data/getSpells', async () => {
  const spells = [];
  const querySnapshot = await getDocs(collection(database, 'spells'));
  querySnapshot.forEach((snapshot) => {
    spells.push({ id: snapshot.id, ...snapshot.data() });
  });
  return spells;
});

export const addSpellThunk = createAsyncThunk(
  'data/addSpell',
  async (spellData, { dispatch, rejectWithValue }) => {
    try {
      await addDoc(collection(database, 'spells'), spellData);
      await dispatch(getSpellsThunk());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSpellThunk = createAsyncThunk(
  'data/updateSpell',
  async ({ id, ...spellData }, { dispatch, rejectWithValue }) => {
    try {
      await setDoc(doc(database, 'spells', id), spellData);
      await dispatch(getSpellsThunk());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState: { backgrounds: [], bestiary: [], spells: [], damageTable: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBackgroundsThunk.fulfilled, (state, action) => {
        state.backgrounds = action.payload;
      })
      .addCase(getBestiaryThunk.fulfilled, (state, action) => {
        state.bestiary = action.payload;
      })
      .addCase(getSpellsThunk.fulfilled, (state, action) => {
        state.spells = action.payload;
      })
      .addCase(getDamageTableThunk.fulfilled, (state, action) => {
        state.damageTable = action.payload;
      });
  },
});

export default dataSlice.reducer;
