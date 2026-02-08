// lib/redux/slices/tenantSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserUIState {
  selectedUserId: string | null;
  lastSyncAt: string | null; // ISO string
  isOffline: boolean;
  listFilter: {
    q?: string; // search text
    active?: boolean | null;
    page?: number;
    pageSize?: number;
  };
  isSyncing: boolean;
}

const initialState: UserUIState = {
  selectedUserId: null,
  lastSyncAt: null,
  isOffline: false,
  listFilter: {
    q: undefined,
    active: null,
    page: 1,
    pageSize: 20,
  },
  isSyncing: false,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUserId(state, action: PayloadAction<string | null>) {
      state.selectedUserId = action.payload;
    },
    setLastSyncAt(state, action: PayloadAction<string | null>) {
      state.lastSyncAt = action.payload;
    },
    setOffline(state, action: PayloadAction<boolean>) {
      state.isOffline = action.payload;
    },
    setListFilter(
      state,
      action: PayloadAction<Partial<UserUIState["listFilter"]>>,
    ) {
      state.listFilter = { ...state.listFilter, ...action.payload };
    },
    setIsSyncing(state, action: PayloadAction<boolean>) {
      state.isSyncing = action.payload;
    },
    resetUserUI(state) {
      state.selectedUserId = null;
      state.lastSyncAt = null;
      state.isOffline = false;
      state.listFilter = initialState.listFilter;
      state.isSyncing = false;
    },
  },
});

export const {
  setSelectedUserId,
  setLastSyncAt,
  setOffline,
  setListFilter,
  setIsSyncing,
  resetUserUI,
} = UserSlice.actions;

export default UserSlice.reducer;
