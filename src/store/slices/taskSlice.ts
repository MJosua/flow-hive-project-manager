
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config/sourceConfig';
import type { Task, KanbanColumn } from '@/types/projectTypes';

interface TaskDependency {
  dependency_id: number;
  task_id: number;
  depends_on_task_id: number;
  dependency_type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  created_date: string;
}

interface TimeEntry {
  entry_id: number;
  task_id: number;
  user_id: number;
  user_name?: string;
  hours: number;
  description?: string;
  entry_date: string;
  created_date: string;
}

interface TaskAttachment {
  attachment_id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_by: number;
  uploaded_by_name?: string;
  created_date: string;
}

interface TaskState {
  tasks: Task[];
  myTasks: Task[];
  currentTask: Task | null;
  taskDependencies: TaskDependency[];
  timeEntries: TimeEntry[];
  taskAttachments: TaskAttachment[];
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
  currentTask: null,
  taskDependencies: [],
  timeEntries: [],
  taskAttachments: [],
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

// Updated to use PM endpoints
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { projectId?: number } = {}, { rejectWithValue }) => {
    try {
      const url = `${API_URL}/prjct_mngr/task`;
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
      const response = await axios.get(`${API_URL}/prjct_mngr/task/my-tasks`, {
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

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching task:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/prjct_mngr/task`, taskData, {
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
      const response = await axios.put(`${API_URL}/prjct_mngr/task/${id}`, data, {
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
      const response = await axios.patch(`${API_URL}/prjct_mngr/task/${taskId}/status`, { status }, {
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

export const moveTaskToGroup = createAsyncThunk(
  'tasks/moveTaskToGroup',
  async ({ taskId, groupId }: { taskId: number; groupId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/prjct_mngr/task/${taskId}/move-group`, { groupId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error moving task to group:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to move task to group');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/prjct_mngr/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return taskId;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

// Task Dependencies
export const fetchTaskDependencies = createAsyncThunk(
  'tasks/fetchTaskDependencies',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/task/${taskId}/dependencies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching task dependencies:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task dependencies');
    }
  }
);

export const addTaskDependency = createAsyncThunk(
  'tasks/addTaskDependency',
  async ({ taskId, dependsOnTaskId, dependencyType }: { taskId: number; dependsOnTaskId: number; dependencyType: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/prjct_mngr/task/${taskId}/dependencies`, 
        { depends_on_task_id: dependsOnTaskId, dependency_type: dependencyType }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error adding task dependency:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add task dependency');
    }
  }
);

export const removeTaskDependency = createAsyncThunk(
  'tasks/removeTaskDependency',
  async ({ taskId, depId }: { taskId: number; depId: number }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/prjct_mngr/task/${taskId}/dependencies/${depId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return { taskId, depId };
    } catch (error: any) {
      console.error('Error removing task dependency:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove task dependency');
    }
  }
);

// Time Tracking
export const fetchTimeEntries = createAsyncThunk(
  'tasks/fetchTimeEntries',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/task/${taskId}/time-entries`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching time entries:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch time entries');
    }
  }
);

export const logTime = createAsyncThunk(
  'tasks/logTime',
  async ({ taskId, timeData }: { taskId: number; timeData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/prjct_mngr/task/${taskId}/time-entries`, timeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error logging time:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to log time');
    }
  }
);

export const updateTimeEntry = createAsyncThunk(
  'tasks/updateTimeEntry',
  async ({ entryId, timeData }: { entryId: number; timeData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/prjct_mngr/task/time-entries/${entryId}`, timeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating time entry:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update time entry');
    }
  }
);

export const deleteTimeEntry = createAsyncThunk(
  'tasks/deleteTimeEntry',
  async (entryId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/prjct_mngr/task/time-entries/${entryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return entryId;
    } catch (error: any) {
      console.error('Error deleting time entry:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete time entry');
    }
  }
);

// File Attachments
export const fetchTaskAttachments = createAsyncThunk(
  'tasks/fetchTaskAttachments',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/prjct_mngr/task/${taskId}/attachments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching task attachments:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task attachments');
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  'tasks/uploadAttachment',
  async ({ taskId, formData }: { taskId: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/prjct_mngr/task/${taskId}/attachments`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error uploading attachment:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to upload attachment');
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  'tasks/deleteAttachment',
  async (attachmentId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/prjct_mngr/task/attachments/${attachmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokek')}`,
        }
      });
      return attachmentId;
    } catch (error: any) {
      console.error('Error deleting attachment:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete attachment');
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
        taskSlice.caseReducers.useFallbackTaskData(state);
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.myTasks = action.payload;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.error = action.payload as string;
        taskSlice.caseReducers.useFallbackTaskData(state);
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        if (action.payload.assigned_to === 10098) {
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
      })
      .addCase(moveTaskToGroup.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(t => t.task_id === action.payload.task_id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.task_id !== action.payload);
        state.myTasks = state.myTasks.filter(t => t.task_id !== action.payload);
      })
      .addCase(fetchTaskDependencies.fulfilled, (state, action) => {
        state.taskDependencies = action.payload;
      })
      .addCase(addTaskDependency.fulfilled, (state, action) => {
        state.taskDependencies.push(action.payload);
      })
      .addCase(removeTaskDependency.fulfilled, (state, action) => {
        state.taskDependencies = state.taskDependencies.filter(d => d.dependency_id !== action.payload.depId);
      })
      .addCase(fetchTimeEntries.fulfilled, (state, action) => {
        state.timeEntries = action.payload;
      })
      .addCase(logTime.fulfilled, (state, action) => {
        state.timeEntries.push(action.payload);
      })
      .addCase(updateTimeEntry.fulfilled, (state, action) => {
        const index = state.timeEntries.findIndex(e => e.entry_id === action.payload.entry_id);
        if (index !== -1) {
          state.timeEntries[index] = action.payload;
        }
      })
      .addCase(deleteTimeEntry.fulfilled, (state, action) => {
        state.timeEntries = state.timeEntries.filter(e => e.entry_id !== action.payload);
      })
      .addCase(fetchTaskAttachments.fulfilled, (state, action) => {
        state.taskAttachments = action.payload;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.taskAttachments.push(action.payload);
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.taskAttachments = state.taskAttachments.filter(a => a.attachment_id !== action.payload);
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
export const selectCurrentTask = (state: any) => state.tasks.currentTask;
export const selectTaskDependencies = (state: any) => state.tasks.taskDependencies;
export const selectTimeEntries = (state: any) => state.tasks.timeEntries;
export const selectTaskAttachments = (state: any) => state.tasks.taskAttachments;
export const selectKanbanColumns = (state: any) => state.tasks.kanbanColumns;
export const selectTasksLoading = (state: any) => state.tasks.isLoading;
export const selectTasksError = (state: any) => state.tasks.error;
export const selectTaskFilters = (state: any) => state.tasks.filters;

export default taskSlice.reducer;
