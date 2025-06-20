
import React, { useCallback } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayoutNew from "@/components/layout/AppLayoutNew";
import { useDynamicServiceRoutes } from "@/components/routing/DynamicServiceRoutes";
import TokenExpiredModalWrapper from "@/components/modals/TokenExpiredModalWrapper";
import Index from "./pages/Index";
import ServiceCatalog from "./pages/ServiceCatalog";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectCreate from "./pages/ProjectCreate";
import TaskDetail from "./pages/TaskDetail";
import TaskList from "./pages/TaskList";
import MyTasks from "./pages/MyTasks";
import MyTickets from "./pages/MyTickets";
import GoodsRequest from "./pages/GoodsRequest";
import SystemSettings from "./pages/admin/SystemSettings";
import UserManagement from "./pages/admin/UserManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import ServiceCatalogAdmin from "./pages/admin/ServiceCatalogAdmin";
import ServiceFormEditor from "./pages/admin/ServiceFormEditor";
import CustomFunctionManagement from "./pages/admin/CustomFunctionManagement";
import FunctionLogsManagement from "./pages/admin/FunctionLogsManagement";
import NotFound from "./pages/NotFound";
import Login from "./pages/login/Loginpage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TicketDetail from "./pages/TicketDetail";
import RecoveryForm from "./pages/login/form/Recoveryform";
import Gantt from '@/pages/Gantt';
import Kanban from '@/pages/Kanban';

// Create QueryClient instance outside of component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  // Use useCallback to prevent unnecessary re-renders of dynamic routes
  const handleFormSubmit = useCallback((data: any) => {
    // console.log('Form submitted:', data);
    // Handle form submission logic here
  }, []);

  const dynamicServiceRoutes = useDynamicServiceRoutes(handleFormSubmit);
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />

          <Route path="/forgot-password/:token" element={<RecoveryForm />} />

          <Route path="/service-catalog" element={
            <ProtectedRoute>
              <ServiceCatalog />
            </ProtectedRoute>
          } />

          {/* Dynamic service catalog routes */}
          {dynamicServiceRoutes}

          <Route path="/projects" element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          <Route path="/project/:id" element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          } />
          <Route path="/project/create" element={
            <ProtectedRoute>
              <ProjectCreate />
            </ProtectedRoute>
          } />
          <Route path="/task-list" element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          } />
          <Route path="/task/:id" element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          } />
          <Route path="/my-tasks" element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          } />
          <Route path="/kanban" element={
            <ProtectedRoute>
              <Kanban />
            </ProtectedRoute>
          } />
          <Route path="/gantt" element={
            <ProtectedRoute>
              <Gantt />
            </ProtectedRoute>
          } />
          <Route path="/my-tickets" element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          } />
          <Route path="/ticket/:id" element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          } />
          <Route path="/goods-request" element={
            <ProtectedRoute>
              <AppLayoutNew>
                <GoodsRequest />
              </AppLayoutNew>
            </ProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/system-settings" element={
            <ProtectedRoute>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/team-management" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/divisions" element={
            <ProtectedRoute>
              <DepartmentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute>
              <DepartmentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/service-catalog" element={
            <ProtectedRoute>
              <ServiceCatalogAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/service-catalog/create" element={
            <ProtectedRoute>
              <ServiceFormEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/service-catalog/edit/:id" element={
            <ProtectedRoute>
              <ServiceFormEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/custom-functions" element={
            <ProtectedRoute>
              <CustomFunctionManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/function-logs" element={
            <ProtectedRoute>
              <FunctionLogsManagement />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <AppLayoutNew>
              <NotFound />
            </AppLayoutNew>
          } />
        </Routes>
        
        <TokenExpiredModalWrapper />
      </BrowserRouter>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
