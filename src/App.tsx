
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from '@/components/ui/toaster';

// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/login/LoginPage';

// Main pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Department from './pages/Department';
import Teams from './pages/Teams';

// Project-specific pages
import Gantt from './pages/Gantt';
import Kanban from './pages/Kanban';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/gantt"
              element={
                <ProtectedRoute>
                  <Gantt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/kanban"
              element={
                <ProtectedRoute>
                  <Kanban />
                </ProtectedRoute>
              }
            />
            <Route
              path="/department"
              element={
                <ProtectedRoute>
                  <Department />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <ProtectedRoute>
                  <Teams />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
