
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';

interface TaskState {
  tasks: any[];
  myTasks: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  myTasks: [],
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'supabaseTasks/fetchTasks',
  async (projectId: number | undefined, { rejectWithValue }) => {
    try {
      const filters = projectId ? { project_id: projectId } : {};
      const response = await apiService.getTasks(filters);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch tasks');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchMyTasks = createAsyncThunk(
  'supabaseTasks/fetchMyTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMyTasks();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch my tasks');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'supabaseTasks/createTask',
  async (taskData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.createTask(taskData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to create task');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'supabaseTasks/updateTask',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateTaskStatus(id.toString(), data);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to update task');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

const supabaseTaskSlice = createSlice({
  name: 'supabaseTasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
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
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.myTasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
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
      });
  },
});

export const { clearError } = supabaseTaskSlice.actions;

// Selectors
export const selectSupabaseTasks = (state: any) => state.supabaseTasks.tasks;
export const selectSupabaseMyTasks = (state: any) => state.supabaseTasks.myTasks;
export const selectSupabaseTasksLoading = (state: any) => state.supabaseTasks.isLoading;
export const selectSupabaseTasksError = (state: any) => state.supabaseTasks.error;

export default supabaseTaskSlice.reducer;
