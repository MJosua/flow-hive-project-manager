
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/sourceConfig';

interface UserData {
  id: string;
  username: string;
  uid: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginAttempts: number;
  isLocked: boolean;
}

// Helper functions for persistent user storage
const persistUserData = (userData: UserData) => {
  localStorage.setItem('persistentUser', JSON.stringify({
    id: userData.id,
    username: userData.username,
    uid: userData.uid,
    email: userData.email
  }));
};

const getPersistentUserData = (): Partial<UserData> | null => {
  try {
    const stored = localStorage.getItem('persistentUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const clearPersistentUserData = () => {
  localStorage.removeItem('persistentUser');
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('tokek'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('tokek'),
  error: null,
  loginAttempts: 0,
  isLocked: false,
};

// Updated login thunk to use PM endpoint
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/hots_auth/pm/login`, {
        uid: username,
        asin: password,
      });

      if (response.data.success) {
        const { tokek, userData } = response.data;
        localStorage.setItem('tokek', tokek);
        localStorage.setItem('isAuthenticated', 'true');
        
        persistUserData(userData);
        
        return { token: tokek, userData };
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// New register thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (registerData: { uid: string; password: string; email: string; firstname: string; lastname: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/hots_auth/pm/register`, registerData);
      
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get profile thunk
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/hots_auth/pm/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update profile thunk
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<UserData>, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/hots_auth/pm/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Forgot password thunk
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/hots_auth/pm/forgot-password`, { email });
      
      if (response.data.success) {
        return response.data.message;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Reset password thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/hots_auth/pm/reset-password`, { token, password });
      
      if (response.data.success) {
        return response.data.message;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Updated logout thunk to use PM endpoint
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await axios.post(`${API_URL}/hots_auth/pm/logout`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tokek')}`,
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem('tokek');
  localStorage.removeItem('isAuthenticated');
  clearPersistentUserData();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.isLocked = false;
    },
    setLocked: (state) => {
      state.isLocked = true;
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
    loadPersistentUser: (state) => {
      const persistentData = getPersistentUserData();
      if (persistentData && !state.user?.uid) {
        state.user = { ...state.user, ...persistentData } as UserData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.userData;
        state.error = null;
        state.loginAttempts = 0;
        state.isLocked = false;
        
        persistUserData(action.payload.userData);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.loginAttempts += 1;

        if (action.payload && typeof action.payload === 'string' &&
          action.payload.includes('Too many login attempt')) {
          state.isLocked = true;
        }
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Profile cases
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        persistUserData(action.payload);
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loginAttempts = 0;
        state.isLocked = false;
      });
  },
});

export const { clearError, resetLoginAttempts, setLocked, clearToken, loadPersistentUser } = authSlice.actions;
export { getPersistentUserData };
export default authSlice.reducer;
