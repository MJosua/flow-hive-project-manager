import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { loadPersistentUser } from "@/store/slices/authSlice";
import { Toaster } from '@/components/ui/toaster';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/login/Loginpage';

// Main pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ProjectCreate from './pages/ProjectCreate';
import Department from './pages/Department';
import Teams from './pages/Teams';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

// Project views
import Gantt from './pages/Gantt';
import Kanban from './pages/Kanban';
import TaskList from './pages/TaskList';
import MyTasks from './pages/MyTasks';

// 👇 Routes + useEffect logic inside a sub-component
function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPersistentUser());
  }, [dispatch]);

  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/create" element={<ProtectedRoute><ProjectCreate /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="/project/:id/gantt" element={<ProtectedRoute><Gantt /></ProtectedRoute>} />
          <Route path="/project/:id/kanban" element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
          <Route path="/department" element={<ProtectedRoute><Department /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster />
      </div>
    </Router>
  );
}

// 👇 Root component wraps everything with Redux Provider
function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
