
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Project, Task, Approval, Notification, ProjectRole } from '@/types';
import { mockProjects, mockTasks, mockApprovals, mockNotifications, mockProjectRoles } from '@/data/mockData';
import { useUsers } from '@/hooks/useApiData';

interface AppContextType {
  applicationName: string;
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  approvals: Approval[];
  notifications: Notification[];
  projectRoles: ProjectRole[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  createProject: (project: Omit<Project, 'id'>) => void;
  createTask: (task: Omit<Task, 'id'>) => void;
  updateApproval: (approvalId: string, status: 'approved' | 'rejected', notes?: string) => void;
  updateProjectRole: (userId: string, projectId: string, updates: Partial<ProjectRole>) => void;
  addProjectRole: (role: Omit<ProjectRole, 'id'>) => void;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { data: apiUsers, isLoading, error: usersError } = useUsers();
  
  const [applicationName] = useState("Template Application Name");
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>(mockProjectRoles);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Use API data if available, fallback to empty array
  const users = apiUsers || [];
  // Safely get the first user, but handle the case where there are no users
  const currentUser = users.length > 0 ? users[0] : null;
  const error = usersError ? (usersError as Error).message : null;

  console.log('AppContext - currentUser:', currentUser);
  console.log('AppContext - users:', users);
  console.log('AppContext - isLoading:', isLoading);
  console.log('AppContext - error:', error);

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const createProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const createTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateApproval = (approvalId: string, status: 'approved' | 'rejected', notes?: string) => {
    setApprovals(prev => prev.map(approval =>
      approval.id === approvalId
        ? { ...approval, status, notes, resolvedAt: new Date() }
        : approval
    ));
  };

  const updateProjectRole = (userId: string, projectId: string, updates: Partial<ProjectRole>) => {
    setProjectRoles(prev => prev.map(role =>
      role.userId === userId && role.projectId === projectId 
        ? { ...role, ...updates } 
        : role
    ));
  };

  const addProjectRole = (roleData: Omit<ProjectRole, 'id'>) => {
    const newRole: ProjectRole = {
      ...roleData
    };
    setProjectRoles(prev => [...prev, newRole]);
  };

  return (
    <AppContext.Provider value={{
      applicationName,
      currentUser,
      users,
      projects,
      tasks,
      approvals,
      notifications,
      projectRoles,
      selectedProject,
      setSelectedProject,
      updateTask,
      updateProject,
      createProject,
      createTask,
      updateApproval,
      updateProjectRole,
      addProjectRole,
      isLoading,
      error
    }}>
      {children}
    </AppContext.Provider>
  );
};
