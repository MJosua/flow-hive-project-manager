
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLocked: boolean;
  loginAttempts: number;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('tokek'),
  isAuthenticated: !!localStorage.getItem('tokek'),
  isLoading: false,
  error: null,
  isLocked: false,
  loginAttempts: 0,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ uid, password }: { uid: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.login({ uid, password });
      if (response.success) {
        localStorage.setItem('tokek', response.tokek);
        return response;
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, asin }: { username: string; asin: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.login({ uid: username, password });
      if (response.success) {
        localStorage.setItem('tokek', response.tokek);
        return response;
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('tokek');
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('tokek');
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Helper functions
export const getPersistentUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.isLocked = false;
    },
    loadPersistentUser: (state) => {
      const userData = getPersistentUserData();
      if (userData) {
        state.user = userData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.userData;
        state.token = action.payload.tokek;
        state.isAuthenticated = true;
        state.loginAttempts = 0;
        state.isLocked = false;
        // Store user data persistently
        localStorage.setItem('userData', JSON.stringify(action.payload.userData));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.loginAttempts += 1;
        if (state.loginAttempts >= 5) {
          state.isLocked = true;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.userData;
        state.token = action.payload.tokek;
        state.isAuthenticated = true;
        state.loginAttempts = 0;
        state.isLocked = false;
        // Store user data persistently
        localStorage.setItem('userData', JSON.stringify(action.payload.userData));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.loginAttempts += 1;
        if (state.loginAttempts >= 5) {
          state.isLocked = true;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginAttempts = 0;
        state.isLocked = false;
        localStorage.removeItem('userData');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginAttempts = 0;
        state.isLocked = false;
        localStorage.removeItem('userData');
      });
  },
});

export const { clearError, setCredentials, resetLoginAttempts, loadPersistentUser } = authSlice.actions;

// Selectors
export const selectAuth = (state: any) => state.auth;
export const selectUser = (state: any) => state.auth.user;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: any) => state.auth.isLoading;
export const selectAuthError = (state: any) => state.auth.error;

export default authSlice.reducer;
