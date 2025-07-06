
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';

interface ProjectState {
  projects: any[];
  currentProject: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'supabaseProjects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getProjects();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch projects');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'supabaseProjects/fetchProjectById',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.getProjectDetail(projectId.toString());
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch project');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'supabaseProjects/createProject',
  async (projectData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.createProject(projectData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to create project');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'supabaseProjects/updateProject',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateProject(id.toString(), data);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to update project');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'supabaseProjects/deleteProject',
  async (projectId: number, { rejectWithValue }) => {
    try {
      await apiService.deleteProject(projectId.toString());
      return projectId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete project');
    }
  }
);

const supabaseProjectSlice = createSlice({
  name: 'supabaseProjects',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.project_id === action.payload.project_id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.project_id !== action.payload);
      });
  },
});

export const { setCurrentProject, clearError } = supabaseProjectSlice.actions;

// Selectors
export const selectSupabaseProjects = (state: any) => state.supabaseProjects.projects;
export const selectCurrentSupabaseProject = (state: any) => state.supabaseProjects.currentProject;
export const selectSupabaseProjectsLoading = (state: any) => state.supabaseProjects.isLoading;
export const selectSupabaseProjectsError = (state: any) => state.supabaseProjects.error;

export default supabaseProjectSlice.reducer;
