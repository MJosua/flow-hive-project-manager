
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Kanban from './pages/Kanban';
import Gantt from './pages/Gantt';
import Approvals from './pages/Approvals';
import Team from './pages/Team';
import Login from './pages/Login';
import Register from './pages/Register';
import DivisionManagement from './pages/DivisionManagement';
import UserManagement from './pages/UserManagement';
import { SearchProvider } from '@/contexts/SearchContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <SearchProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/kanban" element={<Kanban />} />
                  <Route path="/gantt" element={<Gantt />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/admin/divisions" element={<DivisionManagement />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                </Routes>
              </div>
            </Router>
          </SearchProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
