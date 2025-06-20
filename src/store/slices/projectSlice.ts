
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config/sourceConfig';
import type { Project, ProjectMember, CustomAttribute } from '@/types/projectTypes';

interface TaskGroup {
  group_id: number;
  project_id: number;
  name: string;
  description?: string;
  color?: string;
  order: number;
  created_date: string;
  updated_date: string;
}

interface ChatMessage {
  message_id: number;
  project_id: number;
  user_id: number;
  user_name: string;
  message: string;
  message_type: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  created_date: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  projectMembers: ProjectMember[];
  taskGroups: TaskGroup[];
  chatMessages: ChatMessage[];
  kanbanData: any;
  ganttData: any;
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
  taskGroups: [],
  chatMessages: [],
  kanbanData: null,
  ganttData: null,
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

// Updated to use PM endpoints
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/project`, {
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
      const response = await axios.get(`${API_URL}/prjct_mngr/project/${projectId}`, {
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
      const response = await axios.post(`${API_URL}/prjct_mngr/project`, projectData, {
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
      const response = await axios.put(`${API_URL}/prjct_mngr/project/${id}`, data, {
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
      await axios.delete(`${API_URL}/prjct_mngr/project/${projectId}`, {
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

// Project Members
export const fetchProjectMembers = createAsyncThunk(
  'projects/fetchProjectMembers',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/project/${projectId}/members`, {
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

export const addProjectMember = createAsyncThunk(
  'projects/addProjectMember',
  async ({ projectId, memberData }: { projectId: number; memberData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/prjct_mngr/project/${projectId}/members`, memberData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error adding project member:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add project member');
    }
  }
);

export const updateProjectMember = createAsyncThunk(
  'projects/updateProjectMember',
  async ({ projectId, userId, memberData }: { projectId: number; userId: number; memberData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/prjct_mngr/project/${projectId}/members/${userId}`, memberData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating project member:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update project member');
    }
  }
);

export const removeProjectMember = createAsyncThunk(
  'projects/removeProjectMember',
  async ({ projectId, userId }: { projectId: number; userId: number }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/prjct_mngr/project/${projectId}/members/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return { projectId, userId };
    } catch (error: any) {
      console.error('Error removing project member:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove project member');
    }
  }
);

// Task Groups
export const fetchTaskGroups = createAsyncThunk(
  'projects/fetchTaskGroups',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/project/${projectId}/groups`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching task groups:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task groups');
    }
  }
);

export const createTaskGroup = createAsyncThunk(
  'projects/createTaskGroup',
  async ({ projectId, groupData }: { projectId: number; groupData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/prjct_mngr/project/${projectId}/groups`, groupData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating task group:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create task group');
    }
  }
);

export const updateTaskGroup = createAsyncThunk(
  'projects/updateTaskGroup',
  async ({ projectId, groupId, groupData }: { projectId: number; groupId: number; groupData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/prjct_mngr/project/${projectId}/groups/${groupId}`, groupData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating task group:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update task group');
    }
  }
);

export const deleteTaskGroup = createAsyncThunk(
  'projects/deleteTaskGroup',
  async ({ projectId, groupId }: { projectId: number; groupId: number }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/prjct_mngr/project/${projectId}/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return { projectId, groupId };
    } catch (error: any) {
      console.error('Error deleting task group:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task group');
    }
  }
);

// Kanban Data
export const fetchKanbanData = createAsyncThunk(
  'projects/fetchKanbanData',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/project/${projectId}/kanban`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching kanban data:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch kanban data');
    }
  }
);

// Gantt Data
export const fetchGanttData = createAsyncThunk(
  'projects/fetchGanttData',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/project/${projectId}/gantt`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching gantt data:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gantt data');
    }
  }
);

// Chat Messages
export const fetchChatMessages = createAsyncThunk(
  'projects/fetchChatMessages',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/project/${projectId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching chat messages:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat messages');
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'projects/sendChatMessage',
  async ({ projectId, messageData }: { projectId: number; messageData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/prjct_mngr/project/${projectId}/messages`, messageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to send chat message');
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
      })
      .addCase(addProjectMember.fulfilled, (state, action) => {
        state.projectMembers.push(action.payload);
      })
      .addCase(updateProjectMember.fulfilled, (state, action) => {
        const index = state.projectMembers.findIndex(m => m.user_id === action.payload.user_id);
        if (index !== -1) {
          state.projectMembers[index] = action.payload;
        }
      })
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        state.projectMembers = state.projectMembers.filter(m => m.user_id !== action.payload.userId);
      })
      .addCase(fetchTaskGroups.fulfilled, (state, action) => {
        state.taskGroups = action.payload;
      })
      .addCase(createTaskGroup.fulfilled, (state, action) => {
        state.taskGroups.push(action.payload);
      })
      .addCase(updateTaskGroup.fulfilled, (state, action) => {
        const index = state.taskGroups.findIndex(g => g.group_id === action.payload.group_id);
        if (index !== -1) {
          state.taskGroups[index] = action.payload;
        }
      })
      .addCase(deleteTaskGroup.fulfilled, (state, action) => {
        state.taskGroups = state.taskGroups.filter(g => g.group_id !== action.payload.groupId);
      })
      .addCase(fetchKanbanData.fulfilled, (state, action) => {
        state.kanbanData = action.payload;
      })
      .addCase(fetchGanttData.fulfilled, (state, action) => {
        state.ganttData = action.payload;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.chatMessages = action.payload;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chatMessages.push(action.payload);
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
export const selectTaskGroups = (state: any) => state.projects.taskGroups;
export const selectChatMessages = (state: any) => state.projects.chatMessages;
export const selectKanbanData = (state: any) => state.projects.kanbanData;
export const selectGanttData = (state: any) => state.projects.ganttData;
export const selectProjectsLoading = (state: any) => state.projects.isLoading;
export const selectProjectsError = (state: any) => state.projects.error;
export const selectProjectFilters = (state: any) => state.projects.filters;

export default projectSlice.reducer;
