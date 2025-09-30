// lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
// import tenantReducer from './slices/tenantSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      // tenant: tenantReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // ignore common non-serializable action types (persist or custom)
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
