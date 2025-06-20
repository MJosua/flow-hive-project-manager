
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import catalogReducer from './slices/catalogSlice';
import ticketsReducer from './slices/ticketsSlice';
import userManagementReducer from './slices/userManagementSlice';
import customFunctionReducer from './slices/customFunctionSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import pmUserReducer from './slices/pmUserSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    tickets: ticketsReducer,
    userManagement: userManagementReducer,
    customFunction: customFunctionReducer,
    projects: projectReducer,
    tasks: taskReducer,
    pmUser: pmUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
