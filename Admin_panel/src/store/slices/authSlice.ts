import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: localStorage.getItem('admin_token'),
  csrfToken: localStorage.getItem('admin_csrf_token'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; csrfToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.csrfToken = action.payload.csrfToken || null;
      state.isAuthenticated = true;
      localStorage.setItem('admin_token', action.payload.token);
      localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
      if (action.payload.csrfToken) {
        localStorage.setItem('admin_csrf_token', action.payload.csrfToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.csrfToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_csrf_token');
      localStorage.removeItem('admin_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
