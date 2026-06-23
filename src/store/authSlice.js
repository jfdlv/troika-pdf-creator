import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

export const signOutThunk = createAsyncThunk('auth/signOut', async () => {
  await signOut(auth);
});

export const updateCharacterThunk = createAsyncThunk(
  'auth/updateCharacter',
  async ({ uid, characterInfo }, { rejectWithValue }) => {
    try {
      const { id, ...data } = characterInfo;
      const docRef = doc(database, 'userCharacters', uid, 'characters', id);
      await updateDoc(docRef, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCharacterThunk = createAsyncThunk(
  'auth/addCharacter',
  async ({ uid, characterInfo }, { rejectWithValue }) => {
    try {
      const charactersRef = collection(database, 'userCharacters', uid, 'characters');
      await addDoc(charactersRef, { ...characterInfo });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { currentUser: null },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
