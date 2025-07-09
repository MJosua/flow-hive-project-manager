import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { apiService } from '@/services/apiService';

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
  hasCheckedAuth: boolean; // ✅ Add this
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isLocked: false,
  loginAttempts: 0,
  hasCheckedAuth: false, // ✅ Initial value
};

// ✅ Helper: Normalize user shape
const normalizeUser = (userData: any): User => ({
  user_id: userData.user_id,
  uid: userData.uid,
  username: userData.username ?? '',
  firstname: userData.firstname,
  lastname: userData.lastname,
  email: userData.email,
  role_name: userData.role_name ?? '',
  role_id: userData.role_id ?? 0,
  department_name: userData.department_name ?? '',
  department_id: userData.department_id ?? 0,
});

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string; asin?: string }) => {
    const response = await apiService.login({
      uid: credentials.username,
      password: credentials.password,
      asin: credentials.asin,
    });

    const normalizedUser = normalizeUser(response.userData);

    // ✅ Persist
    localStorage.setItem('tokek', response.tokek);
    localStorage.setItem('user', JSON.stringify(normalizedUser));

    return {
      user: normalizedUser,
      token: response.tokek,
    };
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
  const token = localStorage.getItem('tokek');

  if (userData && token) {
    const parsedUser = JSON.parse(userData);
    const normalizedUser = normalizeUser(parsedUser);

    console.log('[loadPersistentUser] Loaded from storage:', normalizedUser);
    return {
      user: normalizedUser,
      token: token,
    };
  }

  return null;
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('[authSlice] loginSuccess:', action.payload);
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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
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
        state.isLoading = true;
      })
      .addCase(loadPersistentUser.fulfilled, (state, action) => {
        if (action.payload?.user && action.payload?.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        state.hasCheckedAuth = true; // ✅ Always set to true
        state.isLoading = false;
      })
      .addCase(loadPersistentUser.rejected, (state) => {
        state.hasCheckedAuth = true; // ✅ Even if failed
        state.isLoading = false;
      });
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
},
});

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectHasCheckedAuth = (state: RootState) => state.auth.hasCheckedAuth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Exports
export const { loginSuccess, loginFailure, clearError, resetLoginAttempts } = authSlice.actions;
export default authSlice.reducer;
