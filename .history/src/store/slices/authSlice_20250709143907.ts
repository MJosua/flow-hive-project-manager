
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface User {
  user_id: number;
  uid: string;
  username?: string;
  firstname: string;
  lastname: string;
  email: string;
  role_name?: string;
  role_id?: number;
  department_name?: string;
  department_id?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLocked: boolean;
  loginAttempts: number;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isLocked: false,
  loginAttempts: 0,
};

import { apiService } from '@/services/apiService';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string; asin?: string }) => {
    try {
      const response = await apiService.login({
        uid: credentials.username,
        password: credentials.password,
        asin: credentials.asin,
      });
      return {
        user: response.userData,
        token: response.tokek,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('tokek');
  localStorage.removeItem('user');
  return null;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('tokek');
  localStorage.removeItem('user');
  return null;
});

export const loadPersistentUser = createAsyncThunk('auth/loadPersistentUser', async () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
});

export const getPersistentUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.loginAttempts = 0;
      state.isLocked = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.loginAttempts += 1;
      if (state.loginAttempts >= 3) {
        state.isLocked = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.isLocked = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;

          // ✅ Add this:
          localStorage.setItem('tokek', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Login failed';
        state.isLoading = false;
        state.loginAttempts += 1;
        if (state.loginAttempts >= 3) {
          state.isLocked = true;
        }
      })
      .addCase(loadPersistentUser.pending, (state) => {
        state.isLoading = true; // <-- indicate loading started
      })
      .addCase(loadPersistentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
        state.isLoading = false; // <-- loading finished
      })
      .addCase(loadPersistentUser.rejected, (state) => {
        state.isLoading = false; // handle fail
      });
  },
});

export const { loginSuccess, loginFailure, clearError, resetLoginAttempts } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
