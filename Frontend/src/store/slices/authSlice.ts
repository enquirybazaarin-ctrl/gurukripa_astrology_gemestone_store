import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  csrfToken: string | null;
  isInitializing: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  csrfToken: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string; csrfToken?: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      if (action.payload.csrfToken) {
        state.csrfToken = action.payload.csrfToken;
      }
    },
    setCsrfToken: (state, action: PayloadAction<string>) => {
      state.csrfToken = action.payload;
    },
    setInitialized: (state) => {
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.csrfToken = null;
      // We don't reset isInitializing on logout
    },
  },
});

export const { setCredentials, setCsrfToken, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
