
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config/sourceConfig';
import type { Project, ProjectMember, CustomAttribute } from '@/types/projectTypes';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  projectMembers: ProjectMember[];
  customAttributes: CustomAttribute[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    priority: string;
    department: string;
    manager: string;
  };
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  projectMembers: [],
  customAttributes: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    department: 'all',
    manager: 'all'
  }
};

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching project:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }: { id: number; data: Partial<Project> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating project:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return projectId;
    } catch (error: any) {
      console.error('Error deleting project:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

export const fetchProjectMembers = createAsyncThunk(
  'projects/fetchProjectMembers',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching project members:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project members');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    setProjectFilters: (state, action: PayloadAction<Partial<ProjectState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearProjectError: (state) => {
      state.error = null;
    },
    // Add dummy data for development
    useFallbackProjectData: (state) => {
      state.projects = [
        {
          project_id: 1,
          name: "Website Redesign",
          description: "Complete overhaul of company website with modern design and improved UX",
          status: "active",
          priority: "high",
          start_date: "2024-01-15",
          end_date: "2024-04-15",
          manager_id: 10098,
          manager_name: "Yosua Gultom",
          department_id: 10,
          department_name: "IT",
          created_date: "2024-01-10",
          updated_date: "2024-01-20",
          progress: 35,
          budget: 50000,
          estimated_hours: 800,
          actual_hours: 280
        },
        {
          project_id: 2,
          name: "Mobile App Development",
          description: "Native mobile application for iOS and Android platforms",
          status: "planning",
          priority: "medium",
          start_date: "2024-03-01",
          end_date: "2024-08-01",
          manager_id: 1001,
          manager_name: "Daniel Johanes",
          department_id: 10,
          department_name: "IT",
          created_date: "2024-02-15",
          updated_date: "2024-02-20",
          progress: 5,
          budget: 75000,
          estimated_hours: 1200
        },
        {
          project_id: 3,
          name: "Data Migration Project",
          description: "Migrate legacy systems to new cloud infrastructure",
          status: "completed",
          priority: "critical",
          start_date: "2023-10-01",
          end_date: "2023-12-31",
          manager_id: 10098,
          manager_name: "Yosua Gultom",
          department_id: 10,
          department_name: "IT",
          created_date: "2023-09-15",
          updated_date: "2024-01-02",
          progress: 100,
          budget: 120000,
          estimated_hours: 1500,
          actual_hours: 1650
        }
      ];
    }
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
        // Use fallback data when API fails
        projectSlice.caseReducers.useFallbackProjectData(state);
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
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.projectMembers = action.payload;
      });
  },
});

export const { 
  setCurrentProject, 
  setProjectFilters, 
  clearProjectError,
  useFallbackProjectData 
} = projectSlice.actions;

// Selectors
export const selectProjects = (state: any) => state.projects.projects;
export const selectCurrentProject = (state: any) => state.projects.currentProject;
export const selectProjectMembers = (state: any) => state.projects.projectMembers;
export const selectProjectsLoading = (state: any) => state.projects.isLoading;
export const selectProjectsError = (state: any) => state.projects.error;
export const selectProjectFilters = (state: any) => state.projects.filters;

export default projectSlice.reducer;
