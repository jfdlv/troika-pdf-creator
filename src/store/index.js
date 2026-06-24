import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './characterSlice';
import authReducer from './authSlice';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    character: characterReducer,
    auth: authReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setCurrentUser'],
        ignoredPaths: ['auth.currentUser'],
      },
    }),
});
