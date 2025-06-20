
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config/sourceConfig';
import type { Task, KanbanColumn } from '@/types/projectTypes';

interface TaskState {
  tasks: Task[];
  myTasks: Task[];
  kanbanColumns: KanbanColumn[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    priority: string;
    assignee: string;
    project: string;
  };
}

const initialState: TaskState = {
  tasks: [],
  myTasks: [],
  kanbanColumns: [
    { column_id: 'todo', name: 'To Do', status: 'todo', order: 1, color: '#94a3b8' },
    { column_id: 'in-progress', name: 'In Progress', status: 'in-progress', order: 2, color: '#3b82f6', limit: 3 },
    { column_id: 'review', name: 'Review', status: 'review', order: 3, color: '#f59e0b' },
    { column_id: 'done', name: 'Done', status: 'done', order: 4, color: '#10b981' }
  ],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    project: 'all'
  }
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { projectId?: number } = {}, { rejectWithValue }) => {
    try {
      const { projectId } = params;
      const url = projectId ? `${API_URL}/projects/${projectId}/tasks` : `${API_URL}/tasks`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchMyTasks = createAsyncThunk(
  'tasks/fetchMyTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/my-tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching my tasks:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: number; data: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating task:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }: { taskId: number; status: Task['status'] }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${taskId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating task status:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskFilters: (state, action: PayloadAction<Partial<TaskState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTaskError: (state) => {
      state.error = null;
    },
    moveTaskInKanban: (state, action: PayloadAction<{ taskId: number; newStatus: Task['status'] }>) => {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find(t => t.task_id === taskId);
      if (task) {
        task.status = newStatus;
      }
      const myTask = state.myTasks.find(t => t.task_id === taskId);
      if (myTask) {
        myTask.status = newStatus;
      }
    },
    // Add dummy data for development
    useFallbackTaskData: (state) => {
      state.myTasks = [
        {
          task_id: 1,
          project_id: 1,
          project_name: "Website Redesign",
          name: "Design Homepage Layout",
          description: "Create wireframes and mockups for the new homepage design",
          status: "in-progress",
          priority: "high",
          assigned_to: 10098,
          assigned_to_name: "Yosua Gultom",
          created_by: 10098,
          created_by_name: "Yosua Gultom",
          due_date: "2024-02-15",
          estimated_hours: 20,
          actual_hours: 12,
          created_date: "2024-01-15",
          updated_date: "2024-01-18",
          tags: ["design", "frontend"]
        },
        {
          task_id: 2,
          project_id: 1,
          project_name: "Website Redesign",
          name: "Backend API Development",
          description: "Implement REST APIs for content management",
          status: "todo",
          priority: "medium",
          assigned_to: 10098,
          assigned_to_name: "Yosua Gultom",
          created_by: 1001,
          created_by_name: "Daniel Johanes",
          due_date: "2024-02-28",
          estimated_hours: 40,
          created_date: "2024-01-16",
          updated_date: "2024-01-16",
          tags: ["backend", "api"]
        },
        {
          task_id: 3,
          project_id: 2,
          project_name: "Mobile App Development",
          name: "User Authentication Flow",
          description: "Implement login, register, and password reset functionality",
          status: "review",
          priority: "high",
          assigned_to: 10098,
          assigned_to_name: "Yosua Gultom",
          created_by: 1001,
          created_by_name: "Daniel Johanes",
          due_date: "2024-03-10",
          estimated_hours: 30,
          actual_hours: 28,
          created_date: "2024-02-01",
          updated_date: "2024-02-20",
          tags: ["mobile", "authentication"]
        }
      ];
      state.tasks = [...state.myTasks];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Use fallback data when API fails
        taskSlice.caseReducers.useFallbackTaskData(state);
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.myTasks = action.payload;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.error = action.payload as string;
        // Use fallback data when API fails
        taskSlice.caseReducers.useFallbackTaskData(state);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        if (action.payload.assigned_to === 10098) { // Current user ID
          state.myTasks.push(action.payload);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(t => t.task_id === action.payload.task_id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
        const myTaskIndex = state.myTasks.findIndex(t => t.task_id === action.payload.task_id);
        if (myTaskIndex !== -1) {
          state.myTasks[myTaskIndex] = action.payload;
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(t => t.task_id === action.payload.task_id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
        const myTaskIndex = state.myTasks.findIndex(t => t.task_id === action.payload.task_id);
        if (myTaskIndex !== -1) {
          state.myTasks[myTaskIndex] = action.payload;
        }
      });
  },
});

export const { 
  setTaskFilters, 
  clearTaskError, 
  moveTaskInKanban,
  useFallbackTaskData 
} = taskSlice.actions;

// Selectors
export const selectTasks = (state: any) => state.tasks.tasks;
export const selectMyTasks = (state: any) => state.tasks.myTasks;
export const selectKanbanColumns = (state: any) => state.tasks.kanbanColumns;
export const selectTasksLoading = (state: any) => state.tasks.isLoading;
export const selectTasksError = (state: any) => state.tasks.error;
export const selectTaskFilters = (state: any) => state.tasks.filters;

export default taskSlice.reducer;
