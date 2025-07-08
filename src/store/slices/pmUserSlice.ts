
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config/sourceConfig';

interface PMUser {
  user_id: number;
  firstname: string;
  lastname: string;
  uid: string;
  email: string;
  role_id: number;
  role_name: string;
  department_id: number;
  department_name: string;
  team_id?: number;
  team_name?: string;
  job_title: string;
  jobtitle_id?: number;
  superior_id?: number;
  is_active: boolean;
  created_date: string;
  updated_date: string;
}

interface PMTeam {
  team_id: number;
  team_name: string;
  department_id: number;
  description?: string;
  team_leader_id?: number;
  team_leader_name?: string;
  member_count: number;
  created_date: string;
  updated_date: string;
}

interface PMDepartment {
  department_id: number;
  department_name: string;
  department_shortname: string;
  department_head?: number;
  head_name?: string;
  description?: string;
  is_active: boolean;
  created_date: string;
  updated_date: string;
}

interface PMUserState {
  users: PMUser[];
  teams: PMTeam[];
  departments: PMDepartment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PMUserState = {
  users: [],
  teams: [],
  departments: [],
  isLoading: false,
  error: null,
};

// Users
export const fetchPMUsers = createAsyncThunk(
  'pmUser/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pm/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching PM users:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const createPMUser = createAsyncThunk(
  'pmUser/createUser',
  async (userData: Partial<PMUser>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/pm/user`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating PM user:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const fetchPMUserDetail = createAsyncThunk(
  'pmUser/fetchUserDetail',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pm/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching PM user detail:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user detail');
    }
  }
);

export const updatePMUser = createAsyncThunk(
  'pmUser/updateUser',
  async ({ id, data }: { id: number; data: Partial<PMUser> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/pm/user/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating PM user:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deletePMUser = createAsyncThunk(
  'pmUser/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pm/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return userId;
    } catch (error: any) {
      console.error('Error deleting PM user:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Teams
export const fetchPMTeams = createAsyncThunk(
  'pmUser/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pm/user/teams`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching PM teams:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
    }
  }
);

export const createPMTeam = createAsyncThunk(
  'pmUser/createTeam',
  async (teamData: Partial<PMTeam>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/pm/user/teams`, teamData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating PM team:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create team');
    }
  }
);

export const updatePMTeam = createAsyncThunk(
  'pmUser/updateTeam',
  async ({ id, data }: { id: number; data: Partial<PMTeam> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/pm/user/teams/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating PM team:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update team');
    }
  }
);

export const deletePMTeam = createAsyncThunk(
  'pmUser/deleteTeam',
  async (teamId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pm/user/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return teamId;
    } catch (error: any) {
      console.error('Error deleting PM team:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete team');
    }
  }
);

// Departments
export const fetchPMDepartments = createAsyncThunk(
  'pmUser/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pm/user/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching PM departments:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const createPMDepartment = createAsyncThunk(
  'pmUser/createDepartment',
  async (departmentData: Partial<PMDepartment>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/pm/user/departments`, departmentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating PM department:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

export const updatePMDepartment = createAsyncThunk(
  'pmUser/updateDepartment',
  async ({ id, data }: { id: number; data: Partial<PMDepartment> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/pm/user/departments/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating PM department:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update department');
    }
  }
);

export const deletePMDepartment = createAsyncThunk(
  'pmUser/deleteDepartment',
  async (departmentId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pm/user/departments/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return departmentId;
    } catch (error: any) {
      console.error('Error deleting PM department:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
    }
  }
);

const pmUserSlice = createSlice({
  name: 'pmUser',
  initialState,
  reducers: {
    clearPMUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchPMUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPMUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchPMUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPMUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updatePMUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.user_id === action.payload.user_id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deletePMUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.user_id !== action.payload);
      })
      // Teams
      .addCase(fetchPMTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
      })
      .addCase(createPMTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(updatePMTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(t => t.team_id === action.payload.team_id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(deletePMTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(t => t.team_id !== action.payload);
      })
      // Departments
      .addCase(fetchPMDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      })
      .addCase(createPMDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
      })
      .addCase(updatePMDepartment.fulfilled, (state, action) => {
        const index = state.departments.findIndex(d => d.department_id === action.payload.department_id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      .addCase(deletePMDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter(d => d.department_id !== action.payload);
      });
  },
});

export const { clearPMUserError } = pmUserSlice.actions;

// Selectors
export const selectPMUsers = (state: any) => state.pmUser.users;
export const selectPMTeams = (state: any) => state.pmUser.teams;
export const selectPMDepartments = (state: any) => state.pmUser.departments;
export const selectPMUserLoading = (state: any) => state.pmUser.isLoading;
export const selectPMUserError = (state: any) => state.pmUser.error;

export default pmUserSlice.reducer;
